@echo off
echo ========================================================
echo Starting ProfitPilot AI - ML Service (FastAPI)
echo ========================================================
cd /d "%~dp0ml-service"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
pause
