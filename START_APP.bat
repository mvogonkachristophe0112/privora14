@echo off
REM Start Privora14 Application

REM Get current IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set IP=%%a
set IP=%IP:~1%

REM Backend on port 3001
start "Privora14 Backend" cmd /k "cd /d C:\Users\ULRICH01\Documents\privora14\backend && npm run start:dev"

REM Wait for backend to start
timeout /t 5

REM Frontend on port 3000 with network binding
start "Privora14 Frontend" cmd /k "cd /d C:\Users\ULRICH01\Documents\privora14\frontend && npx next dev --hostname 0.0.0.0"

echo.
echo ======================================
echo Privora14 Application Started!
echo ======================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Network Access:
echo Frontend: http://%IP%:3000
echo Backend:  http://%IP%:3001
echo.
echo Open your browser and navigate to:
echo http://localhost:3000
echo.
echo Or from other devices on your network:
echo http://%IP%:3000
echo.
pause
