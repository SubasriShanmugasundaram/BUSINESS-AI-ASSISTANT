from datetime import datetime, timedelta
from typing import List, Dict
import math
from app.schemas.forecast import (
    HistoricalDataPoint, ProductSalesForecast, SalesForecastResponse,
    InventoryForecastItem, ProductInventoryPrediction, InventoryForecastResponse,
    PurchaseRecommendationItem, PurchaseRecommendationResponse
)

class ForecastingEngine:

    @staticmethod
    def forecast_sales(history: List[HistoricalDataPoint], days_ahead: int = 7) -> SalesForecastResponse:
        # Group by product_id
        grouped: Dict[int, List[HistoricalDataPoint]] = {}
        product_meta: Dict[int, Dict] = {}

        for pt in history:
            pid = pt.product_id
            if pid not in grouped:
                grouped[pid] = []
                product_meta[pid] = {
                    "name": pt.product_name,
                    "category": pt.category or "General",
                    "selling_price": pt.selling_price
                }
            grouped[pid].append(pt)

        target_date = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
        results: List[ProductSalesForecast] = []

        for pid, pts in grouped.items():
            meta = product_meta[pid]
            total_qty = sum(p.quantity for p in pts)
            data_points_count = len(pts)

            if data_points_count >= 5:
                # Time-series Weighted Exponential Smoothing
                weights = [math.exp(0.15 * i) for i in range(data_points_count)]
                sum_weights = sum(weights)
                weighted_avg = sum(p.quantity * w for p, w in zip(pts, weights)) / sum_weights
                predicted_qty = max(1, round(weighted_avg * (days_ahead / 3.0)))
                confidence = min(0.92, 0.70 + (data_points_count * 0.02))
                model_name = "Exponential Trend Model (EMA)"
                explanation = (
                    f"Calculated from {data_points_count} transaction batches using exponential decay weights. "
                    f"Recent order momentum indicates steady consumption of ~{round(weighted_avg, 1)} units per cycle."
                )
                coverage = "SUFFICIENT_HISTORY"
            else:
                # Transparent statistical fallback: sample mean extrapolation
                avg_qty = total_qty / max(1, data_points_count)
                predicted_qty = max(1, round(avg_qty * (days_ahead / 7.0) * 1.5))
                confidence = 0.65
                model_name = "Moving Average Fallback"
                explanation = (
                    f"Baseline moving average from {data_points_count} historical sales records ({total_qty} units total). "
                    f"As transaction history grows, model upgrades automatically to exponential time-series."
                )
                coverage = "LIMITED_DATA_FALLBACK"

            predicted_rev = round(predicted_qty * meta["selling_price"], 2)

            results.append(ProductSalesForecast(
                product_id=pid,
                product_name=meta["name"],
                category=meta["category"],
                forecast_date=target_date,
                predicted_quantity=predicted_qty,
                predicted_revenue=predicted_rev,
                confidence=round(confidence, 2),
                model_name=model_name,
                explanation=explanation,
                data_coverage=coverage
            ))

        return SalesForecastResponse(
            forecasts=results,
            model_family="Time-Series & Statistical Adaptive Predictor",
            generated_at=datetime.now().isoformat()
        )

    @staticmethod
    def forecast_inventory(items: List[InventoryForecastItem]) -> InventoryForecastResponse:
        predictions: List[ProductInventoryPrediction] = []
        today = datetime.now().date()

        for item in items:
            total_sold = sum(p.quantity for p in item.sales_history)
            count = len(item.sales_history)

            # Daily demand rate (approximate over 14-day observation window)
            observation_days = 14.0
            daily_demand = max(0.2, total_sold / observation_days if count > 0 else 0.3)
            predicted_7day = max(1, round(daily_demand * 7))

            current_stock = item.current_stock
            if current_stock <= 0:
                coverage_days = 0.0
                stockout_date = today.strftime("%Y-%m-%d")
                risk = "OUT_OF_STOCK"
                explanation = f"Product is currently completely depleted (0 units). Stockout reached."
            else:
                coverage_days = round(current_stock / daily_demand, 1)
                days_until_empty = int(coverage_days)
                stockout_date = (today + timedelta(days=days_until_empty)).strftime("%Y-%m-%d")

                if current_stock <= item.reorder_level or coverage_days <= 7.0:
                    risk = "HIGH"
                    explanation = (
                        f"Stock coverage is only {coverage_days} days at daily velocity of {round(daily_demand, 1)} units/day. "
                        f"Expected to run out on or around {stockout_date}."
                    )
                elif coverage_days <= 14.0:
                    risk = "MODERATE"
                    explanation = f"Moderate stock coverage of {coverage_days} days. Monitor reorder thresholds."
                else:
                    risk = "LOW"
                    explanation = f"Healthy inventory buffer ({coverage_days} days coverage). Safe stock levels."

            predictions.append(ProductInventoryPrediction(
                product_id=item.product_id,
                product_name=item.product_name,
                current_stock=current_stock,
                average_daily_demand=round(daily_demand, 2),
                predicted_7day_demand=predicted_7day,
                stock_coverage_days=coverage_days,
                estimated_stockout_date=stockout_date,
                stockout_risk_level=risk,
                explanation=explanation
            ))

        return InventoryForecastResponse(predictions=predictions)

    @staticmethod
    def generate_recommendations(items: List[InventoryForecastItem]) -> PurchaseRecommendationResponse:
        recs: List[PurchaseRecommendationItem] = []

        for item in items:
            total_sold = sum(p.quantity for p in item.sales_history)
            daily_demand = max(0.25, total_sold / 14.0 if item.sales_history else 0.4)
            predicted_demand_14d = math.ceil(daily_demand * 14)

            current_stock = item.current_stock
            reorder_level = item.reorder_level

            # Target buffer: predicted demand + safety stock (reorder level)
            target_stock = predicted_demand_14d + reorder_level
            deficit = target_stock - current_stock

            if deficit > 0 or current_stock <= reorder_level:
                recommended_qty = max(deficit, reorder_level * 2)

                if current_stock == 0:
                    priority = "HIGH"
                    reason = (
                        f"Immediate action needed: Product is out of stock. "
                        f"Targeting {recommended_qty} units covers expected 14-day demand ({predicted_demand_14d} units) "
                        f"plus reorder buffer ({reorder_level} units)."
                    )
                elif current_stock <= reorder_level:
                    priority = "HIGH"
                    reason = (
                        f"Current stock ({current_stock}) has dropped below reorder safety threshold ({reorder_level}). "
                        f"Recommend purchasing {recommended_qty} units to prevent stockout within {math.ceil(current_stock/daily_demand)} days."
                    )
                else:
                    priority = "MEDIUM"
                    reason = (
                        f"Upcoming replenishment recommended. Demand velocity indicates stock will approach threshold within 10 days."
                    )

                cost = round(recommended_qty * item.purchase_price, 2)

                category = "General"
                if item.sales_history:
                    category = item.sales_history[0].category or "General"

                recs.append(PurchaseRecommendationItem(
                    product_id=item.product_id,
                    product_name=item.product_name,
                    category=category,
                    current_stock=current_stock,
                    reorder_level=reorder_level,
                    predicted_demand=predicted_demand_14d,
                    recommended_quantity=recommended_qty,
                    estimated_cost=cost,
                    priority=priority,
                    reason=reason
                ))

        return PurchaseRecommendationResponse(recommendations=recs)
