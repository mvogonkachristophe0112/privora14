@echo off
echo ========================================
echo Privora 14 - Build Test Script
echo ========================================
echo.

echo [1/4] Testing Frontend Build...
echo ----------------------------------------
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    cd ..
    pause
    exit /b 1
)
echo SUCCESS: Frontend build completed!
cd ..
echo.

echo [2/4] Testing Backend Build...
echo ----------------------------------------
cd backend
call npx prisma generate
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed!
    cd ..
    pause
    exit /b 1
)
echo SUCCESS: Backend build completed!
cd ..
echo.

echo [3/4] Checking Build Artifacts...
echo ----------------------------------------
if exist "frontend\.next" (
    echo ✓ Frontend build output found
) else (
    echo ✗ Frontend build output missing
)

if exist "backend\dist" (
    echo ✓ Backend build output found
) else (
    echo ✗ Backend build output missing
)
echo.

echo [4/4] Build Summary
echo ----------------------------------------
echo ✓ All builds completed successfully!
echo.
echo Next steps:
echo 1. Commit your changes: git add . ^&^& git commit -m "fix: deployment configuration"
echo 2. Push to GitHub: git push origin main
echo 3. Vercel and Render will automatically deploy
echo 4. Check /about page for build info
echo.
pause
