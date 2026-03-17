# Chef 项目 - Windows 运行环境配置

> 本文档说明在 Windows 上配置 Chef 开发环境，并**与系统原生环境隔离**（不污染系统 Node、不混用全局依赖）。

---

## 1. 隔离策略概览

| 项目 | 说明 |
|------|------|
| **Node 版本** | 使用 fnm 或 nvm-windows，仅在本项目目录下使用指定 Node 版本，不改动系统已安装的 Node（若有） |
| **依赖** | 所有 npm 包安装在 `server/node_modules/`，不依赖全局 `npm install -g` |
| **环境变量** | 使用 `server/.env` 存放密钥，不提交到 Git，不写入系统环境变量 |

---

## 2. 安装 Node 版本管理器（二选一，推荐 fnm）

### 方式 A：fnm（推荐，跨平台一致）

1. **安装 fnm**（需先安装 [winget](https://learn.microsoft.com/zh-cn/windows/package-manager/winget/)）：
   ```powershell
   winget install Schniz.fnm
   ```

2. **允许当前用户执行脚本**（若未改过可跳过）：
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **配置 PowerShell 使 fnm 生效**：  
   若首次使用 fnm，需让 shell 在进入目录时自动切换 Node 版本：
   ```powershell
   # 若无 profile 则先创建
   if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
   notepad $PROFILE
   ```
   在打开的文件末尾添加：
   ```powershell
   fnm env --use-on-cd | Out-String | Invoke-Expression
   ```
   保存后**重新打开 PowerShell**。

4. **进入项目并安装/使用 Node**：
   ```powershell
   cd C:\Users\46042\Desktop\code\chef
   fnm install    # 按 .nvmrc 安装对应版本
   fnm use        # 使用 .nvmrc 中的版本
   node -v        # 应显示 v18.x.x
   ```
   此后每次 `cd` 到本项目目录，fnm 会自动使用 `.nvmrc` 中的版本，与系统其他路径隔离。

### 方式 B：nvm-windows

1. 从 [nvm-windows  releases](https://github.com/coreybutler/nvm-windows/releases) 下载并安装 `nvm-setup.exe`。
2. 在**以管理员身份**打开的命令提示符或 PowerShell 中：
   ```powershell
   cd C:\Users\46042\Desktop\code\chef
   nvm install 18
   nvm use 18
   ```
3. 在本项目下开发时使用 `nvm use 18`，其他目录不受影响。

---

## 3. 配置项目运行环境

在**项目根目录** `chef` 下操作（已用 fnm/nvm 切到 Node 18 后）：

```powershell
# 进入后端目录
cd server

# 安装依赖（仅写入 server/node_modules，与系统隔离）
npm install

# 复制环境变量模板（按需编辑 .env，勿提交）
copy .env.example .env

# 启动开发服务
npm run dev
```

服务默认运行在 `http://localhost:3000`。

---

## 4. 可选：编辑 .env

用任意编辑器打开 `server\.env`，按需填写（本地调试可先保留示例值）：

```env
PORT=3000
WECHAT_APPID=你的小程序AppID
WECHAT_SECRET=你的小程序AppSecret
```

---

## 5. 小程序端

1. 使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开项目下的 **miniprogram** 目录。
2. 在 `miniprogram/utils/config.js` 中确认 `baseUrl` 为 `http://localhost:3000`（或本机实际地址）。
3. 在开发者工具中勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」以便本地联调。

---

## 6. 常见问题

- **PowerShell 提示“无法加载文件，因为在此系统上禁止运行脚本”**  
  执行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`。

- **fnm 安装后仍提示找不到 `node`**  
  确认已在 `$PROFILE` 中加入 fnm 的配置行，并重新打开 PowerShell；或在当前窗口执行一次  
  `fnm env --use-on-cd | Out-String | Invoke-Expression`。

- **端口 3000 被占用**  
  在 `server/.env` 中修改 `PORT=其他端口`，并同步修改小程序 `baseUrl` 中的端口。

- **路径或编码问题**  
  建议项目路径不要包含中文或空格；若使用 Git Bash/WSL，注意换行符为 LF（项目已按此约定）。

---

## 7. 一键脚本（可选）

若已安装 fnm 并配置好 `$PROFILE`，可在项目根目录执行：

```powershell
.\scripts\setup-windows.ps1
```

脚本会检查 Node 版本、安装后端依赖并复制 `.env.example` 为 `.env`（若不存在）。详见脚本内注释。
