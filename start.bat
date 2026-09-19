@echo off

echo Starting backend...
start "Backend" cmd /k "cd backend && uv run fastapi dev src/backend/main.py"

echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
