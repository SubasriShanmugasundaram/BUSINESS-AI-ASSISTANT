-- ==========================================================
-- AI-Powered Business Assistant
-- Module 1: Data Management & Sales Management
-- Module 2: Expense Tracking & Inventory Management
-- Database Schema (MySQL 8.0+)
-- ==========================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS business_assistant_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE business_assistant_db;

-- 2. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 3. Customers Table (Module 1)
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(150) NULL,
    address TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customers_phone (phone),
    INDEX idx_customers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products Table (Module 1 & 2)
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    selling_price DECIMAL(12, 2) NOT NULL,
    purchase_price DECIMAL(12, 2) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_products_category (category),
    INDEX idx_products_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Sales Table (Module 1)
CREATE TABLE sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'Cash', 'UPI', 'Card', 'Other'
    sale_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed', -- 'Completed', 'Pending', 'Cancelled'
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    INDEX idx_sales_date (sale_date),
    INDEX idx_sales_customer (customer_id),
    INDEX idx_sales_payment (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Sale Items Table (Module 1)
CREATE TABLE sale_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    selling_price DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale_items_product (product_id),
    INDEX idx_sale_items_sale (sale_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- MODULE 2 TABLES
-- ==========================================================

-- 7. Expenses Table (Module 2)
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Purchase', 'Rent', 'Salary', 'Electricity', 'Transportation', 'Marketing', 'Maintenance', 'Other'
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expenses_date (expense_date),
    INDEX idx_expenses_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Inventory Table (Module 2)
-- Maintains real-time current stock and reorder thresholds linked to products
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    current_stock INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 10,
    last_restocked_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_inventory_product (product_id),
    INDEX idx_inventory_stock (current_stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Stock Movements Table (Module 2)
-- Audits all inventory modifications: sales, purchases, manual adjustments, and returns
CREATE TABLE stock_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'Purchase', 'Sale', 'Adjustment', 'Return'
    quantity INT NOT NULL, -- Positive for incoming, negative or absolute for outgoing
    movement_date DATE NOT NULL,
    reason VARCHAR(255) NULL,
    reference_id VARCHAR(100) NULL, -- e.g. Sale # INV-2026-0001 or PO-XXXX
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_stock_movements_product (product_id),
    INDEX idx_stock_movements_date (movement_date),
    INDEX idx_stock_movements_type (movement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
