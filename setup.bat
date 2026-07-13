# Windows setup script for Finance Tracker

@echo off
echo.
echo 🚀 Finance Tracker - Local Setup Script (Windows)
echo ================================================
echo.

REM Check Python version
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.11 or higher.
    pause
    exit /b 1
)

REM Check Node version
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20 or higher.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Copy .env if not exists
if not exist ..\.env (
    copy ..\.env.example ..\.env
    echo ⚠️  Created .env file. Please configure it with your database credentials.
)

echo ✅ Backend setup complete
cd ..
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd frontend
call npm install
echo ✅ Frontend setup complete
cd ..
echo.

echo 🎉 Setup complete!
echo.
echo To start development:
echo   Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python manage.py runserver
echo   Frontend: cd frontend ^&^& npm run dev
echo.
echo 📚 For more information, see README.md
echo.
pause
