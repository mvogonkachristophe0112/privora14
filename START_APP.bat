@echo off
REM Start Privora14 Application

REM Backend on port 3001
start "Privora14 Backend" cmd /k "cd /d C:\Users\ULRICH01\Documents\privora14\backend && npm run start:dev"

REM Wait for backend to start
timeout /t 5

REM Frontend on port 3000
start "Privora14 Frontend" cmd /k "cd /d C:\Users\ULRICH01\Documents\privora14\frontend && npm run dev"

echo.
echo ======================================
echo Privora14 Application Started!
echo ======================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Open your browser and navigate to:
echo http://localhost:3000
echo.
pause
