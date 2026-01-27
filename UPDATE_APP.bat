@echo off
echo ========================================
echo Privora 14 - Update and Restart
echo ========================================
echo.

echo [1/5] Stopping running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!
echo.

echo [2/5] Pulling latest changes from GitHub...
git fetch origin
git pull origin master
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git pull failed!
    echo.
    echo Possible reasons:
    echo - No internet connection
    echo - Uncommitted local changes
    echo - Merge conflicts
    echo.
    echo Try: git status
    pause
    exit /b 1
)
echo Done!
echo.

echo [3/5] Updating frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Frontend npm install had issues
)
cd ..
echo Done!
echo.

echo [4/5] Updating backend dependencies...
cd backend
call npm install
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Backend setup had issues
)
cd ..
echo Done!
echo.

echo [5/5] Starting application...
echo.
echo ========================================
echo Update Complete!
echo ========================================
echo.
echo Latest commit:
git log -1 --oneline
echo.
echo Starting servers...
echo Frontend: http://172.20.10.4:3000
echo Backend:  http://172.20.10.4:3001
echo.
echo Press any key to start servers...
pause >nul

START_APP.bat
