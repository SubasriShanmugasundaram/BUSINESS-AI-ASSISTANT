# BizPartner AI – Architecture & System Design

## 1. System Overview

BizPartner AI is an enterprise-grade AI-powered business assistant designed specifically for Micro, Small, and Medium Enterprises (MSMEs), retail outlets, supermarkets, and wholesale traders.

The core data flow:
```
BUSINESS DATA (Sales, Products, Expenses, Inventory)
      ↓
DATA ANALYSIS & AGGREGATION (Spring Boot JPA Repositories)
      ↓
AI / ML ANALYSIS (Python FastAPI Forecasting Microservice)
      ↓
PREDICTION (Time-series / Exponential smoothing / Statistical fallbacks)
      ↓
BUSINESS INSIGHT (Fast-moving, Slow-moving, Stockout risk)
      ↓
RECOMMENDATION (Automated Purchase & Reorder Advice)
      ↓
ACTION (One-click Purchase Order / POS replenishment)
```

## 2. Monorepo Organization

```
bizpartner-ai/
├── frontend/                     # React 18, Vite, Vanilla CSS3, SVG Visualizations
│   ├── src/
│   │   ├── assets/               # Brand logos, icons, static assets
│   │   ├── components/           # Reusable UI widgets, Modal, TopBar, Sidebar, StatCard
│   │   ├── context/              # AuthContext, LanguageContext, ThemeContext
│   │   ├── hooks/                # Custom React hooks (useAuth, useFetch, useVoice)
│   │   ├── i18n/                 # Centralized 23-language internationalization
│   │   ├── layouts/              # MainLayout, AuthLayout, PrintLayout
│   │   ├── pages/                # POS, Dashboard, Products, Inventory, Customers, Expenses, Reports
│   │   ├── services/             # REST API clients (api.js, authService.js, aiService.js)
│   │   ├── styles/               # CSS Design tokens (index.css, components.css)
│   │   └── utils/                # Date formatting, currency formatters, math helpers
│
├── backend/                      # Java 17, Spring Boot 3.2
│   ├── src/main/java/com/businessassistant/
│   │   ├── config/               # DataSeeder, CorsConfig
│   │   ├── controller/           # REST endpoints
│   │   ├── dto/                  # Request and Response transfer objects
│   │   ├── entity/               # JPA entities
│   │   ├── exception/            # GlobalExceptionHandler and custom exceptions
│   │   ├── mapper/               # Entity-to-DTO conversion mappers
│   │   ├── repository/           # Spring Data JPA queries
│   │   ├── security/             # Spring Security, JWT filters, BCrypt encoders
│   │   ├── service/              # Core business logic services
│   │   └── util/                 # MoneyUtil (BigDecimal operations)
│   ├── src/main/resources/
│   │   ├── application.properties        # Master configuration
│   │   ├── application-dev.properties    # H2 in-memory profile
│   │   ├── application-prod.properties   # MySQL 8.0+ production profile
│   │   └── data/                         # schema.sql, sample-data.sql
│
├── ml-service/                   # Python 3.x FastAPI ML Microservice
│   ├── app/
│   │   ├── forecasting/          # ARIMA, Holt-Winters, Moving Average fallback
│   │   ├── models/               # ML model weights and wrappers
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── services/             # Forecasting and analytics engine
│   │   ├── utils/                # Time series transformers
│   │   └── main.py               # FastAPI entrypoint
│   └── requirements.txt
│
├── database/                     # MySQL DDL & DML scripts
├── docs/                         # Architecture, API & operational specifications
└── .env.example                  # Environment secrets template
```

## 3. Database Strategy
- **Development Profile (`dev`)**: Uses an embedded H2 in-memory database with MySQL compatibility mode. Starts up instantly without requiring external databases.
- **Production Profile (`prod`)**: Connects to MySQL 8.0+ via connection pooling (HikariCP) with auto-schema updates.
