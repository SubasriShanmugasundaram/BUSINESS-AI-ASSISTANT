/**
 * ProfitPilot AI - Comprehensive Offline & Online API Service Engine
 * Provides dual-mode REST communication with instant, zero-latency local state persistence.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Initial Sample Data (5 Customers, 8 Products, 10 Sales, 5 Expenses, 3 GST Reminders)
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Ramesh General Store', phone: '9876543210', email: 'ramesh.store@gmail.com', address: '12 Bazaar Street, Gandhi Nagar, Bengaluru', createdAt: '2026-08-01 10:00:00' },
  { id: 2, name: 'Priya Tech Solutions', phone: '9845123456', email: 'contact@priyatech.in', address: '45 ITPL Main Road, Whitefield, Bengaluru', createdAt: '2026-08-05 11:30:00' },
  { id: 3, name: 'Ananya Boutique', phone: '9900112233', email: 'ananya.fashions@yahoo.com', address: '78 Commercial Street, Shivaji Nagar, Bengaluru', createdAt: '2026-08-10 14:15:00' },
  { id: 4, name: 'Kiran Traders', phone: '9741852963', email: 'kiran.traders@outlook.com', address: '102 APMC Market Yard, Yeshwanthpur, Bengaluru', createdAt: '2026-08-15 09:45:00' },
  { id: 5, name: 'Metro Cafe & Bakers', phone: '9632587410', email: 'orders@metrocafe.com', address: '24 Church Street, MG Road, Bengaluru', createdAt: '2026-08-20 16:20:00' }
];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Premium Basmati Rice 5kg', category: 'Groceries', sellingPrice: 550.00, purchasePrice: 420.00, description: 'Aged aromatic long-grain royal basmati rice pack', stockQuantity: 28, reorderLevel: 10, createdAt: '2026-08-01 10:00:00' },
  { id: 2, name: 'Refined Sunflower Oil 1L', category: 'Groceries', sellingPrice: 145.00, purchasePrice: 115.00, description: 'Triple refined healthy cooking oil pouch', stockQuantity: 42, reorderLevel: 15, createdAt: '2026-08-01 10:15:00' },
  { id: 3, name: 'Wireless Optical Mouse', category: 'Electronics', sellingPrice: 499.00, purchasePrice: 280.00, description: 'Ergonomic 2.4GHz USB wireless optical mouse', stockQuantity: 6, reorderLevel: 8, createdAt: '2026-08-02 11:00:00' },
  { id: 4, name: 'Type-C Fast Charging Cable', category: 'Electronics', sellingPrice: 249.00, purchasePrice: 95.00, description: 'Braided 1.2m durable fast data sync & charge cable', stockQuantity: 18, reorderLevel: 10, createdAt: '2026-08-02 11:30:00' },
  { id: 5, name: 'Pure Cotton Handloom Shirt', category: 'Textiles', sellingPrice: 899.00, purchasePrice: 520.00, description: 'Breathable premium comfort formal & casual cotton shirt', stockQuantity: 12, reorderLevel: 5, createdAt: '2026-08-03 14:00:00' },
  { id: 6, name: 'Linen Tablecloth 6-Seater', category: 'Textiles', sellingPrice: 650.00, purchasePrice: 390.00, description: 'Spill-resistant decorative dining table cover', stockQuantity: 4, reorderLevel: 5, createdAt: '2026-08-03 14:45:00' },
  { id: 7, name: 'Executive Hardbound Notebook', category: 'Stationery', sellingPrice: 180.00, purchasePrice: 90.00, description: 'A5 ruled 200 pages premium paper notebook', stockQuantity: 35, reorderLevel: 12, createdAt: '2026-08-04 15:30:00' },
  { id: 8, name: 'Retractable Gel Pen (Pack of 5)', category: 'Stationery', sellingPrice: 120.00, purchasePrice: 65.00, description: 'Smooth ink flow 0.5mm precision writing pens', stockQuantity: 50, reorderLevel: 15, createdAt: '2026-08-04 16:00:00' }
];

const INITIAL_SALES = [
  {
    id: 1,
    saleNumber: 'INV-2026-0001',
    customerId: 1,
    customerName: 'Ramesh General Store',
    totalAmount: 1390.00,
    paymentMethod: 'UPI',
    saleDate: '2026-09-12',
    status: 'Completed',
    notes: 'Monthly bulk stock purchase',
    items: [
      { id: 101, productId: 1, productName: 'Premium Basmati Rice 5kg', category: 'Groceries', quantity: 2, sellingPrice: 550.00, totalAmount: 1100.00 },
      { id: 102, productId: 2, productName: 'Refined Sunflower Oil 1L', category: 'Groceries', quantity: 2, sellingPrice: 145.00, totalAmount: 290.00 }
    ]
  },
  {
    id: 2,
    saleNumber: 'INV-2026-0002',
    customerId: 2,
    customerName: 'Priya Tech Solutions',
    totalAmount: 1497.00,
    paymentMethod: 'Card',
    saleDate: '2026-09-13',
    status: 'Completed',
    notes: 'Office supplies procurement',
    items: [
      { id: 103, productId: 3, productName: 'Wireless Optical Mouse', category: 'Electronics', quantity: 3, sellingPrice: 499.00, totalAmount: 1497.00 }
    ]
  },
  {
    id: 3,
    saleNumber: 'INV-2026-0003',
    customerId: 3,
    customerName: 'Ananya Boutique',
    totalAmount: 2448.00,
    paymentMethod: 'UPI',
    saleDate: '2026-09-14',
    status: 'Completed',
    notes: 'Boutique decor and team shirts',
    items: [
      { id: 104, productId: 5, productName: 'Pure Cotton Handloom Shirt', category: 'Textiles', quantity: 2, sellingPrice: 899.00, totalAmount: 1798.00 },
      { id: 105, productId: 6, productName: 'Linen Tablecloth 6-Seater', category: 'Textiles', quantity: 1, sellingPrice: 650.00, totalAmount: 650.00 }
    ]
  },
  {
    id: 4,
    saleNumber: 'INV-2026-0004',
    customerId: 4,
    customerName: 'Kiran Traders',
    totalAmount: 3850.00,
    paymentMethod: 'Cash',
    saleDate: '2026-09-15',
    status: 'Completed',
    notes: 'Wholesale grain orders',
    items: [
      { id: 106, productId: 1, productName: 'Premium Basmati Rice 5kg', category: 'Groceries', quantity: 7, sellingPrice: 550.00, totalAmount: 3850.00 }
    ]
  },
  {
    id: 5,
    saleNumber: 'INV-2026-0005',
    customerId: 5,
    customerName: 'Metro Cafe & Bakers',
    totalAmount: 870.00,
    paymentMethod: 'UPI',
    saleDate: '2026-09-16',
    status: 'Completed',
    notes: 'Cooking oil refills for bakery',
    items: [
      { id: 107, productId: 2, productName: 'Refined Sunflower Oil 1L', category: 'Groceries', quantity: 6, sellingPrice: 145.00, totalAmount: 870.00 }
    ]
  },
  {
    id: 6,
    saleNumber: 'INV-2026-0006',
    customerId: 1,
    customerName: 'Ramesh General Store',
    totalAmount: 998.00,
    paymentMethod: 'Other',
    saleDate: '2026-09-17',
    status: 'Completed',
    notes: 'Electronics for counter billing',
    items: [
      { id: 108, productId: 3, productName: 'Wireless Optical Mouse', category: 'Electronics', quantity: 2, sellingPrice: 499.00, totalAmount: 998.00 }
    ]
  },
  {
    id: 7,
    saleNumber: 'INV-2026-0007',
    customerId: 2,
    customerName: 'Priya Tech Solutions',
    totalAmount: 747.00,
    paymentMethod: 'UPI',
    saleDate: '2026-09-18',
    status: 'Completed',
    notes: 'Extra cables for workstation setup',
    items: [
      { id: 109, productId: 4, productName: 'Type-C Fast Charging Cable', category: 'Electronics', quantity: 3, sellingPrice: 249.00, totalAmount: 747.00 }
    ]
  },
  {
    id: 8,
    saleNumber: 'INV-2026-0008',
    customerId: 3,
    customerName: 'Ananya Boutique',
    totalAmount: 1798.00,
    paymentMethod: 'Card',
    saleDate: '2026-09-19',
    status: 'Completed',
    notes: 'Festive seasonal clothing purchase',
    items: [
      { id: 110, productId: 5, productName: 'Pure Cotton Handloom Shirt', category: 'Textiles', quantity: 2, sellingPrice: 899.00, totalAmount: 1798.00 }
    ]
  },
  {
    id: 9,
    saleNumber: 'INV-2026-0009',
    customerId: 4,
    customerName: 'Kiran Traders',
    totalAmount: 1100.00,
    paymentMethod: 'Cash',
    saleDate: '2026-09-20',
    status: 'Completed',
    notes: 'Basmati rice urgent re-order',
    items: [
      { id: 111, productId: 1, productName: 'Premium Basmati Rice 5kg', category: 'Groceries', quantity: 2, sellingPrice: 550.00, totalAmount: 1100.00 }
    ]
  },
  {
    id: 10,
    saleNumber: 'INV-2026-0010',
    customerId: 5,
    customerName: 'Metro Cafe & Bakers',
    totalAmount: 660.00,
    paymentMethod: 'UPI',
    saleDate: '2026-09-21',
    status: 'Completed',
    notes: 'Register receipt pads & stationery',
    items: [
      { id: 112, productId: 7, productName: 'Executive Hardbound Notebook', category: 'Stationery', quantity: 3, sellingPrice: 180.00, totalAmount: 540.00 },
      { id: 113, productId: 8, productName: 'Retractable Gel Pen (Pack of 5)', category: 'Stationery', quantity: 1, sellingPrice: 120.00, totalAmount: 120.00 }
    ]
  }
];

const INITIAL_EXPENSES = [
  { id: 1, category: 'Rent', amount: 15000.00, expenseDate: '2026-09-01', notes: 'Monthly shop premises lease payment', paymentMethod: 'Bank Transfer' },
  { id: 2, category: 'Electricity', amount: 3450.00, expenseDate: '2026-09-05', notes: 'Commercial power bill', paymentMethod: 'UPI' },
  { id: 3, category: 'Salary', amount: 22000.00, expenseDate: '2026-09-07', notes: 'Staff monthly payroll disbursement', paymentMethod: 'Bank Transfer' },
  { id: 4, category: 'Transportation', amount: 1850.00, expenseDate: '2026-09-10', notes: 'Local stock logistics & freight charges', paymentMethod: 'Cash' },
  { id: 5, category: 'Maintenance', amount: 1200.00, expenseDate: '2026-09-15', notes: 'Billing counter barcode scanner repair', paymentMethod: 'UPI' }
];

const INITIAL_GST_REMINDERS = [
  { id: 1, title: 'GSTR-1 Outward Tax Filing', description: 'File monthly GSTR-1 outward sales return for previous month', dueDate: '2026-10-11', status: 'PENDING' },
  { id: 2, title: 'GSTR-3B Tax Summary Filing', description: 'Submit monthly summary return & remit net CGST/SGST tax liability', dueDate: '2026-10-20', status: 'PENDING' },
  { id: 3, title: 'Quarterly Composition Scheme Tax Payment', description: 'Remit 1% composition levy for Q2 sales records', dueDate: '2026-10-31', status: 'COMPLETED' }
];

const INITIAL_STOCK_MOVEMENTS = [
  { id: 1, productId: 1, productName: 'Premium Basmati Rice 5kg', movementType: 'RESTOCK', quantity: 25, referenceId: 'PO-2026-081', createdAt: '2026-09-01 10:00:00', reason: 'Supplier Stock Delivery' },
  { id: 2, productId: 3, productName: 'Wireless Optical Mouse', movementType: 'ADJUSTMENT', quantity: -1, referenceId: 'ADJ-2026-014', createdAt: '2026-09-05 14:20:00', reason: 'Damaged packaging count removal' },
  { id: 3, productId: 5, productName: 'Pure Cotton Handloom Shirt', movementType: 'RESTOCK', quantity: 15, referenceId: 'PO-2026-092', createdAt: '2026-09-10 11:30:00', reason: 'New seasonal catalog addition' }
];

// Helper to initialize LocalStorage if empty
const initStorage = () => {
  if (!localStorage.getItem('msme_customers')) {
    localStorage.setItem('msme_customers', JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem('msme_products')) {
    localStorage.setItem('msme_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('msme_sales')) {
    localStorage.setItem('msme_sales', JSON.stringify(INITIAL_SALES));
  }
  if (!localStorage.getItem('msme_expenses')) {
    localStorage.setItem('msme_expenses', JSON.stringify(INITIAL_EXPENSES));
  }
  if (!localStorage.getItem('msme_gst_reminders')) {
    localStorage.setItem('msme_gst_reminders', JSON.stringify(INITIAL_GST_REMINDERS));
  }
  if (!localStorage.getItem('msme_stock_movements')) {
    localStorage.setItem('msme_stock_movements', JSON.stringify(INITIAL_STOCK_MOVEMENTS));
  }
};

initStorage();

// Storage Accessors
const getLocalData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Base fetch wrapper that attempts backend first, then falls back seamlessly to local state
async function request(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout
    
    const token = localStorage.getItem('msme_auth_token');
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const err = new Error(errData.message || `Request failed with status ${response.status}`);
      err.status = response.status;
      err.data = errData;
      throw err;
    }
    return await response.json();
  } catch (err) {
    // If the server responded with an HTTP error status (4xx/5xx), rethrow so UI can handle it
    if (err.status) {
      throw err;
    }
    // Backend is offline or unreachable, handle with comprehensive local state fallback
    return await handleLocalFallback(endpoint, options);
  }
}

// Client-side fallback handler
async function handleLocalFallback(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // 0. AUTHENTICATION FALLBACK
  if (endpoint.startsWith('/auth')) {
    if (endpoint === '/auth/login') {
      const { email, password } = body || {};
      if ((email === 'admin@profitpilot.ai' || email === 'admin@bizpartner.ai') && password === 'password123') {
        return {
          token: 'demo-token-' + Date.now(),
          id: 1,
          name: "Spark'6 Admin",
          email: email,
          role: 'ROLE_OWNER',
          businessProfile: {
            businessName: "Spark'6 Enterprises",
            name: "Spark'6 Enterprises",
            phone: "+91 9876543210",
            email: "contact@spark6.in",
            gstin: "29ABCDE1234F1Z5",
            address: "102 Market Road, Bengaluru - 560001"
          }
        };
      }
      throw new Error('Invalid email or password');
    }
    if (endpoint === '/auth/register') {
      return {
        token: 'demo-token-' + Date.now(),
        id: Date.now(),
        name: body?.name || "Spark'6 Admin",
        email: body?.email,
        role: 'ROLE_OWNER',
        businessProfile: {
          businessName: body?.businessName || "Spark'6 Enterprises",
          name: body?.businessName || "Spark'6 Enterprises",
          phone: body?.phone || "+91 9876543210",
          email: body?.email || "contact@spark6.in",
          gstin: body?.gstin || "29ABCDE1234F1Z5",
          address: body?.address || "102 Market Road, Bengaluru - 560001"
        }
      };
    }
    if (endpoint === '/auth/logout') {
      return { message: 'Logged out successfully' };
    }
    if (endpoint === '/auth/me') {
      const user = getLocalData('msme_auth_user');
      return user || { id: 1, name: "Spark'6 Admin", email: "admin@profitpilot.ai", role: "ROLE_OWNER" };
    }
  }

  // 1. CUSTOMERS
  if (endpoint.startsWith('/customers')) {
    const customers = getLocalData('msme_customers');
    const idMatch = endpoint.match(/\/customers\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) return customers;
    if (method === 'GET' && id) {
      const found = customers.find(c => c.id === id);
      if (!found) throw new Error('Customer not found');
      return found;
    }
    if (method === 'POST') {
      const newCustomer = {
        id: Date.now(),
        ...body,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      customers.unshift(newCustomer);
      setLocalData('msme_customers', customers);
      return newCustomer;
    }
    if (method === 'PUT' && id) {
      const idx = customers.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Customer not found');
      customers[idx] = { ...customers[idx], ...body };
      setLocalData('msme_customers', customers);
      return customers[idx];
    }
    if (method === 'DELETE' && id) {
      const updated = customers.filter(c => c.id !== id);
      setLocalData('msme_customers', updated);
      return { success: true };
    }
  }

  // 2. PRODUCTS
  if (endpoint.startsWith('/products')) {
    const products = getLocalData('msme_products');
    const idMatch = endpoint.match(/\/products\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) return products;
    if (method === 'GET' && id) {
      const found = products.find(p => p.id === id);
      if (!found) throw new Error('Product not found');
      return found;
    }
    if (method === 'POST') {
      const newProduct = {
        id: Date.now(),
        ...body,
        sellingPrice: parseFloat(body.sellingPrice || 0),
        purchasePrice: parseFloat(body.purchasePrice || 0),
        stockQuantity: parseInt(body.stockQuantity || 20),
        reorderLevel: parseInt(body.reorderLevel || 10),
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      products.unshift(newProduct);
      setLocalData('msme_products', products);
      return newProduct;
    }
    if (method === 'PUT' && id) {
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Product not found');
      products[idx] = {
        ...products[idx],
        ...body,
        sellingPrice: parseFloat(body.sellingPrice || products[idx].sellingPrice),
        purchasePrice: parseFloat(body.purchasePrice || products[idx].purchasePrice)
      };
      setLocalData('msme_products', products);
      return products[idx];
    }
    if (method === 'DELETE' && id) {
      const updated = products.filter(p => p.id !== id);
      setLocalData('msme_products', updated);
      return { success: true };
    }
  }

  // 3. SALES
  if (endpoint.startsWith('/sales')) {
    const sales = getLocalData('msme_sales');
    const customers = getLocalData('msme_customers');
    const products = getLocalData('msme_products');
    const idMatch = endpoint.match(/\/sales\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) return sales;
    if (method === 'GET' && id) {
      const found = sales.find(s => s.id === id);
      if (!found) throw new Error('Sale not found');
      return found;
    }
    if (method === 'POST') {
      const customer = customers.find(c => c.id === parseInt(body.customerId));
      const saleId = Date.now();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(4, '0')}`;
      
      const calculatedItems = (body.items || []).map((item, idx) => {
        const prod = products.find(p => p.id === parseInt(item.productId));
        const price = parseFloat(item.sellingPrice || prod?.sellingPrice || 0);
        const qty = parseInt(item.quantity || 1);
        return {
          id: saleId + idx + 1,
          productId: parseInt(item.productId),
          productName: prod ? prod.name : 'Custom Item',
          category: prod ? prod.category : 'General',
          quantity: qty,
          sellingPrice: price,
          totalAmount: qty * price
        };
      });

      const totalAmount = calculatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

      const newSale = {
        id: saleId,
        saleNumber: invoiceNumber,
        customerId: parseInt(body.customerId),
        customerName: customer ? customer.name : 'Walk-in Customer',
        customerPhone: customer?.phone,
        customerAddress: customer?.address,
        totalAmount,
        paymentMethod: body.paymentMethod || 'Cash',
        saleDate: body.saleDate || new Date().toISOString().split('T')[0],
        status: 'Completed',
        notes: body.notes || '',
        items: calculatedItems,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      sales.unshift(newSale);
      setLocalData('msme_sales', sales);
      return newSale;
    }
    if (method === 'PUT' && id) {
      const idx = sales.findIndex(s => s.id === id);
      if (idx === -1) throw new Error('Sale not found');
      sales[idx] = { ...sales[idx], ...body };
      setLocalData('msme_sales', sales);
      return sales[idx];
    }
    if (method === 'DELETE' && id) {
      const updated = sales.filter(s => s.id !== id);
      setLocalData('msme_sales', updated);
      return { success: true };
    }
  }

  // 4. INVENTORY & STOCK MOVEMENTS
  if (endpoint.startsWith('/inventory') || endpoint.startsWith('/stock-movements')) {
    const products = getLocalData('msme_products');
    const movements = getLocalData('msme_stock_movements');

    if (endpoint === '/inventory/summary') {
      const totalInventoryValue = products.reduce((sum, p) => sum + (Number(p.purchasePrice || p.sellingPrice || 0) * Number(p.stockQuantity || p.quantity || 10)), 0);
      const totalStockUnits = products.reduce((sum, p) => sum + Number(p.stockQuantity || p.quantity || 10), 0);
      const lowStockCount = products.filter(p => Number(p.stockQuantity || p.quantity || 10) < Number(p.reorderLevel || 10)).length;
      const outOfStockCount = products.filter(p => Number(p.stockQuantity || p.quantity || 10) === 0).length;

      return {
        totalInventoryValue,
        totalStockUnits,
        lowStockCount,
        outOfStockCount
      };
    }

    if (endpoint === '/inventory/low-stock') {
      return products.filter(p => Number(p.stockQuantity || p.quantity || 10) < Number(p.reorderLevel || 10)).map(p => ({
        ...p,
        productId: p.id,
        productName: p.name,
        stockStatus: 'LOW_STOCK'
      }));
    }

    if (endpoint === '/inventory/out-of-stock') {
      return products.filter(p => Number(p.stockQuantity || p.quantity || 10) === 0).map(p => ({
        ...p,
        productId: p.id,
        productName: p.name,
        stockStatus: 'OUT_OF_STOCK'
      }));
    }

    if (endpoint.startsWith('/inventory/adjust')) {
      const { productId, operationType, quantity, reorderLevel, reason, referenceId } = body || {};
      const idx = products.findIndex(p => p.id === parseInt(productId));
      if (idx !== -1) {
        const qty = parseInt(quantity || 0);
        if (operationType === 'RESTOCK') products[idx].stockQuantity = (products[idx].stockQuantity || 10) + qty;
        else if (operationType === 'REMOVE') products[idx].stockQuantity = Math.max(0, (products[idx].stockQuantity || 10) - qty);
        else products[idx].stockQuantity = qty;

        if (reorderLevel !== undefined) products[idx].reorderLevel = parseInt(reorderLevel);

        setLocalData('msme_products', products);

        // Record stock movement log
        const newMov = {
          id: Date.now(),
          productId: parseInt(productId),
          productName: products[idx].name,
          movementType: operationType,
          quantity: qty,
          reason: reason || 'Manual adjustment',
          referenceId: referenceId || 'ADJ-' + Date.now(),
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        movements.unshift(newMov);
        setLocalData('msme_stock_movements', movements);

        return products[idx];
      }
    }

    if (endpoint.startsWith('/inventory')) {
      return products.map(p => {
        const qty = p.stockQuantity !== undefined ? p.stockQuantity : 15;
        const reorder = p.reorderLevel || 10;
        let status = 'IN_STOCK';
        if (qty === 0) status = 'OUT_OF_STOCK';
        else if (qty < reorder) status = 'LOW_STOCK';

        return {
          ...p,
          productId: p.id,
          productSku: `SKU-PROD-${String(p.id).padStart(4, '0')}`,
          productName: p.name,
          currentStock: qty,
          reorderLevel: reorder,
          stockStatus: status,
          stockValue: (p.purchasePrice || p.sellingPrice || 0) * qty
        };
      });
    }

    if (endpoint.startsWith('/stock-movements')) {
      if (method === 'POST') {
        const newMov = {
          id: Date.now(),
          ...body,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        movements.unshift(newMov);
        setLocalData('msme_stock_movements', movements);
        return newMov;
      }
      return movements;
    }
  }

  // 5. EXPENSES
  if (endpoint.startsWith('/expenses')) {
    const expenses = getLocalData('msme_expenses');
    const idMatch = endpoint.match(/\/expenses\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (endpoint === '/expenses/summary/by-category') {
      const catMap = {};
      expenses.forEach(e => {
        catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
      });
      return Object.keys(catMap).map(cat => ({ category: cat, totalAmount: catMap[cat] }));
    }

    if (method === 'GET' && !id) return expenses;
    if (method === 'GET' && id) {
      const found = expenses.find(e => e.id === id);
      if (!found) throw new Error('Expense not found');
      return found;
    }
    if (method === 'POST') {
      const newExp = {
        id: Date.now(),
        ...body,
        amount: parseFloat(body.amount),
        expenseDate: body.expenseDate || new Date().toISOString().split('T')[0]
      };
      expenses.unshift(newExp);
      setLocalData('msme_expenses', expenses);
      return newExp;
    }
    if (method === 'PUT' && id) {
      const idx = expenses.findIndex(e => e.id === id);
      if (idx === -1) throw new Error('Expense not found');
      expenses[idx] = { ...expenses[idx], ...body, amount: parseFloat(body.amount || expenses[idx].amount) };
      setLocalData('msme_expenses', expenses);
      return expenses[idx];
    }
    if (method === 'DELETE' && id) {
      const updated = expenses.filter(e => e.id !== id);
      setLocalData('msme_expenses', updated);
      return { success: true };
    }
  }

  // 6. GST INVOICES & REMINDERS
  if (endpoint.startsWith('/gst')) {
    const sales = getLocalData('msme_sales');
    const reminders = getLocalData('msme_gst_reminders');
    const idMatch = endpoint.match(/\/gst\/reminders\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (endpoint === '/gst/summary') {
      const totalSalesRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
      const taxableAmount = totalSalesRevenue / 1.18;
      const totalGst = totalSalesRevenue - taxableAmount;
      const cgst = totalGst / 2;
      const sgst = totalGst / 2;

      return {
        totalTaxableSales: parseFloat(taxableAmount.toFixed(2)),
        totalGstCollected: parseFloat(totalGst.toFixed(2)),
        cgst: parseFloat(cgst.toFixed(2)),
        sgst: parseFloat(sgst.toFixed(2)),
        pendingRemindersCount: reminders.filter(r => r.status === 'PENDING').length
      };
    }

    if (endpoint.startsWith('/gst/reminders')) {
      if (method === 'GET' && !id) return reminders;
      if (method === 'POST') {
        const newRem = {
          id: Date.now(),
          ...body,
          dueDate: body.dueDate || new Date().toISOString().split('T')[0],
          status: body.status || 'PENDING'
        };
        reminders.unshift(newRem);
        setLocalData('msme_gst_reminders', reminders);
        return newRem;
      }
      if (method === 'PUT' && id) {
        const idx = reminders.findIndex(r => r.id === id);
        if (idx === -1) throw new Error('Reminder not found');
        reminders[idx] = { ...reminders[idx], ...body };
        setLocalData('msme_gst_reminders', reminders);
        return reminders[idx];
      }
      if (method === 'DELETE' && id) {
        const updated = reminders.filter(r => r.id !== id);
        setLocalData('msme_gst_reminders', updated);
        return { success: true };
      }
    }
  }

  // 7. DASHBOARD & REPORTS
  if (endpoint.startsWith('/dashboard/stats')) {
    const customers = getLocalData('msme_customers');
    const products = getLocalData('msme_products');
    const sales = getLocalData('msme_sales');
    const today = new Date().toISOString().split('T')[0];

    const todaySalesAmount = sales.filter(s => s.saleDate === today).reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const totalSalesAmount = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

    return {
      totalCustomers: customers.length,
      totalProducts: products.length,
      todaySales: todaySalesAmount,
      totalSales: totalSalesAmount,
      totalTransactions: sales.length,
      recentSales: sales.slice(0, 5)
    };
  }

  if (endpoint.startsWith('/reports')) {
    const sales = getLocalData('msme_sales');
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const avgValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

    const dateMap = {};
    sales.forEach(s => {
      dateMap[s.saleDate] = (dateMap[s.saleDate] || 0) + Number(s.totalAmount);
    });

    const salesByDate = Object.keys(dateMap).sort().map(d => ({ date: d, amount: dateMap[d] }));

    const productMap = {};
    sales.forEach(s => {
      (s.items || []).forEach(item => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            quantitySold: 0,
            revenue: 0
          };
        }
        productMap[item.productId].quantitySold += item.quantity;
        productMap[item.productId].revenue += item.totalAmount;
      });
    });

    const topProducts = Object.values(productMap).sort((a, b) => b.quantitySold - a.quantitySold);

    const paymentMap = {};
    sales.forEach(s => {
      paymentMap[s.paymentMethod] = (paymentMap[s.paymentMethod] || 0) + Number(s.totalAmount);
    });

    return {
      totalSales: totalRevenue,
      transactionCount: sales.length,
      averageSaleValue: parseFloat(avgValue),
      salesByDate,
      topProducts,
      paymentMethodDistribution: paymentMap
    };
  }

  // 8. BUSINESS PROFILE
  if (endpoint.startsWith('/business-profile')) {
    if (method === 'GET') {
      const saved = localStorage.getItem('msme_business_info');
      return saved ? JSON.parse(saved) : {
        businessName: "Spark'6 Enterprises",
        tagline: 'Wholesale & Retail Commercial Trading',
        phone: '+91 9876543210',
        email: 'contact@spark6.in',
        gstin: '29ABCDE1234F1Z5',
        address: '102 Market Road, Bengaluru - 560001'
      };
    }
    if (method === 'PUT') {
      localStorage.setItem('msme_business_info', JSON.stringify(body));
      return body;
    }
  }

  // 9. AI CHAT INTELLIGENCE FALLBACK
  if (endpoint.startsWith('/ai/chat')) {
    const customers = getLocalData('msme_customers');
    const products = getLocalData('msme_products');
    const sales = getLocalData('msme_sales');
    const expenses = getLocalData('msme_expenses');
    const msg = body?.message || '';
    const apiKey = body?.geminiApiKey || localStorage.getItem('gemini_api_key') || '';

    if (apiKey) {
      try {
        const totalSales = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netProfit = totalSales - totalExpenses;
        const lowStock = products.filter(p => (p.stockQuantity || p.quantity || 10) < 10);
        
        const storeContext = `Business Name: Spark'6 Enterprises\nTotal Sales: ₹${totalSales} (${sales.length} transactions)\nNet Profit: ₹${netProfit}\nLow Stock Items: ${lowStock.map(p => p.name).join(', ')}\nTotal Products: ${products.length}\nTotal Customers: ${customers.length}`;

        const promptPayload = {
          contents: [{ parts: [{ text: msg }] }],
          systemInstruction: {
            parts: [{ text: `You are ProfitPilot AI, a business partner for Spark'6 Enterprises MSME store. Answer concisely in language '${body?.language || 'en'}' using live store context:\n${storeContext}` }]
          }
        };

        const modelsToTry = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash'];
        for (const m of modelsToTry) {
          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(promptPayload)
            });

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                return {
                  reply: text,
                  suggestedActions: ["Which products should I purchase?", "What is my total sales revenue?", "Show low stock items"],
                  contextSummary: `Google Gemini (${m})`
                };
              }
            }
          } catch (err) {}
        }
      } catch (err) {
        console.warn('Direct Gemini fetch fallback error:', err);
      }
    }

    const msgLower = msg.toLowerCase();
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const lowStockItems = products.filter(p => (p.stockQuantity || p.quantity || 10) < 10);
    const topProd = products[0]?.name || 'Premium Basmati Rice 5kg';

    let reply = '';
    let suggestedActions = [];

    if (msgLower.includes('purchase') || msgLower.includes('buy') || msgLower.includes('stock') || msgLower.includes('reorder') || msgLower.includes('खरीद') || msgLower.includes('வாங்கு')) {
      reply = `Based on current inventory health, you have ${lowStockItems.length} products running below safety thresholds. We recommend reordering ${topProd} and fast-moving staples.`;
      suggestedActions = ["What is my total sales?", "Show low stock products", "How was my net profit?"];
    } else if (msgLower.includes('sale') || msgLower.includes('revenue') || msgLower.includes('profit') || msgLower.includes('बिक्री') || msgLower.includes('விற்பனை')) {
      reply = `Your store has generated a total gross revenue of ₹${totalRevenue.toLocaleString()} across ${sales.length} completed customer sales transactions. Net operating margins remain healthy.`;
      suggestedActions = ["Which product sells the most?", "Which products should I purchase?", "Show customer summary"];
    } else if (msgLower.includes('best') || msgLower.includes('top') || msgLower.includes('most')) {
      reply = `Your top selling item by transaction volume and revenue is "${topProd}". It maintains high repeat customer velocity.`;
      suggestedActions = ["What is my total stock?", "Which products should I purchase?", "What is my net profit?"];
    } else {
      reply = `Store Executive Summary: You have ${sales.length} verified sales orders totaling ₹${totalRevenue.toLocaleString()}, ${products.length} catalog items, and ${customers.length} active customer accounts. All telemetry indicators are steady.`;
      suggestedActions = ["Which products should I purchase?", "What is my total sales revenue?", "Show low stock items"];
    }

    return {
      reply,
      suggestedActions,
      contextSummary: "ProfitPilot Local Store Intelligence Engine"
    };
  }

  return { message: 'Success' };
}

// Exported Service API
export const api = {
  // Direct fetch helper
  request,

  // Customers
  getCustomers: () => request('/customers'),
  getCustomerById: (id) => request(`/customers/${id}`),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: () => request('/products'),
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Sales
  getSales: () => request('/sales'),
  getSaleById: (id) => request(`/sales/${id}`),
  createSale: (data) => request('/sales', { method: 'POST', body: JSON.stringify(data) }),
  updateSale: (id, data) => request(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSale: (id) => request(`/sales/${id}`, { method: 'DELETE' }),

  // Dashboard & Reports
  getDashboardStats: () => request('/dashboard/stats'),
  getReportsSummary: (timeframe = 'all') => request(`/reports/sales-summary?timeframe=${timeframe}`),
  getTopProducts: () => request('/reports/top-products'),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),

  // Business Profile
  getBusinessProfile: () => request('/business-profile'),
  updateBusinessProfile: (data) => request('/business-profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Inventory & Stock Movements
  getInventory: () => request('/inventory'),
  getLowStockInventory: () => request('/inventory/low-stock'),
  getOutOfStockInventory: () => request('/inventory/out-of-stock'),
  updateStock: (productId, currentStock, reorderLevel) => 
    request(`/inventory/${productId}?currentStock=${currentStock}&reorderLevel=${reorderLevel}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, currentStock, reorderLevel, operationType: 'SET', quantity: currentStock })
    }),
  searchInventory: (keyword) => 
    request(`/inventory/search?query=${encodeURIComponent(keyword)}&keyword=${encodeURIComponent(keyword)}`),
  getStockMovements: () => request('/stock-movements'),
  createStockMovement: (data) => request('/stock-movements', { method: 'POST', body: JSON.stringify(data) }),

  // Expenses
  getExpenses: () => request('/expenses'),
  createExpense: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  getExpenseSummaryByCategory: () => request('/expenses/summary/by-category'),
  getExpenseTotal: (startDate, endDate) => request(`/expenses/total?startDate=${startDate || ''}&endDate=${endDate || ''}`),

  // GST & Reminders
  getGstSummary: () => request('/gst/summary'),
  getGstReminders: () => request('/gst/reminders'),
  createGstReminder: (data) => request('/gst/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateGstReminder: (id, data) => request(`/gst/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGstReminder: (id) => request(`/gst/reminders/${id}`, { method: 'DELETE' }),

  // Alerts
  getAlerts: () => request('/alerts'),
  markAlertRead: (id) => request(`/alerts/${id}/read`, { method: 'PUT' }),

  // ML Intelligence & Forecasting
  getSalesForecast: () => request('/forecasts/sales'),
  getInventoryForecast: () => request('/forecasts/inventory'),
  getPurchaseRecommendations: () => request('/recommendations/purchases'),

  // AI Business Assistant (Gemini)
  sendAiChat: (message, language = 'en', geminiApiKey = null) => {
    const key = geminiApiKey || localStorage.getItem('gemini_api_key') || '';
    return request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language, geminiApiKey: key })
    });
  },

  // Utilities
  resetSampleData: () => {
    localStorage.setItem('msme_customers', JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem('msme_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('msme_sales', JSON.stringify(INITIAL_SALES));
    localStorage.setItem('msme_expenses', JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem('msme_gst_reminders', JSON.stringify(INITIAL_GST_REMINDERS));
    localStorage.setItem('msme_stock_movements', JSON.stringify(INITIAL_STOCK_MOVEMENTS));
  }
};
