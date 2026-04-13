const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const KIMI_VISION_MODEL = 'moonshot-v1-8k-vision-preview';
const KIMI_TEXT_MODEL = 'moonshot-v1-8k';

const RECIPE_SYSTEM_PROMPT = '你是一位专业的中餐厨师助手，擅长通过菜品照片识别菜名并给出详细菜谱。请严格按照指定 JSON 格式返回结果，不要输出任何额外文字、Markdown 代码块标记或解释。所有食材用量必须是精确数字，严禁使用"适量"、"少许"、"适当"、"若干"等模糊描述，必须给出具体克数、毫升数或个数。';

const VISION_USER_PROMPT = `请仔细观察这张图片中的菜品，完成以下任务：
1. 识别菜品名称
2. 列出所需食材（以2人份为基准，每种食材的用量必须是精确数字，不得使用"适量"等模糊描述）
3. 给出详细的制作步骤

如果图片中包含多道菜，识别最主要的那道。
如果图片模糊、无法识别为菜品，将 success 设为 false。

按如下 JSON 格式返回，不要输出任何其他内容：

成功时：
{"success":true,"dishName":"菜品名称","recipe":{"ingredients":[{"name":"食材名","amount":数字,"unit":"单位"},{"name":"食材名","amount":数字,"unit":"单位"}],"steps":["第一步","第二步"]}}

失败时：
{"success":false,"message":"未能识别菜品，请换一张更清晰的图片"}

food ingredient unit examples: g(克)、ml(毫升)、个、瓣、片、根、条、只、勺`;

/**
 * 从上传 URL 读取图片，压缩后转为 base64
 * 压缩策略：长边缩至 1024px，JPEG quality 80，发送体积一般 < 200KB
 */
async function imageUrlToBase64(imageUrl) {
  const urlPath = imageUrl.replace(/^https?:\/\/[^/]+/, '');
  const filePath = path.join(__dirname, '../../', urlPath);
  const buffer = fs.readFileSync(filePath);

  const compressed = await sharp(buffer)
    .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const originalKB = Math.round(buffer.length / 1024);
  const compressedKB = Math.round(compressed.length / 1024);
  console.log(`图片压缩：${originalKB}KB → ${compressedKB}KB`);

  return { base64: compressed.toString('base64'), mime: 'image/jpeg' };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 通用 Kimi 文本请求（无图片）
 */
async function kimiTextRequest(systemPrompt, userPrompt) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) throw new Error('未配置 KIMI_API_KEY，请在 server/.env 中添加');

  const response = await axios.post(
    KIMI_API_URL,
    {
      model: KIMI_TEXT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const content = response.data.choices[0].message.content.trim();
  console.log('[AI text response]', content.slice(0, 200));

  const match = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error('模型未返回有效 JSON');
  return JSON.parse(match[0]);
}

/**
 * 图片识别菜品（带重试）
 */
async function recognizeDish(imageUrl) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) throw new Error('未配置 KIMI_API_KEY，请在 server/.env 中添加');

  const { base64, mime } = await imageUrlToBase64(imageUrl);

  const response = await axios.post(
    KIMI_API_URL,
    {
      model: KIMI_VISION_MODEL,
      messages: [
        { role: 'system', content: RECIPE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
            { type: 'text', text: VISION_USER_PROMPT }
          ]
        }
      ],
      temperature: 0.3
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );

  const content = response.data.choices[0].message.content.trim();
  console.log('[AI vision response]', content);

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('模型未返回有效 JSON');
  return JSON.parse(match[0]);
}

async function recognizeDishSafe(imageUrl) {
  const retryDelays = [5000, 10000];
  let lastErr;
  for (let i = 0; i <= retryDelays.length; i++) {
    try {
      return await recognizeDish(imageUrl);
    } catch (err) {
      const status = err.response?.status;
      if (status === 429 && i < retryDelays.length) {
        console.log(`触发限流，${retryDelays[i] / 1000}s 后自动重试（第 ${i + 1} 次）`);
        await sleep(retryDelays[i]);
        lastErr = err;
        continue;
      }
      if (status === 429) throw new Error('识别请求过于频繁，请稍等片刻后重试');
      if (status === 401) throw new Error('Kimi API Key 无效，请检查 .env 配置');
      if (status === 400) throw new Error('图片格式或大小不支持，请换一张图片');
      throw err;
    }
  }
  throw lastErr;
}

/**
 * 根据菜品名生成菜谱（纯文本，不需要图片）
 */
async function generateRecipe(dishName) {
  const systemPrompt = '你是一位专业的中餐厨师助手。请严格按照指定 JSON 格式返回菜谱，不要输出任何额外文字或 Markdown 标记。所有食材用量必须是精确数字，不得使用"适量"等模糊描述。';
  const userPrompt = `请给出菜品「${dishName}」的详细菜谱（以2人份为基准）。

按如下 JSON 格式返回，不要输出任何其他内容：
{"success":true,"dishName":"${dishName}","recipe":{"ingredients":[{"name":"食材名","amount":数字,"unit":"单位"}],"steps":["第一步","第二步"]}}

food ingredient unit examples: g(克)、ml(毫升)、个、瓣、片、根、条、只、勺`;

  return kimiTextRequest(systemPrompt, userPrompt);
}

/**
 * 根据现有食材推荐可做菜品
 * @param {string[]} ingredients 食材列表，如 ['番茄', '鸡蛋', '猪肉']
 * @returns {{ dishes: Array<{ name, description, matchedIngredients, missingKey }> }}
 */
async function suggestByIngredients(ingredients) {
  const systemPrompt = '你是一位专业的中餐厨师助手，擅长根据现有食材推荐菜品。请严格按照指定 JSON 格式返回，不要输出任何额外文字或 Markdown 标记。';
  const userPrompt = `用户现有以下食材：${ingredients.join('、')}

请推荐4~5道适合的中国菜。对每道菜返回以下信息：
- name：菜品名称（中文）
- description：一句话描述口味或特色（不超过20字）
- matchedIngredients：用到了哪些用户已有食材（数组）
- missingKey：最关键的缺少食材，若无缺少则为 null

按如下 JSON 格式返回，不要输出任何其他内容：
{"dishes":[{"name":"菜名","description":"描述","matchedIngredients":["食材1","食材2"],"missingKey":"食材名或null"}]}

要求：
1. 优先推荐能用到大部分现有食材的菜品
2. 包含不同难度和烹饪方式的菜品
3. 只返回 JSON，不要有任何其他说明`;

  return kimiTextRequest(systemPrompt, userPrompt);
}

module.exports = {
  recognizeDish: recognizeDishSafe,
  generateRecipe,
  suggestByIngredients
};
