# ⚡ ProfitPilot AI — Quick Start Card & Reference Cheatsheet

> **Platform:** ProfitPilot AI (by Spark'6 Enterprises)  
> **Live Demo:** [https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/](https://subasrishanmugasundaram.github.io/BUSINESS-AI-ASSISTANT/)  
> **GitHub:** [https://github.com/SubasriShanmugasundaram/BUSINESS-AI-ASSISTANT](https://github.com/SubasriShanmugasundaram/BUSINESS-AI-ASSISTANT)

---

## 🔑 1. Test Login Credentials

| Role | Email | Password | Quick Enter |
|---|---|---|---|
| **Primary Owner / Admin** | `admin@profitpilot.ai` | `password123` | Click **"1-Click Instant Enter"** |
| **Legacy Admin** | `admin@bizpartner.ai` | `password123` | Click **"1-Click Instant Enter"** |

---

## 🚀 2. Local Microservices Quick Launch

| Action | Command / Script | Local URL |
|---|---|---|
| **Launch Entire Stack** | Run [`start-all.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/start-all.bat) | Launches all 3 services |
| **Frontend Only** | Run [`run-frontend.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-frontend.bat) or `cd frontend && npm run dev` | `http://localhost:5173` |
| **Backend Only** | Run [`run-backend.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-backend.bat) or `cd backend && mvn spring-boot:run` | `http://localhost:8080/api` |
| **ML Engine Only** | Run [`run-ml.bat`](file:///c:/Users/subasri/Desktop/bia2%20final/run-ml.bat) or `cd ml-service && python -m uvicorn app.main:app` | `http://localhost:8000` |

---

## 🔄 3. Common Daily Business Workflows

### A. Completing a Fast Cash / UPI Sale (30 Seconds)
1. Click **Billing (POS)** in the sidebar.
2. Click product cards to add items to cart (use `+` / `−` steppers).
3. Select **Payment Method** (Cash or UPI).
4. Click **Complete Sale & Print**.
5. Thermal receipt appears immediately; click **Print Receipt** (or Esc to dismiss).

### B. Recording a Sale on Customer Khata (Credit)
1. In **Billing (POS)**, select the customer from the **Assign Customer** dropdown.
2. Select payment method as **Bank Transfer** or **Cash**.
3. Complete the sale.
4. Go to **Customers** to view the updated total spend and Khata balance.

### C. Restocking Inventory (Incoming Supplier Order)
1. Click **Inventory** in the sidebar.
2. Find the product and click **Adjust Stock**.
3. Select **Operation Type:** `Purchase`.
4. Enter incoming quantity (e.g., `25`) and Reference (e.g., `PO-2026-010`).
5. Click **Confirm Adjustment**. Stock count and warehouse valuation update instantly.

### D. Logging Operating Expenses (Rent, Bills, Salaries)
1. Click **Expenses** in the sidebar.
2. Click **+ Add Expense**.
3. Choose category (`Rent`, `Electricity`, `Salary`, etc.).
4. Enter amount and payment mode.
5. Click **Save Expense**. Check the **Executive Dashboard** to view your updated Net Operating Profit!

### E. Asking the AI Assistant Questions
1. Click the **AI Assistant** pill in the top header (or floating button).
2. Click a quick chip like *"What is my revenue today?"* or type your own question.
3. Or click the **Microphone (🎙️)** button to speak your query.
4. The assistant analyzes your live store data and responds with accurate business intelligence.

---

## 🌐 4. Production & Deployment Commands

```bash
# Build Frontend for Production (creates frontend/dist)
cd frontend
npm run build

# Run Spring Boot Unit & Integration Tests (10 tests)
cd backend
mvn test

# Push code to GitHub (triggers automated GitHub Actions CI & Pages deployment)
git add -A
git commit -m "feat: your descriptive message"
git push origin main
```

---

## 💡 5. Tips & Best Practices
- **Thermal Receipt Sizing:** Set margins to "None" in your browser print dialog for crisp alignment on 58mm/80mm thermal printers.
- **Offline Reliability:** If internet access drops during peak hours, ProfitPilot AI automatically switches to local browser storage so checkout lines keep moving without interruptions.
- **Language Selection:** Switch between English and 22 Indian languages at any time using the header dropdown; all numbers and currency remain formatted in Indian Rupees (₹).
