from pydantic import BaseModel, Field
from typing import List, Optional

class HistoricalDataPoint(BaseModel):
    product_id: int
    product_name: str
    category: Optional[str] = "General"
    date: str  # YYYY-MM-DD
    quantity: int
    selling_price: float
    purchase_price: Optional[float] = 0.0

class SalesForecastRequest(BaseModel):
    days_ahead: int = Field(default=7, ge=1, le=90)
    history: List[HistoricalDataPoint] = []

class ProductSalesForecast(BaseModel):
    product_id: int
    product_name: str
    category: str
    forecast_date: str
    predicted_quantity: int
    predicted_revenue: float
    confidence: float
    model_name: str
    explanation: str
    data_coverage: str

class SalesForecastResponse(BaseModel):
    forecasts: List[ProductSalesForecast]
    model_family: str
    generated_at: str

class InventoryForecastItem(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    reorder_level: int
    purchase_price: float
    selling_price: float
    sales_history: List[HistoricalDataPoint] = []

class InventoryForecastRequest(BaseModel):
    items: List[InventoryForecastItem]

class ProductInventoryPrediction(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    average_daily_demand: float
    predicted_7day_demand: int
    stock_coverage_days: float
    estimated_stockout_date: Optional[str]
    stockout_risk_level: str
    explanation: str

class InventoryForecastResponse(BaseModel):
    predictions: List[ProductInventoryPrediction]

class PurchaseRecommendationItem(BaseModel):
    product_id: int
    product_name: str
    category: str
    current_stock: int
    reorder_level: int
    predicted_demand: int
    recommended_quantity: int
    estimated_cost: float
    priority: str
    reason: str

class PurchaseRecommendationResponse(BaseModel):
    recommendations: List[PurchaseRecommendationItem]
