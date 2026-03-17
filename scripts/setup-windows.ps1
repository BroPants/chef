# Chef 项目 - Windows 一键环境配置
# 用法：在项目根目录执行 .\scripts\setup-windows.ps1
# 前提：已安装 Node（建议通过 fnm + .nvmrc 使用项目指定版本，与系统隔离）

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ServerDir = Join-Path $ProjectRoot "server"

Write-Host "Chef Windows 环境配置" -ForegroundColor Cyan
Write-Host "项目根目录: $ProjectRoot" -ForegroundColor Gray
Write-Host ""

# 检查 Node
try {
    $nodeVersion = node -v 2>$null
    if (-not $nodeVersion) { throw "未找到 node" }
    Write-Host "[OK] Node: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js。请先安装 fnm 或 nvm-windows 并在本目录执行 fnm use / nvm use 18。" -ForegroundColor Red
    Write-Host "参考: docs/SETUP-WINDOWS.md" -ForegroundColor Yellow
    exit 1
}

# 可选：检查版本是否 >= 18
$major = [int](node -v -replace 'v(\d+)\..*', '$1')
if ($major -lt 18) {
    Write-Host "[警告] 当前 Node 版本低于 18，建议使用 .nvmrc 中的版本（fnm use / nvm use 18）" -ForegroundColor Yellow
}

# 进入 server 并安装依赖
Set-Location $ServerDir
if (-not (Test-Path "package.json")) {
    Write-Host "[错误] 未找到 server/package.json" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "正在安装后端依赖 (server/node_modules) ..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] npm install 失败" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] 依赖安装完成" -ForegroundColor Green

# 复制 .env
$envExample = Join-Path $ServerDir ".env.example"
$envFile   = Join-Path $ServerDir ".env"
if (Test-Path $envExample) {
    if (-not (Test-Path $envFile)) {
        Copy-Item $envExample $envFile
        Write-Host "[OK] 已复制 .env.example -> .env，请按需编辑 server/.env" -ForegroundColor Green
    } else {
        Write-Host "[跳过] .env 已存在" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "配置完成。启动后端: cd server; npm run dev" -ForegroundColor Cyan
Write-Host "详见: docs/SETUP-WINDOWS.md" -ForegroundColor Gray
