@echo off
REM CyberPress Platform - Quick Start Script for Windows
REM 快速启动脚本 (Windows)

echo ========================================
echo CyberPress Platform - Quick Start
echo ========================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed
    echo Please install Docker Desktop first
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM 检查Docker Compose是否可用
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not available
    pause
    exit /b 1
)

echo [OK] Docker Compose is available
echo.

REM 检查并创建环境变量文件
if not exist backend\.env (
    echo [WARNING] backend\.env not found, creating from example...
    copy backend\.env.example backend\.env
    echo [OK] Created backend\.env
)

if not exist frontend\.env.local (
    echo [WARNING] frontend\.env.local not found, creating from example...
    copy frontend\.env.local.example frontend\.env.local
    echo [OK] Created frontend\.env.local
)

echo.
echo Please choose startup mode:
echo 1. Docker Compose (Recommended)
echo 2. Start Frontend only
echo 3. Start Backend only
echo 4. Stop all services
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto docker_start
if "%choice%"=="2" goto frontend_start
if "%choice%"=="3" goto backend_start
if "%choice%"=="4" goto stop_services
goto invalid_choice

:docker_start
echo.
echo [INFO] Starting all services with Docker Compose...
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Services started successfully!
    echo.
    echo Access URLs:
    echo   Frontend: http://localhost:3000
    echo   Backend:  http://localhost:8000
    echo   API Docs: http://localhost:8000/docs
    echo   PostgreSQL: localhost:5432
    echo   Redis: localhost:6379
    echo.
    echo Useful commands:
    echo   View logs: docker-compose logs -f
    echo   Stop services: quick-start.bat (choose option 4)
    echo.
) else (
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)
goto end

:frontend_start
echo.
echo [INFO] Starting frontend only...
cd frontend

if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
)

echo [INFO] Starting development server...
call npm run dev
goto end

:backend_start
echo.
echo [INFO] Starting backend only...
cd backend

if not exist venv (
    echo [INFO] Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

if not exist requirements.txt (
    echo [ERROR] requirements.txt not found
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
call pip install -r requirements.txt

echo [INFO] Starting FastAPI server...
call uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
goto end

:stop_services
echo.
echo [INFO] Stopping all services...
docker-compose down

if %errorlevel% equ 0 (
    echo [SUCCESS] Services stopped successfully
) else (
    echo [ERROR] Failed to stop services
)
goto end

:invalid_choice
echo.
echo [ERROR] Invalid choice
pause
exit /b 1

:end
echo.
echo For more information, see README.md
echo.
pause
