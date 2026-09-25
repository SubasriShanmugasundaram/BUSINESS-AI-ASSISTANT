# BizPartner AI – REST API Specification

All API endpoints are prefixed with `/api` and return standardized JSON payloads.

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Register a new business owner.
- `POST /api/auth/login`: Authenticate and obtain JWT token.
- `POST /api/auth/logout`: Invalidate session.
- `GET /api/auth/me`: Retrieve currently logged-in user profile.

## 2. Business Profile (`/api/business-profile`)
- `GET /api/business-profile`: Retrieve active business identity & GSTIN.
- `PUT /api/business-profile`: Update business identity, address, phone, and branding.

## 3. Customer Khata (`/api/customers`)
- `GET /api/customers`: List all customers.
- `POST /api/customers`: Create a new customer record.
- `GET /api/customers/{id}`: Customer profile with purchase history.
- `PUT /api/customers/{id}`: Update customer contact details.
- `DELETE /api/customers/{id}`: Remove customer.
- `GET /api/customers/search?query=`: Search across name, phone, email.

## 4. Product Catalog (`/api/products`)
- `GET /api/products`: List all products with computed profit margins and SKUs.
- `POST /api/products`: Add new product to catalog.
- `GET /api/products/{id}`: Get product by ID.
- `PUT /api/products/{id}`: Update product price, cost, description.
- `DELETE /api/products/{id}`: Archive/delete product.
- `GET /api/products?category=`: Filter by category.
- `GET /api/products/search?query=`: Search by name or category.

## 5. POS & Sales (`/api/sales`)
- `GET /api/sales`: Retrieve all sales ledger transactions.
- `POST /api/sales`: Create atomic multi-item sale, deduct stock, log movement.
- `GET /api/sales/{id}`: Get complete sale details with line items.
- `PUT /api/sales/{id}`: Modify transaction notes or status.
- `DELETE /api/sales/{id}`: Cancel/delete sale.
- `GET /api/sales/search?query=`: Search by invoice number or customer.
- `GET /api/sales?startDate=&endDate=`: Filter sales by date range.

## 6. Inventory & Audits (`/api/inventory`, `/api/stock-movements`)
- `GET /api/inventory`: Full inventory overview with valuation.
- `GET /api/inventory/low-stock`: Filter items where stock <= reorderLevel.
- `GET /api/inventory/out-of-stock`: Filter zero-stock items.
- `PUT /api/inventory/{productId}`: Update currentStock or reorderLevel.
- `GET /api/inventory/search?keyword=`: Filter inventory records.
- `GET /api/stock-movements`: Historical audit log of all stock changes.
- `POST /api/stock-movements`: Record stock adjustments, purchases, or returns.

## 7. Expense Management (`/api/expenses`)
- `GET /api/expenses`: List all operating expenses.
- `POST /api/expenses`: Log new expense.
- `PUT /api/expenses/{id}`: Update expense details.
- `DELETE /api/expenses/{id}`: Remove expense record.
- `GET /api/expenses/summary/by-category`: Aggregated totals grouped by expense category.
- `GET /api/expenses/total`: Total expense within date window.

## 8. Dashboard & Analytics (`/api/dashboard`, `/api/reports`)
- `GET /api/dashboard/stats`: 5 core KPI cards, recent transactions, sales velocity.
- `GET /api/reports/sales-summary`: Aggregated financial summary (Gross revenue, net profit, orders).
- `GET /api/reports/top-products`: Ranked list of best-selling products.
- `GET /api/reports/payment-distribution`: Breakdown of payment channels (UPI, Cash, Card).
- `GET /api/reports/daily-revenue`: Daily revenue timeline.

## 9. AI & Machine Learning (`/api/forecasts`, `/api/recommendations`, `/api/alerts`, `/api/ai`)
- `GET /api/forecasts/sales`: 7-day to 30-day predicted demand.
- `GET /api/forecasts/inventory`: Estimated stockout date and stock coverage days.
- `GET /api/recommendations/purchases`: Automated purchase quantities with reasoning.
- `GET /api/alerts`: Active business alerts (Low stock, high expenses, sudden drops).
- `POST /api/ai/chat`: Business-data-aware Gemini AI assistant.
