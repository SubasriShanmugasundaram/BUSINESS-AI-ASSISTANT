-- ==========================================================
-- AI-Powered Business Assistant
-- Module 1: Data Management & Sales Management
-- Module 2: Expense Tracking & Inventory Management
-- Sample Data
-- ==========================================================

USE business_assistant_db;

-- 1. Sample Customers (5 MSME customers)
INSERT INTO customers (id, name, phone, email, address, created_at) VALUES
(1, 'Ramesh General Store', '9876543210', 'ramesh.store@gmail.com', '12 Bazaar Street, Gandhi Nagar, Bengaluru', '2026-08-01 10:00:00'),
(2, 'Priya Tech Solutions', '9845123456', 'contact@priyatech.in', '45 ITPL Main Road, Whitefield, Bengaluru', '2026-08-05 11:30:00'),
(3, 'Ananya Boutique', '9900112233', 'ananya.fashions@yahoo.com', '78 Commercial Street, Shivaji Nagar, Bengaluru', '2026-08-10 14:15:00'),
(4, 'Kiran Traders', '9741852963', 'kiran.traders@outlook.com', '102 APMC Market Yard, Yeshwanthpur, Bengaluru', '2026-08-15 09:45:00'),
(5, 'Metro Cafe & Bakers', '9632587410', 'orders@metrocafe.com', '24 Church Street, MG Road, Bengaluru', '2026-08-20 16:20:00');

-- 2. Sample Products (8 Products across 4 categories)
INSERT INTO products (id, name, category, selling_price, purchase_price, description, created_at) VALUES
(1, 'Premium Basmati Rice 5kg', 'Groceries', 550.00, 420.00, 'Aged aromatic long-grain royal basmati rice pack', '2026-08-01 10:00:00'),
(2, 'Refined Sunflower Oil 1L', 'Groceries', 145.00, 115.00, 'Triple refined healthy cooking oil pouch', '2026-08-01 10:15:00'),
(3, 'Wireless Optical Mouse', 'Electronics', 499.00, 280.00, 'Ergonomic 2.4GHz USB wireless optical mouse', '2026-08-02 11:00:00'),
(4, 'Type-C Fast Charging Cable', 'Electronics', 249.00, 95.00, 'Braided 1.2m durable fast data sync & charge cable', '2026-08-02 11:30:00'),
(5, 'Pure Cotton Handloom Shirt', 'Textiles', 899.00, 520.00, 'Breathable premium comfort formal & casual cotton shirt', '2026-08-03 14:00:00'),
(6, 'Linen Tablecloth 6-Seater', 'Textiles', 650.00, 390.00, 'Spill-resistant decorative dining table cover', '2026-08-03 14:45:00'),
(7, 'Executive Hardbound Notebook', 'Stationery', 180.00, 90.00, 'A5 ruled 200 pages premium paper notebook', '2026-08-04 15:30:00'),
(8, 'Retractable Gel Pen (Pack of 5)', 'Stationery', 120.00, 65.00, 'Smooth ink flow 0.5mm precision writing pens', '2026-08-04 16:00:00');

-- 3. Sample Sales (10 Transactions across recent dates)
INSERT INTO sales (id, sale_number, customer_id, total_amount, payment_method, sale_date, status, notes, created_at) VALUES
(1, 'INV-2026-0001', 1, 1390.00, 'UPI', '2026-09-12', 'Completed', 'Monthly bulk stock purchase', '2026-09-12 10:30:00'),
(2, 'INV-2026-0002', 2, 1497.00, 'Card', '2026-09-13', 'Completed', 'Office supplies procurement', '2026-09-13 11:45:00'),
(3, 'INV-2026-0003', 3, 2448.00, 'UPI', '2026-09-14', 'Completed', 'Boutique decor and team shirts', '2026-09-14 15:20:00'),
(4, 'INV-2026-0004', 4, 3850.00, 'Cash', '2026-09-15', 'Completed', 'Wholesale grain orders', '2026-09-15 12:10:00'),
(5, 'INV-2026-0005', 5, 870.00, 'UPI', '2026-09-16', 'Completed', 'Cooking oil refills for bakery', '2026-09-16 16:40:00'),
(6, 'INV-2026-0006', 1, 998.00, 'Other', '2026-09-17', 'Completed', 'Electronics for counter billing', '2026-09-17 09:30:00'),
(7, 'INV-2026-0007', 2, 747.00, 'UPI', '2026-09-18', 'Completed', 'Extra cables for workstation setup', '2026-09-18 14:00:00'),
(8, 'INV-2026-0008', 3, 1798.00, 'Card', '2026-09-19', 'Completed', 'Festive seasonal clothing purchase', '2026-09-19 17:15:00'),
(9, 'INV-2026-0009', 4, 1100.00, 'Cash', '2026-09-20', 'Completed', 'Basmati rice urgent re-order', '2026-09-20 11:20:00'),
(10, 'INV-2026-0010', 5, 660.00, 'UPI', '2026-09-21', 'Completed', 'Register receipt pads & stationery', '2026-09-21 10:15:00');

-- 4. Sample Sale Items (Detailed line items for each transaction)
INSERT INTO sale_items (id, sale_id, product_id, quantity, selling_price, total_amount) VALUES
(1, 1, 1, 2, 550.00, 1100.00),
(2, 1, 2, 2, 145.00, 290.00),
(3, 2, 3, 3, 499.00, 1497.00),
(4, 3, 5, 2, 899.00, 1798.00),
(5, 3, 6, 1, 650.00, 650.00),
(6, 4, 1, 7, 550.00, 3850.00),
(7, 5, 2, 6, 145.00, 870.00),
(8, 6, 3, 2, 499.00, 998.00),
(9, 7, 4, 3, 249.00, 747.00),
(10, 8, 5, 2, 899.00, 1798.00),
(11, 9, 1, 2, 550.00, 1100.00),
(12, 10, 7, 3, 180.00, 540.00),
(13, 10, 8, 1, 120.00, 120.00);

-- ==========================================================
-- MODULE 2 SAMPLE DATA
-- ==========================================================

-- 5. Sample Expenses (8 records across business categories)
INSERT INTO expenses (id, category, description, amount, expense_date, payment_method, notes, created_at) VALUES
(1, 'Rent', 'Commercial shop monthly lease rental', 15000.00, '2026-09-01', 'Bank Transfer', 'September rental payment paid to landlord', '2026-09-01 09:30:00'),
(2, 'Electricity', 'BESCOM monthly store commercial meter bill', 2450.00, '2026-09-05', 'UPI', 'Online payment RR number 2847192', '2026-09-05 11:15:00'),
(3, 'Purchase', 'Stock replenishment - Basmati Rice wholesale bag', 8400.00, '2026-09-08', 'Bank Transfer', '20 units procured from APMC wholesaler', '2026-09-08 14:00:00'),
(4, 'Salary', 'Counter assistant part-time staff salary', 12000.00, '2026-09-10', 'Bank Transfer', 'Monthly staff payroll cleared', '2026-09-10 17:00:00'),
(5, 'Transportation', 'Wholesale delivery tempo freight and loading', 650.00, '2026-09-14', 'Cash', 'Tempo charges for Yeshwanthpur trip', '2026-09-14 13:45:00'),
(6, 'Marketing', 'Local festival flyers and Google Maps boost', 1200.00, '2026-09-16', 'UPI', 'Local area festive promotion', '2026-09-16 10:20:00'),
(7, 'Maintenance', 'Billing thermal printer repair & AC servicing', 950.00, '2026-09-18', 'Cash', 'Replaced printer thermal gear', '2026-09-18 16:30:00'),
(8, 'Other', 'Office pantry coffee, tea, and cleaning items', 480.00, '2026-09-20', 'UPI', 'Weekly pantry restock', '2026-09-20 12:00:00');

-- 6. Sample Inventory (Current stock & reorder thresholds for 8 products)
INSERT INTO inventory (id, product_id, current_stock, reorder_level, last_restocked_at, updated_at) VALUES
(1, 1, 8, 10, '2026-09-08 14:00:00', '2026-09-20 11:20:00'),  -- Basmati Rice (LOW STOCK: 8 <= 10)
(2, 2, 24, 15, '2026-09-05 10:00:00', '2026-09-16 16:40:00'), -- Sunflower Oil (IN STOCK: 24 > 15)
(3, 3, 14, 8, '2026-09-04 12:00:00', '2026-09-17 09:30:00'),  -- Wireless Mouse (IN STOCK: 14 > 8)
(4, 4, 32, 10, '2026-09-04 12:30:00', '2026-09-18 14:00:00'), -- Charging Cable (IN STOCK: 32 > 10)
(5, 5, 11, 8, '2026-09-03 15:00:00', '2026-09-19 17:15:00'),  -- Handloom Shirt (IN STOCK: 11 > 8)
(6, 6, 6, 5, '2026-09-03 15:30:00', '2026-09-14 15:20:00'),   -- Tablecloth (IN STOCK: 6 > 5)
(7, 7, 28, 12, '2026-09-02 11:00:00', '2026-09-21 10:15:00'), -- Executive Notebook (IN STOCK: 28 > 12)
(8, 8, 4, 15, '2026-09-02 11:30:00', '2026-09-21 10:15:00');  -- Gel Pen (LOW STOCK: 4 <= 15)

-- 7. Sample Stock Movements (Historical Purchases & Sale Audits)
INSERT INTO stock_movements (id, product_id, movement_type, quantity, movement_date, reason, reference_id, created_at) VALUES
(1, 1, 'Purchase', 20, '2026-09-08', 'Wholesale stock batch receipt', 'PO-2026-001', '2026-09-08 14:00:00'),
(2, 1, 'Sale', -2, '2026-09-12', 'Customer Sale', 'INV-2026-0001', '2026-09-12 10:30:00'),
(3, 1, 'Sale', -7, '2026-09-15', 'Customer Sale', 'INV-2026-0004', '2026-09-15 12:10:00'),
(4, 1, 'Sale', -2, '2026-09-20', 'Customer Sale', 'INV-2026-0009', '2026-09-20 11:20:00'),
(5, 2, 'Purchase', 30, '2026-09-05', 'Wholesale batch delivery', 'PO-2026-002', '2026-09-05 10:00:00'),
(6, 2, 'Sale', -2, '2026-09-12', 'Customer Sale', 'INV-2026-0001', '2026-09-12 10:30:00'),
(7, 2, 'Sale', -6, '2026-09-16', 'Customer Sale', 'INV-2026-0005', '2026-09-16 16:40:00'),
(8, 3, 'Purchase', 20, '2026-09-04', 'Electronics distributor shipment', 'PO-2026-003', '2026-09-04 12:00:00'),
(9, 3, 'Sale', -3, '2026-09-13', 'Customer Sale', 'INV-2026-0002', '2026-09-13 11:45:00'),
(10, 3, 'Sale', -2, '2026-09-17', 'Customer Sale', 'INV-2026-0006', '2026-09-17 09:30:00'),
(11, 4, 'Purchase', 35, '2026-09-04', 'Cable accessories delivery', 'PO-2026-004', '2026-09-04 12:30:00'),
(12, 4, 'Sale', -3, '2026-09-18', 'Customer Sale', 'INV-2026-0007', '2026-09-18 14:00:00');
