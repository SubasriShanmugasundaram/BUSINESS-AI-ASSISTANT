from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.forecast import (
    SalesForecastRequest, SalesForecastResponse,
    InventoryForecastRequest, InventoryForecastResponse,
    PurchaseRecommendationResponse
)
from app.services.forecasting_engine import ForecastingEngine

app = FastAPI(
    title="BizPartner AI - ML Microservice",
    description="Intelligent Forecasting, Demand Prediction, and Inventory Stockout Analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "BizPartner AI - ML Microservice",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict/sales", response_model=SalesForecastResponse)
def predict_sales(request: SalesForecastRequest):
    return ForecastingEngine.forecast_sales(request.history, request.days_ahead)

@app.post("/predict/inventory", response_model=InventoryForecastResponse)
def predict_inventory(request: InventoryForecastRequest):
    return ForecastingEngine.forecast_inventory(request.items)

@app.post("/recommendations/purchase", response_model=PurchaseRecommendationResponse)
def get_purchase_recommendations(request: InventoryForecastRequest):
    return ForecastingEngine.generate_recommendations(request.items)
