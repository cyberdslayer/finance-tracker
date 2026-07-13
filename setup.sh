#!/bin/bash
# Installation script for local development setup

echo "🚀 Finance Tracker - Local Setup Script"
echo "========================================"

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

# Check Node version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

echo "✅ Python and Node.js are installed"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate 2>/dev/null || venv\Scripts\activate.bat
pip install -r requirements.txt

# Copy .env if not exists
if [ ! -f ../.env ]; then
    cp ../.env.example ../.env
    echo "⚠️  Created .env file. Please configure it with your database credentials."
fi

echo "✅ Backend setup complete"
cd ..
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
echo "✅ Frontend setup complete"
cd ..
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "📚 For more information, see README.md"
