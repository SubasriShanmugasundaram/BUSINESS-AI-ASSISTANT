@echo off
echo ========================================================
echo Starting ProfitPilot AI - Backend (Spring Boot 3)
echo ========================================================
cd /d "%~dp0backend"
if exist "..\backend-tools\apache-maven-3.9.6\bin\mvn.cmd" (
    ..\backend-tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
) else (
    mvn spring-boot:run
)
pause
