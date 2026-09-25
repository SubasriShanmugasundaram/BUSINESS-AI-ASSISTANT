@echo off
echo ========================================================
echo Starting BizPartner AI - Backend (Spring Boot 3)
echo ========================================================
cd backend
..\backend-tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
