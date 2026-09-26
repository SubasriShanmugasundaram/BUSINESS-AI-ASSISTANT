/**
 * AI-Powered Business Assistant - Module 1 API Client
 * Connects to Spring Boot REST endpoints with automatic client-side sync fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';


// Initial Sample Data (5 Customers, 8 Products, 10 Sales)
const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Ramesh General Store', phone: '9876543210', email: 'ramesh.store@gmail.com', address: '12 Bazaar Street, Gandhi Nagar, Bengaluru', createdAt: '2026-08-01 10:00:00' },
  { id: 2, name: 'Priya Tech Solutions', phone: '9845123456', email: 'contact@priyatech.in', address: '45 ITPL Main Road, Whitefield, Bengaluru', createdAt: '2026-08-05 11:30:00' },
  { id: 3, name: 'Ananya Boutique', phone: '9900112233', email: 'ananya.fashions@yahoo.com', address: '78 Commercial Street, Shivaji Nagar, Bengaluru', createdAt: '2026-08-10 14:15:00' },
  { id: 4, name: 'Kiran Traders', phone: '9741852963', email: 'kiran.traders@outlook.com', address: '102 APMC Market Yard, Yeshwanthpur, Bengaluru', createdAt: '2026-08-15 09:45:00' },
  { id: 5, name: 'Metro Cafe & Bakers', phone: '9632587410', email: 'orders@metrocafe.com', address: '24 Church Street, MG Road, Bengaluru', createdAt: '2026-08-20 16:20:00' }
];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Premium Basmati Rice 5kg', category: 'Groceries', sellingPrice: 550.00, purchasePrice: 420.00, description: 'Aged aromatic long-grain royal basmati rice pack', createdAt: '2026-08-01 10:00:00' },
  { id: 2, name: 'Refined Sunflower Oil 1L', category: 'Groceries', sellingPrice: 145.00, purchasePrice: 115.00, description: 'Triple refined healthy cooking oil pouch', createdAt: '2026-08-01 10:15:00' },
  { id: 3, name: 'Wireless Optical Mouse', category: 'Electronics', sellingPrice: 499.00, purchasePrice: 280.00, description: 'Ergonomic 2.4GHz USB wireless optical mouse', createdAt: '2026-08-02 11:00:00' },
  { id: 4, name: 'Type-C Fast Charging Cable', category: 'Electronics', sellingPrice: 249.00, purchasePrice: 95.00, description: 'Braided 1.2m durable fast data sync & charge cable', createdAt: '2026-08-02 11:30:00' },
  { id: 5, name: 'Pure Cotton Handloom Shirt', category: 'Textiles', sellingPrice: 899.00, purchasePrice: 520.00, description: 'Breathable premium comfort formal & casual cotton shirt', createdAt: '2026-08-03 14:00:00' },
  { id: 6, name: 'Linen Tablecloth 6-Seater', category: 'Textiles', sellingPrice: 650.00, purchasePrice: 390.00, description: 'Spill-resistant decorative dining table cover', createdAt: '2026-08-03 14:45:00' },
  { id: 7, name: 'Executive Hardbound Notebook', category: 'Stationery', sellingPrice: 180.00, purchasePrice: 90.00, description: 'A5 ruled 200 pages premium paper notebook', createdAt: '2026-08-04 15:30:00' },
  { id: 8, name: 'Retractable Gel Pen (Pack of 5)', category: 'Stationery', sellingPrice: 120.00, purchasePrice: 65.00, description: 'Smooth ink flow 0.5mm precision writing pens', createdAt: '2026-08-04 16:00:00' }
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
};

initStorage();

// Storage Accessors
const getLocalData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Base fetch wrapper that attempts backend first, then falls back seamlessly to local state
async function request(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
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
      throw new Error(errData.message || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    // Backend is either offline or unreachable, fall back to offline client store
    return handleLocalFallback(endpoint, options);
  }
}

// Client-side fallback handler
function handleLocalFallback(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. CUSTOMERS
  if (endpoint.startsWith('/customers')) {
    const customers = getLocalData('msme_customers');
    const idMatch = endpoint.match(/\/customers\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) {
      return customers;
    }
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

    if (method === 'GET' && !id) {
      return products;
    }
    if (method === 'GET' && id) {
      const found = products.find(p => p.id === id);
      if (!found) throw new Error('Product not found');
      return found;
    }
    if (method === 'POST') {
      const newProduct = {
        id: Date.now(),
        ...body,
        sellingPrice: parseFloat(body.sellingPrice),
        purchasePrice: parseFloat(body.purchasePrice || 0),
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
        sellingPrice: parseFloat(body.sellingPrice),
        purchasePrice: parseFloat(body.purchasePrice || 0)
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

    if (method === 'GET' && !id) {
      return sales;
    }
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

  // 4. DASHBOARD STATS
  if (endpoint.startsWith('/dashboard/stats')) {
    const customers = getLocalData('msme_customers');
    const products = getLocalData('msme_products');
    const sales = getLocalData('msme_sales');
    const today = new Date().toISOString().split('T')[0];

    const todaySalesAmount = sales
      .filter(s => s.saleDate === today)
      .reduce((sum, s) => sum + Number(s.totalAmount), 0);

    const totalSalesAmount = sales
      .reduce((sum, s) => sum + Number(s.totalAmount), 0);

    return {
      totalCustomers: customers.length,
      totalProducts: products.length,
      todaySales: todaySalesAmount,
      totalSales: totalSalesAmount,
      totalTransactions: sales.length,
      recentSales: sales.slice(0, 5)
    };
  }

  // 5. REPORTS
  if (endpoint.startsWith('/reports/sales-summary') || endpoint.startsWith('/reports/sales')) {
    const sales = getLocalData('msme_sales');
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const avgValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

    // Group sales by date
    const dateMap = {};
    sales.forEach(s => {
      dateMap[s.saleDate] = (dateMap[s.saleDate] || 0) + Number(s.totalAmount);
    });

    const salesByDate = Object.keys(dateMap).sort().map(d => ({
      date: d,
      amount: dateMap[d]
    }));

    // Top Selling Products
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

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantitySold - a.quantitySold);

    // Payment methods
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

  return { message: 'Success' };
}

// Exported Service API
export const api = {
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
    request(`/inventory/${productId}?currentStock=${currentStock}&reorderLevel=${reorderLevel}`, { method: 'PUT' }),
  searchInventory: (keyword) => request(`/inventory/search?keyword=${encodeURIComponent(keyword)}`),
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
    const key = geminiApiKey || localStorage.getItem('gemini_api_key') || undefined;
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
  }
};
