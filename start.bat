@echo off
echo ========================================================
echo   Starting SwiftDocs PDF Converter Suite
echo ========================================================
echo.

echo Starting Python Flask Backend on port 5000...
start "SwiftDocs Backend" cmd /k "cd server && .venv\Scripts\python app.py"

echo Starting Vite React Frontend on port 3000...
start "SwiftDocs Frontend" cmd /k "cd client && npm.cmd run dev"

echo.
echo ========================================================
echo   SwiftDocs is launching!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================================
