# Chef

通过拍摄已做好的菜品，识别菜品并展示所需食材与制作方法的微信小程序。

## 项目结构

```
chef/
├── docs/                # 开发文档
│   ├── PRD.md          # 产品需求文档
│   └── ROADMAP.md      # 开发路线图
├── miniprogram/        # 小程序前端
├── server/             # Node.js 后端服务
└── README.md
```

## 快速开始

> **Windows 用户**：为与系统环境隔离，建议先按 [Windows 环境配置说明](docs/SETUP-WINDOWS.md) 安装 Node 版本管理器（fnm/nvm-windows）后再执行下列步骤。

### 1. 启动后端

```bash
cd server
cp .env.example .env   # 可选：配置微信 AppID/Secret 用于登录（Windows: copy .env.example .env）
npm install
npm run dev
```

服务默认运行在 `http://localhost:3000`。

### 2. 启动小程序

1. 使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 `miniprogram` 目录
2. 在 `miniprogram/utils/config.js` 中确认接口地址配置：
   - `develop`：本机联调地址，默认 `http://localhost:3000`
   - `trial`：小范围内测用的公网 HTTPS 地址
   - `release`：正式环境地址
3. 开发者工具中勾选「不校验合法域名」以便本地调试
4. 编译运行

### 3. 小范围内测

如果要把体验版发给其他微信用户试用：

1. 先把后端通过云服务器或内网穿透暴露成公网 `https` 地址
2. 将 `miniprogram/utils/config.js` 里的 `trial` 改成该公网地址
3. 重新上传小程序体验版
4. 在微信公众平台添加体验成员并分发体验版二维码

### 4. 配置微信登录（可选）

在 `server/.env` 中填写：

```
WECHAT_APPID=你的小程序AppID
WECHAT_SECRET=你的小程序AppSecret
```

## 技术栈

- **前端**：微信小程序（原生）
- **后端**：Node.js + Express
- **AI 识别**：MVP 阶段为 mock，可替换为腾讯云/百度等视觉 API
- **菜谱**：MVP 内置数据，可扩展为数据库或第三方 API

## 开发路径

开发前请先阅读：

1. **[产品需求文档 (PRD)](./docs/PRD.md)** - 功能需求、用户流程、技术需求
2. **[开发路线图 (ROADMAP)](./docs/ROADMAP.md)** - 分阶段开发计划与里程碑

## License

（待定）
