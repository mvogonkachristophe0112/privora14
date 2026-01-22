@echo off
echo Network Diagnostics for Privora 14
echo ===================================

echo 1. IP Configuration:
ipconfig | findstr "IPv4"

echo.
echo 2. Ping Test to Local IP:
ping -n 4 172.20.10.4

echo.
echo 3. Check Ports:
netstat -an | findstr ":3000" | findstr LISTENING
netstat -an | findstr ":3001" | findstr LISTENING

echo.
echo 4. Health Check Backend:
curl -s http://172.20.10.4:3001/health || echo Backend not reachable

echo.
echo 5. Health Check Frontend:
curl -s http://172.20.10.4:3000 | head -n 5 || echo Frontend not reachable

echo.
echo Diagnostics Complete.