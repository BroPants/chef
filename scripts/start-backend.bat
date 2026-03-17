@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0..\server"
if not exist ".env" copy ".env.example" ".env"
echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed. Make sure Node is in PATH ^(e.g. run "fnm use" or "nvm use 18" first^).
    pause
    exit /b 1
)
echo [2/2] Starting backend...
call npm run dev
pause
