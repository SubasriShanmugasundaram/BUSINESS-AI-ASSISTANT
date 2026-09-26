@echo off
echo ========================================================
echo Starting BizPartner AI - ML Service (FastAPI)
echo ========================================================
cd ml-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
pause
