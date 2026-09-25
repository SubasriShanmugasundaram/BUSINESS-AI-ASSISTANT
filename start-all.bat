@echo off
echo ========================================================
echo Launching BizPartner AI (Module 1 Full Stack)
echo ========================================================
start "BizPartner AI - Backend" run-backend.bat
start "BizPartner AI - Frontend" run-frontend.bat
echo Both services are starting in separate terminal windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080/api
pause
