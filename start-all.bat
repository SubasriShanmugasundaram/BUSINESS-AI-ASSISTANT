@echo off
echo ========================================================
echo Launching ProfitPilot AI - Full Stack Platform
echo ========================================================
cd /d "%~dp0"
start "ProfitPilot AI - Backend" run-backend.bat
start "ProfitPilot AI - ML Service" run-ml.bat
start "ProfitPilot AI - Frontend" run-frontend.bat
echo Starting all microservices...
echo  - Frontend Web UI:      http://localhost:5173
echo  - Spring Boot Backend:  http://localhost:8080/api
echo  - Python ML Engine:     http://localhost:8000/docs
echo ========================================================
timeout /t 4 /nobreak >nul
start http://localhost:5173
pause
