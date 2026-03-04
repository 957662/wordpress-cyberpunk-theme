@echo off
REM ============================================
REM CyberPress 项目启动脚本 (Windows)
REM ============================================

setlocal enabledelayedexpansion

REM 项目根目录
set "PROJECT_ROOT=%~dp0"
set "BACKEND_DIR=%PROJECT_ROOT%backend"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

REM 颜色设置 (Windows 10+)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM 显示横幅
:show_banner
cls
echo ==============================================
echo        🚀 CyberPress Platform
echo ==============================================
echo.
goto :eof

REM 检查命令是否存在
:command_exists
where %1 >nul 2>&1
exit /b

REM 检查依赖
:check_dependencies
echo %INFO% 检查系统依赖...

REM 检查 Node.js
call :command_exists node
if errorlevel 1 (
    echo %ERROR% 缺少依赖: nodejs
    echo 请先安装 Node.js: https://nodejs.org/
    exit /b 1
) else (
    echo %SUCCESS% Node.js 已安装
)

REM 检查 npm
call :command_exists npm
if errorlevel 1 (
    echo %ERROR% 缺少依赖: npm
    exit /b 1
) else (
    echo %SUCCESS% npm 已安装
)

REM 检查 Python
call :command_exists python
if errorlevel 1 (
    echo %ERROR% 缺少依赖: python
    echo 请先安装 Python: https://www.python.org/
    exit /b 1
) else (
    echo %SUCCESS% Python 已安装
)

echo %SUCCESS% 所有依赖已安装
goto :eof

REM 检查环境变量文件
:check_env_files
echo %INFO% 检查环境变量文件...

REM 检查后端环境变量
if not exist "%BACKEND_DIR%\.env" (
    echo %WARNING% 后端 .env 文件不存在
    if exist "%BACKEND_DIR%\.env.template" (
        echo %INFO% 从模板创建 .env 文件...
        copy "%BACKEND_DIR%\.env.template" "%BACKEND_DIR%\.env" >nul
        echo %WARNING% 请编辑 %BACKEND_DIR%\.env 并填入正确的配置
    ) else if exist "%BACKEND_DIR%\.env.example" (
        echo %INFO% 从模板创建 .env 文件...
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo %WARNING% 请编辑 %BACKEND_DIR%\.env 并填入正确的配置
    ) else (
        echo %ERROR% 无法找到 .env 模板文件
        exit /b 1
    )
)

REM 检查前端环境变量
if not exist "%FRONTEND_DIR%\.env.local" (
    echo %WARNING% 前端 .env.local 文件不存在
    if exist "%FRONTEND_DIR%\.env.template" (
        echo %INFO% 从模板创建 .env.local 文件...
        copy "%FRONTEND_DIR%\.env.template" "%FRONTEND_DIR%\.env.local" >nul
        echo %WARNING% 请编辑 %FRONTEND_DIR%\.env.local 并填入正确的配置
    ) else if exist "%FRONTEND_DIR%\.env.example" (
        echo %INFO% 从模板创建 .env.local 文件...
        copy "%FRONTEND_DIR%\.env.example" "%FRONTEND_DIR%\.env.local" >nul
        echo %WARNING% 请编辑 %FRONTEND_DIR%\.env.local 并填入正确的配置
    ) else (
        echo %ERROR% 无法找到 .env 模板文件
        exit /b 1
    )
)

echo %SUCCESS% 环境变量文件检查完成
goto :eof

REM 安装后端依赖
:install_backend_deps
echo %INFO% 检查后端依赖...

cd /d "%BACKEND_DIR%"

if not exist "venv" (
    echo %INFO% 创建 Python 虚拟环境...
    python -m venv venv
)

echo %INFO% 激活虚拟环境并安装依赖...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt

echo %SUCCESS% 后端依赖安装完成
goto :eof

REM 安装前端依赖
:install_frontend_deps
echo %INFO% 检查前端依赖...

cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo %INFO% 安装前端依赖...
    call npm install
    echo %SUCCESS% 前端依赖安装完成
) else (
    echo %SUCCESS% 前端依赖已存在
)
goto :eof

REM 初始化数据库
:init_database
echo %INFO% 初始化数据库...

cd /d "%BACKEND_DIR%"
call venv\Scripts\activate.bat
python scripts\init_database.py init

echo %SUCCESS% 数据库初始化完成
goto :eof

REM 启动后端服务
:start_backend
echo %INFO% 启动后端服务...

cd /d "%BACKEND_DIR%"
call venv\Scripts\activate.bat

REM 在新窗口启动后端
start "CyberPress Backend" cmd /k "python main.py"

REM 等待服务启动
timeout /t 3 /nobreak >nul

echo %SUCCESS% 后端服务已启动
echo %INFO% 后端地址: http://localhost:8000
echo %INFO% API 文档: http://localhost:8000/api/docs
goto :eof

REM 启动前端服务
:start_frontend
echo %INFO% 启动前端服务...

cd /d "%FRONTEND_DIR%"

REM 在新窗口启动前端
start "CyberPress Frontend" cmd /k "npm run dev"

REM 等待服务启动
timeout /t 5 /nobreak >nul

echo %SUCCESS% 前端服务已启动
echo %INFO% 前端地址: http://localhost:3000
goto :eof

REM 显示状态
:show_status
echo %INFO% 服务状态:
echo.
echo 使用浏览器访问以下地址:
echo   前端: http://localhost:3000
echo   后端: http://localhost:8000
echo   API文档: http://localhost:8000/api/docs
echo.
goto :eof

REM 显示帮助
:show_help
echo 用法: start.bat [命令]
echo.
echo 可用命令:
echo   start       - 启动所有服务 (默认)
echo   stop        - 停止所有服务
echo   install     - 安装所有依赖
echo   init        - 初始化数据库
echo   backend     - 仅启动后端服务
echo   frontend    - 仅启动前端服务
echo   help        - 显示此帮助信息
echo.
echo 示例:
echo   start.bat          # 启动所有服务
echo   start.bat install  # 安装依赖
echo   start.bat init     # 初始化数据库
goto :eof

REM 主函数
:main
call :show_banner

REM 创建日志目录
if not exist "%BACKEND_DIR%\logs" mkdir "%BACKEND_DIR%\logs"
if not exist "%FRONTEND_DIR%\logs" mkdir "%FRONTEND_DIR%\logs"

set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=start"

if "%COMMAND%"=="start" (
    call :check_dependencies
    call :check_env_files
    call :install_backend_deps
    call :install_frontend_deps
    call :init_database
    call :start_backend
    call :start_frontend
    call :show_status
    echo.
    echo %SUCCESS% 所有服务已启动!
    echo %INFO% 按 Ctrl+C 停止服务
) else if "%COMMAND%"=="install" (
    call :check_dependencies
    call :install_backend_deps
    call :install_frontend_deps
    echo %SUCCESS% 依赖安装完成!
) else if "%COMMAND%"=="init" (
    call :check_env_files
    call :install_backend_deps
    call :init_database
) else if "%COMMAND%"=="backend" (
    call :check_dependencies
    call :check_env_files
    call :start_backend
) else if "%COMMAND%"=="frontend" (
    call :check_dependencies
    call :check_env_files
    call :start_frontend
) else if "%COMMAND%"=="help" (
    call :show_help
) else (
    echo %ERROR% 未知命令: %COMMAND%
    call :show_help
    exit /b 1
)

endlocal
