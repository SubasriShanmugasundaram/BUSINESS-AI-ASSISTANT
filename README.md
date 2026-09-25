# BizPartner AI — Intelligent AI-Powered Business Assistant

> A complete, production-grade business management and autonomous intelligence platform for MSMEs, retail stores, supermarkets, and wholesalers.

---

## 🌟 Executive Overview

**BizPartner AI** goes far beyond basic billing, bookkeeping, or CRUD operations. It executes an end-to-end intelligent lifecycle:

```
RECORD  ───►  ANALYZE  ───►  PREDICT  ───►  RECOMMEND  ───►  ASSIST
 (POS, Stock,  (Financials,   (ARIMA/ML     (Automated      (Multilingual
   Expenses)     Margins)     Forecasting)   Orders)        Gemini Voice)
```

The system pairs a high-performance **Java 17 / Spring Boot 3** backend with a **Python FastAPI ML microservice** and **Google Gemini Generative AI**, presented through a modern **React 18** SaaS interface with full **23-Language** support and voice assistance.

---

## 🚀 Key Modules & Capabilities

1. **Real Authentication & Security (Phase 2):**
   - BCrypt password hashing, stateless JJWT authentication (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`).
   - Role-based authorization (`ROLE_OWNER`, `ROLE_ADMIN`, `ROLE_STAFF`).
   - Protected client-side routing with automatic session persistence.

2. **Store Identity & Business Profile (Phase 3):**
   - Manage business name, tagline, address, phone, email, and GSTIN.
   - Synchronized across invoice headers, tax receipts, and AI contextual awareness.

3. **Core Operations & POS Billing (Phases 4 & 5):**
   - Rapid item picker, barcode/SKU search, category filtering, quantity stepper.
   - Atomic transactional checkout (`@Transactional` with complete rollback on failures).
   - Real-time stock deduction, negative inventory rejection, and automated audit movement logging (`Purchase`, `Sale`, `Adjustment`, `Return`).
   - Multiple tender modes: Cash, UPI, Card, Bank Transfer.

4. **Customer Khata & CRM (Phase 6):**
   - Full customer directory with search across name, phone, and email (`/api/customers/search`).
   - Detailed ledger tracking past transactions, total purchases, and outstanding khata.

5. **Inventory Control & Audit Movements (Phase 7):**
   - Real-time stock status (`IN STOCK`, `LOW STOCK`, `OUT OF STOCK`).
   - Reorder threshold alerts and warehouse inventory valuation.
   - Stock adjustment modal with full audit movement history.

6. **Expense Tracking & Net Profit Calculation (Phase 8):**
   - Expense categories: `Rent`, `Salary`, `Electricity`, `Purchase`, `Transportation`, `Marketing`, `Maintenance`, `Other`.
   - Live **Net Operating Profit** calculation: `Net Profit = Gross Revenue − Operating Expenses`.

7. **Reports & Executive Analytics (Phases 9 & 10):**
   - 5 Primary KPIs + Net Profit + Live Stock Valuation.
   - Interactive SVG revenue trend charts, top 5 products ranking, payment distribution share.
   - Identification of fast-moving vs slow-moving inventory.

8. **Professional Invoicing & Thermal Printing (Phase 11):**
   - Automatic invoice numbering (`INV-YYYY-XXXX`).
   - `@media print` CSS optimized for thermal receipt printers and standard A4 printing (`window.print()`).

9. **GST Compliance & Return Reminders (Phase 12):**
   - Automatic 18% standard GST tax separation (CGST 9% + SGST 9% / IGST).
   - Compliance dashboard with upcoming GSTR-1 and GSTR-3B return filing deadlines.

10. **Business Alert Engine (Phase 13):**
    - Contextual alerts for `LOW_STOCK`, `OUT_OF_STOCK`, `SALES_DROP`, `HIGH_EXPENSE`, and `GST_REMINDER` with severity tiers (`INFO`, `WARNING`, `CRITICAL`).

11. **Python ML Microservice (Phases 14, 15, 16, 17, 18):**
    - Standalone FastAPI service running on port `8000`.
    - Statistical time-series forecasting (Weighted moving averages, trend analysis).
    - Product demand prediction, stockout estimation date, and automated purchase recommendations.
    - Transparent in-memory fallback in Spring Boot if ML microservice is unreachable.

12. **Gemini AI Business Partner & Context Layer (Phases 19 & 20):**
    - Backend-mediated Gemini API calls (API key never exposed to client).
    - Structured live database context injected into queries.
    - Answers business performance queries (*"What was my revenue today?"*, *"Which products should I reorder?"*, *"What is my net profit?"*).

13. **Full 23-Language Multilingual Support (Phases 21 & 22):**
    - English + all **22 official Eighth Schedule Indian languages**:
      *Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu*.
    - Native scripts and Right-to-Left (RTL) layout support for Urdu, Kashmiri, and Sindhi.
    - AI assistant responds in the user's selected language using verified business data.

14. **Voice Assistant (Phase 23):**
    - Speech-to-Text (STT) and Text-to-Speech (TTS) via Web Speech API with BCP 47 locale mappings and automatic text fallback.

---

## 🏗 Architecture & Service Ports

```
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite                      │  Port 5173
│            Vanilla CSS3 Design Tokens / SVG            │
└──────────────────────────┬─────────────────────────────┘
                           │ REST / Bearer JWT
┌──────────────────────────▼─────────────────────────────┐
│             Spring Boot 3.2 Backend (Java 17)          │  Port 8080
│    Spring Security + JJWT + Hibernate + BigDecimal     │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │ HTTP POST JSON
┌──────────────▼─────────────┐   ┌────────▼──────────────┐
│  H2 (Dev) / MySQL 8 (Prod) │   │ Python FastAPI ML     │  Port 8000
│  Live MSME Database        │   │ Forecasting Service   │
└────────────────────────────┘   └───────────────────────┘
```

---

## ⚡ Quick Start Instructions

### Prerequisites
- **Java 17+**
- **Node.js 18+** & **npm**
- **Python 3.10+**

### 1. Start the Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*Healthcheck:* `http://localhost:8000/health`

### 2. Start the Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*API Base:* `http://localhost:8080/api`  
*H2 Console (Dev):* `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:business_assistant_db`, User: `sa`, Password: *(empty)*)

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*App URL:* `http://localhost:5173`

---

## 🔑 Default Credentials (Seed Data)

| Role | Email | Password |
|---|---|---|
| **MSME Owner / Administrator** | `admin@bizpartner.ai` | `password123` |

*A "1-Click Instant Enter" button is also provided on the login screen for testing.*

---

## ⚙️ Environment Variables

Copy `.env.example` to configure your environment:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (Min 256 bits)
JWT_SECRET=MSME_Secret_Key_For_BizPartner_AI_Enterprise_Production_Token_2026_Secure!

# Production MySQL Database
DB_URL=jdbc:mysql://localhost:3306/business_assistant_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# ML Microservice Endpoint
ML_SERVICE_URL=http://localhost:8000
```

---

## 🧪 Running Tests

### Backend Unit & Integration Tests:
```bash
cd backend
mvn test
```
*Coverage includes atomic sale creation, stock deduction, stock movement logs, negative stock rejection, BCrypt authentication, JWT validation, and GST calculation.*

### Frontend Production Build:
```bash
cd frontend
npm run build
```

---

## 📄 License
BizPartner AI is developed under the MIT License for MSMEs and retail businesses worldwide.
