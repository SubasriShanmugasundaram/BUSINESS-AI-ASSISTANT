# 📘 ProfitPilot AI — Complete User Guide & Operational Manual

> **Platform:** ProfitPilot AI (by Spark'6 Enterprises)  
> **Target Audience:** Store Owners, Retail Managers, Cashiers, Accountants, Wholesale Traders  
> **Live Web App:** [https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/](https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/)

---

## 📑 Table of Contents
1. [Getting Started & Access Options](#1-getting-started--access-options)
2. [Authentication & Store Access](#2-authentication--store-access)
3. [Store Identity & Settings Configuration](#3-store-identity--settings-configuration)
4. [Point of Sale (POS) Billing & Thermal Printing](#4-point-of-sale-pos-billing--thermal-printing)
5. [Customer Khata (Credit Ledger) & CRM](#5-customer-khata-credit-ledger--crm)
6. [Product Catalog & Margin Management](#6-product-catalog--margin-management)
7. [Inventory Management & Stock Audits](#7-inventory-management--stock-audits)
8. [Operating Expense Tracking & Net Profit](#8-operating-expense-tracking--net-profit)
9. [Sales History & Invoice Management](#9-sales-history--invoice-management)
10. [Executive Analytics & Performance Reports](#10-executive-analytics--performance-reports)
11. [GST Tax Compliance & Return Reminders](#11-gst-tax-compliance--return-reminders)
12. [Gemini AI Assistant & Multilingual Voice Control](#12-gemini-ai-assistant--multilingual-voice-control)
13. [23-Language Support & Dark/Light Mode](#13-23-language-support--darklight-mode)
14. [Troubleshooting & FAQ](#14-troubleshooting--faq)

---

## 1. Getting Started & Access Options

You can run ProfitPilot AI in two different ways depending on your use case:

### Option A: Instant Live Web Version (Zero Setup)
- Navigate directly to: **[https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/](https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/)**
- Operates automatically in **Standalone Demo Mode** with real-time browser storage (`localStorage`), complete preloaded seed data, and full offline UI resilience.

### Option B: Local Full-Stack Microservices Suite (Production Mode)
To run the full stack with Spring Boot, Python ML, and React frontend on your local Windows PC:
1. Double-click [`start-all.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/start-all.bat) located in the project root directory.
2. It automatically starts three background services in separate terminal windows:
   - **Frontend UI:** `http://localhost:5173`
   - **Spring Boot 3 Backend:** `http://localhost:8080/api`
   - **Python FastAPI ML Engine:** `http://localhost:8000`
3. If you prefer launching services individually, use:
   - [`run-backend.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-backend.bat) (Maven Spring Boot)
   - [`run-frontend.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-frontend.bat) (Vite React)
   - [`run-ml.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-ml.bat) (FastAPI Uvicorn)

---

## 2. Authentication & Store Access

1. Open the application in your browser.
2. If unauthenticated, you will see the **ProfitPilot AI Sign In** screen.
3. **Quick Demo Login:**
   - Click the prominent **"1-Click Instant Enter"** button at the bottom of the login card.
   - It automatically logs you in as `admin@profitpilot.ai` with full administrative rights (`ROLE_OWNER`).
4. **Manual Login:**
   - **Email:** `admin@profitpilot.ai` (or `admin@bizpartner.ai`)
   - **Password:** `password123`
   - Click **Sign In**.
5. Once signed in, your session is saved securely, and you are directed straight to the Executive Dashboard.

---

## 3. Store Identity & Settings Configuration

To customize receipts, invoices, and AI prompts with your exact business identity:
1. Click **Settings** in the left sidebar navigation.
2. Under **Store Profile & Legal Identity**, fill in:
   - **Business Legal Name:** (e.g., `Spark'6 Enterprises`)
   - **Tagline:** (e.g., `Wholesale & Retail Commercial Trading`)
   - **Owner / Manager Name:** (e.g., `Subasri Shanmugasundaram`)
   - **Contact Phone:** (e.g., `+91 9876543210`)
   - **Contact Email:** (e.g., `contact@spark6.in`)
   - **GSTIN Tax Identification:** (e.g., `29ABCDE1234F1Z5`)
   - **Physical Store Address:** (e.g., `102 Market Road, Bengaluru - 560001`)
3. Click **Save Settings**.
4. **AI Key Configuration:**
   - Enter your personal **Google Gemini API Key** in the API Key box to unlock real-time Generative AI inference directly from the browser.
   - Click **Save Key**.

---

## 4. Point of Sale (POS) Billing & Thermal Printing

The POS module allows fast checkouts during peak customer rush hours.

### Step-by-Step Checkout Process:
1. Click **Billing (POS)** in the left sidebar.
2. **Select / Search Products:**
   - Use the search bar at the top of the product grid or click category filter pills (`Groceries`, `Stationery`, `Electronics`, `Apparel`).
   - Click any product card to add 1 unit to the cart.
   - Use the **`+`** and **`−`** steppers on the cart item to adjust quantities.
   - The system checks stock limits in real time and prevents selling beyond available warehouse inventory.
3. **Assign Customer (Optional):**
   - In the checkout summary panel on the right, select an existing customer from the dropdown to record their transaction in their Khata ledger.
   - Or select **"Walk-in / Cash Customer"** for unregistered shoppers.
4. **Select Payment Method:**
   - Choose one of the 4 tender modes:
     - 💵 **Cash**
     - 📱 **UPI / QR Code**
     - 💳 **Card (Debit/Credit)**
     - 🏦 **Bank Transfer**
5. **Review Tax & Financial Summary:**
   - Subtotal is computed automatically.
   - Standard GST (CGST 9% + SGST 9% = 18%) is separated for statutory accounting.
6. **Complete & Print Receipt:**
   - Click **Complete Sale & Print**.
   - The invoice modal appears immediately with a professional thermal receipt preview.
   - Click **Print Receipt** (triggers browser `window.print()` formatted for 58mm/80mm thermal receipt rolls or standard A4 printers).
   - Stock is automatically deducted, and an audit stock movement record (`Sale`) is logged.

---

## 5. Customer Khata (Credit Ledger) & CRM

Track regular customers, store credit balances (Udhaar / Khata), and contact details.

1. Click **Customers** in the sidebar.
2. **Add a Customer:**
   - Click **+ Add Customer**.
   - Enter Customer Name, Phone, Email, Address, and initial Khata balance.
   - Click **Save Customer**.
3. **Search & Filter:**
   - Type in the search box to find customers by name, phone, or email instantly.
4. **Manage Credit Ledger (Khata):**
   - Customer cards display **Total Spent** and **Outstanding Khata Balance** in prominent badges.
   - Click on any customer to inspect past purchase history and settle outstanding dues.

---

## 6. Product Catalog & Margin Management

1. Click **Products** in the sidebar.
2. **Add a New Product:**
   - Click **+ Add Product**.
   - Enter SKU code, Product Name, Category, Cost Price (Wholesale), Selling Price (Retail), and Initial Stock Quantity.
   - ProfitPilot AI automatically calculates and displays the **Gross Profit Margin %**:
     $$\text{Margin \%} = \frac{\text{Selling Price} - \text{Cost Price}}{\text{Cost Price}} \times 100$$
   - Click **Save Product**.
3. **Edit / Delete Products:**
   - Click the pencil or trash icons to update prices or archive inactive merchandise.

---

## 7. Inventory Management & Stock Audits

The inventory screen safeguards against stockouts and tracks warehouse valuation.

1. Click **Inventory** in the sidebar.
2. **KPI Overview:**
   - **Total Warehouse Valuation:** Live monetary worth of all inventory in stock ($Stock \times Cost$).
   - **Low Stock Count:** Items at or below their reorder safety thresholds.
   - **Out of Stock Count:** Items requiring urgent purchase order replenishment.
3. **Adjusting Stock / Receiving Purchases:**
   - Click **Adjust Stock** on any product row.
   - Choose the Operation Type:
     - 📦 **Purchase (Restock):** Adds incoming inventory and increases stock.
     - ⚠️ **Adjustment (Damage / Leakage):** Deducts lost or damaged items.
     - 🔄 **Return:** Restores returned goods to active shelf stock.
     - ⚙️ **Direct Set:** Overwrite stock count following a physical stocktake.
   - Enter Quantity and Reason Notes (e.g., `PO-2026-009 replenishment` or `Damaged bottle in transit`).
   - Click **Confirm Adjustment**.
4. **Audit Trail (Stock Movements):**
   - The bottom section displays an immutable log of all historical inventory movements, including timestamps, quantity change, transaction type, and reference invoice numbers.
5. **Slow-Moving Inventory Analysis:**
   - Highlights items with low sales velocity so you can discount or bundle them before capital gets locked up.

---

## 8. Operating Expense Tracking & Net Profit

ProfitPilot AI tracks all overheads to compute **True Net Operating Profit**:

$$\text{Net Operating Profit} = \text{Gross Sales Revenue} - \text{Total Operating Expenses}$$

1. Click **Expenses** in the sidebar.
2. **Log an Expense:**
   - Click **+ Add Expense**.
   - Select Expense Category:
     - `Rent` (Storefront monthly lease)
     - `Salary` (Staff wages & manager pay)
     - `Electricity` (Utility & power bills)
     - `Purchase` (Packaging cartons, thermal rolls)
     - `Transportation` (Fuel, logistics, delivery)
     - `Marketing` (Local ads, festive promotions)
     - `Maintenance` (AC servicing, scanner repairs)
     - `Other` (Pantry supplies, miscellaneous)
   - Enter Amount, Date, Payment Mode (UPI, Cash, Card, Bank), and Description notes.
   - Click **Save Expense**.
3. **Expense Summary:**
   - View total monthly burn rate, category breakdowns, and net profit impact on the Executive Dashboard.

---

## 9. Sales History & Invoice Management

1. Click **Sales History** in the sidebar.
2. **Search Invoices:**
   - Search by Invoice Number (`INV-2026-0001`) or Customer Name.
   - Filter transactions by date range or payment method.
3. **View & Reprint Receipts:**
   - Click **View Details** on any row.
   - A modal displays the complete line-item breakdown, quantities, taxes, and customer khata details.
   - Click **Print Receipt** anytime to reprint.

---

## 10. Executive Analytics & Performance Reports

1. Click **Reports** in the sidebar.
2. **Revenue Breakdown Charts:**
   - **Line Chart:** Daily revenue progression over time.
   - **Top Products Bar Chart:** Ranking of highest revenue-generating inventory items.
   - **Day-of-Week Distribution:** Identifies the store's busiest sales days (e.g., Friday vs Saturday).
   - **Monthly Growth Breakdown:** Visual comparison of monthly business volume.
3. **Key Period Velocity Metrics:**
   - Best-Selling Day of Week (peak traffic day).
   - Best-Selling Week of Month.
   - Total Gross Revenue vs Net Operating Margin.

---

## 11. GST Tax Compliance & Return Reminders

Designed specifically for Indian MSMEs adhering to Central & State Goods and Services Tax:

1. Click **GST Compliance** in the sidebar.
2. **Live Tax Metrics:**
   - **Gross Taxable Supplies:** Sales volume subject to GST.
   - **Output CGST (9%) & SGST (9%):** Total tax collected from customers.
   - **Input Tax Credit (ITC):** Estimated tax paid on business purchases.
   - **Net Tax Liability:** Output GST minus allowable Input Tax Credit.
3. **Filing Reminders & Deadlines:**
   - **GSTR-1:** Monthly outward supplies return deadline with countdown timer.
   - **GSTR-3B:** Monthly summary return and tax payment deadline with warning badges.

---

## 12. Gemini AI Assistant & Multilingual Voice Control

ProfitPilot AI features an autonomous business copilot powered by Google Gemini AI with deep contextual awareness of your store's live database.

1. **Opening the AI Assistant:**
   - Click the **AI Assistant** pill in the top navigation bar or the floating AI button.
2. **Interactive Prompts & Inquiries:**
   - Type or speak any business question:
     - *"What is my revenue today?"*
     - *"Which products should I restock immediately?"*
     - *"What is my net operating profit after expenses?"*
     - *"Suggest a weekend promotional bundle to boost slow-moving products."*
3. **Live Database Context Injection:**
   - The assistant automatically inspects your real sales, inventory stock levels, low-stock counts, and expenses to generate verified, accurate answers instead of generic advice.
4. **Multilingual Voice Assistant:**
   - Click the **Microphone (🎙️)** button to speak your query.
   - The system performs Speech-to-Text (STT) and responds with synthesized voice audio in your selected language!

---

## 13. 23-Language Support & Dark/Light Mode

### Switching Languages:
- In the top bar, click the **Language Selector** dropdown.
- Choose from **English + all 22 official Eighth Schedule Indian languages**:
  - *Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), Urdu (اردو), Kashmiri (کٲشُر), Sindhi (سنڌي), Sanskrit (संस्कृतम्), Konkani (कोंकणी), Maithili (मैथिली), Nepali (नेपाली), Dogri (डोगरी), Bodo (बड़ो), Santali (ᱥᱟᱱᱛᱟᱲᱤ), Manipuri (মৈতৈলোন্)*.
- Right-to-Left (RTL) typography is automatically enabled for Urdu, Kashmiri, and Sindhi!

### Theme Switching:
- Click the **Sun / Moon** icon in the top header to toggle between **Dark Mode** (sleek, high-contrast) and **Light Mode** (clean, crisp editorial).

---

## 14. Troubleshooting & FAQ

| Problem | Cause | Quick Solution |
|---|---|---|
| **Login says "Invalid credentials"** | Incorrect email or password typed | Use `admin@profitpilot.ai` and `password123`, or click **"1-Click Instant Enter"**. |
| **Receipt printer doesn't fit standard thermal roll** | Paper format set to letter/A4 | In browser print settings, select **58mm** or **80mm** roll width and disable headers/footers. |
| **Backend microservice not connecting locally** | Port 8080 or 8000 occupied | Run [`start-all.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/start-all.bat) or check that Java 17 and Python are installed. |
| **AI Assistant answers in fallback mode** | Gemini API key not supplied | Go to **Settings**, paste your free Gemini API key from Google AI Studio, and click **Save Key**. |
| **Offline data reset** | Browser cache cleared | The application automatically re-initializes rich seed data on first boot if local storage is blank. |
