/**
 * AI-Powered Business Assistant - Module 1 API Client
 * Connects to Spring Boot REST endpoints with automatic client-side sync fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Initial Sample Data (Customers, Products, Sales, Expenses, Inventory, GST, Alerts)
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
    notes: 'Replacement cables bundle',
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
    notes: 'Festival staff uniform shirts',
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
  { id: 1, title: 'Shop Monthly Rent', description: 'Shop Monthly Rent', category: 'Rent', amount: 18000, paymentMethod: 'Bank Transfer', expenseDate: '2026-09-01', notes: 'Main market store lease' },
  { id: 2, title: 'Staff Monthly Payroll (3 Members)', description: 'Staff Payroll', category: 'Salary', amount: 32000, paymentMethod: 'Bank Transfer', expenseDate: '2026-09-05', notes: 'Monthly compensation' },
  { id: 3, title: 'Commercial Electricity Bill (BESCOM)', description: 'Electricity Bill', category: 'Electricity', amount: 3450, paymentMethod: 'UPI', expenseDate: '2026-09-10', notes: 'Commercial tariff' },
  { id: 4, title: 'Wholesale Stock Freight & Transit', description: 'Stock Freight', category: 'Transportation', amount: 2800, paymentMethod: 'UPI', expenseDate: '2026-09-14', notes: 'Grains & electronics freight' },
  { id: 5, title: 'Custom Eco-Packaging & Paper Bags', description: 'Store Packaging', category: 'Purchase', amount: 1500, paymentMethod: 'Cash', expenseDate: '2026-09-18', notes: 'Printed store bags' },
  { id: 6, title: 'WhatsApp & Social Media Campaign', description: 'Local Marketing', category: 'Marketing', amount: 2000, paymentMethod: 'UPI', expenseDate: '2026-09-20', notes: 'Festive promotion broadcast' }
];

const INITIAL_INVENTORY = [
  { id: 1, productId: 1, sku: 'PRD-0001', productName: 'Premium Basmati Rice 5kg', category: 'Groceries', purchasePrice: 420.00, sellingPrice: 550.00, currentStock: 35, reorderLevel: 15, status: 'IN_STOCK', lastRestockedAt: '2026-09-15' },
  { id: 2, productId: 2, sku: 'PRD-0002', productName: 'Refined Sunflower Oil 1L', category: 'Groceries', purchasePrice: 115.00, sellingPrice: 145.00, currentStock: 8, reorderLevel: 20, status: 'LOW_STOCK', lastRestockedAt: '2026-09-10' },
  { id: 3, productId: 3, sku: 'PRD-0003', productName: 'Wireless Optical Mouse', category: 'Electronics', purchasePrice: 280.00, sellingPrice: 499.00, currentStock: 22, reorderLevel: 10, status: 'IN_STOCK', lastRestockedAt: '2026-09-12' },
  { id: 4, productId: 4, sku: 'PRD-0004', productName: 'Type-C Fast Charging Cable', category: 'Electronics', purchasePrice: 95.00, sellingPrice: 249.00, currentStock: 4, reorderLevel: 15, status: 'LOW_STOCK', lastRestockedAt: '2026-09-08' },
  { id: 5, productId: 5, sku: 'PRD-0005', productName: 'Pure Cotton Handloom Shirt', category: 'Textiles', purchasePrice: 520.00, sellingPrice: 899.00, currentStock: 0, reorderLevel: 10, status: 'OUT_OF_STOCK', lastRestockedAt: '2026-08-25' },
  { id: 6, productId: 6, sku: 'PRD-0006', productName: 'Linen Tablecloth 6-Seater', category: 'Textiles', purchasePrice: 390.00, sellingPrice: 650.00, currentStock: 14, reorderLevel: 8, status: 'IN_STOCK', lastRestockedAt: '2026-09-14' },
  { id: 7, productId: 7, sku: 'PRD-0007', productName: 'Executive Hardbound Notebook', category: 'Stationery', purchasePrice: 90.00, sellingPrice: 180.00, currentStock: 28, reorderLevel: 12, status: 'IN_STOCK', lastRestockedAt: '2026-09-16' },
  { id: 8, productId: 8, sku: 'PRD-0008', productName: 'Retractable Gel Pen (Pack of 5)', category: 'Stationery', purchasePrice: 65.00, sellingPrice: 120.00, currentStock: 45, reorderLevel: 25, status: 'IN_STOCK', lastRestockedAt: '2026-09-18' }
];

const INITIAL_STOCK_MOVEMENTS = [
  { id: 1, productId: 1, productName: 'Premium Basmati Rice 5kg', movementType: 'RESTOCK', quantityChange: 20, reason: 'Routine Restock Order', createdAt: '2026-09-15 10:30:00' },
  { id: 2, productId: 2, productName: 'Refined Sunflower Oil 1L', movementType: 'SALE_DEDUCTION', quantityChange: -6, reason: 'POS Invoice INV-2026-0005', createdAt: '2026-09-16 14:20:00' },
  { id: 3, productId: 3, productName: 'Wireless Optical Mouse', movementType: 'SALE_DEDUCTION', quantityChange: -2, reason: 'POS Invoice INV-2026-0006', createdAt: '2026-09-17 11:15:00' },
  { id: 4, productId: 5, productName: 'Pure Cotton Handloom Shirt', movementType: 'OUT_OF_STOCK_ALERT', quantityChange: -2, reason: 'POS Invoice INV-2026-0008', createdAt: '2026-09-19 16:40:00' }
];

const INITIAL_GST_REMINDERS = [
  { id: 1, title: 'File GSTR-1 (Monthly Outward Supplies)', description: 'Mandatory return for outward taxable sales', dueDate: '2026-10-11', status: 'PENDING' },
  { id: 2, title: 'File GSTR-3B (Summary & Tax Payment)', description: 'Calculate net tax liability after ITC offset', dueDate: '2026-10-20', status: 'PENDING' },
  { id: 3, title: 'Advance Tax Q2 Installment', description: 'Statutory MSME quarterly advance income tax payment', dueDate: '2026-09-15', status: 'COMPLETED' }
];

const INITIAL_ALERTS = [
  { id: 1, title: 'Critical Stock Alert: Pure Cotton Shirt', message: 'Pure Cotton Handloom Shirt is currently OUT OF STOCK (0 units). Reorder 15 units immediately.', type: 'WARNING', isRead: false, createdAt: '2026-09-24 09:00:00' },
  { id: 2, title: 'Low Stock Alert: Sunflower Oil', message: 'Refined Sunflower Oil 1L is below reorder threshold (8/20 units).', type: 'INFO', isRead: false, createdAt: '2026-09-24 11:30:00' },
  { id: 3, title: 'GST Compliance Reminder', message: 'GSTR-1 filing deadline approaching in 16 days. Total output GST accrued: ₹2,185.', type: 'COMPLIANCE', isRead: false, createdAt: '2026-09-25 08:00:00' }
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
  if (!localStorage.getItem('msme_inventory')) {
    localStorage.setItem('msme_inventory', JSON.stringify(INITIAL_INVENTORY));
  }
  if (!localStorage.getItem('msme_stock_movements')) {
    localStorage.setItem('msme_stock_movements', JSON.stringify(INITIAL_STOCK_MOVEMENTS));
  }
  if (!localStorage.getItem('msme_gst_reminders')) {
    localStorage.setItem('msme_gst_reminders', JSON.stringify(INITIAL_GST_REMINDERS));
  }
  if (!localStorage.getItem('msme_alerts')) {
    localStorage.setItem('msme_alerts', JSON.stringify(INITIAL_ALERTS));
  }
};

initStorage();

// Storage Accessors
const getLocalData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Base fetch wrapper that attempts backend first, then falls back seamlessly to local state
export async function request(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second quick healthcheck
    
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
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    // Backend is either offline or unreachable, fall back to offline client store
    return handleLocalFallback(endpoint, options);
  }
}

// Client-side fallback handler (Full Mock Engine for static GitHub Pages)
function handleLocalFallback(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. AUTH
  if (endpoint.startsWith('/auth/login')) {
    const email = body?.email || 'admin@bizpartner.ai';
    const demoUser = {
      id: 1,
      name: body?.email === 'admin@bizpartner.ai' ? 'Pranesh Sivakumar' : email.split('@')[0],
      email: email,
      role: 'ROLE_OWNER',
      businessProfile: {
        businessName: 'Lakshmi Enterprise',
        tagline: 'Wholesale & Retail Commercial Trading',
        gstin: '29ABCDE1234F1Z5',
        phone: '+91 9876543210',
        email: email,
        address: '102 Market Road, Bengaluru - 560001'
      }
    };
    return {
      token: 'jwt-offline-token-' + Date.now(),
      ...demoUser
    };
  }

  if (endpoint.startsWith('/auth/register')) {
    const newUser = {
      id: Date.now(),
      name: body?.name || 'Store Owner',
      email: body?.email || 'owner@bizpartner.ai',
      role: 'ROLE_OWNER',
      businessProfile: {
        businessName: body?.businessName || 'My Business',
        tagline: 'Retail & Commercial Management',
        gstin: body?.gstin || '29ABCDE1234F1Z5',
        phone: body?.phone || '+91 9876543210',
        email: body?.email || 'owner@bizpartner.ai',
        address: body?.address || '102 Market Road, Bengaluru'
      }
    };
    return {
      token: 'jwt-offline-token-' + Date.now(),
      ...newUser
    };
  }

  if (endpoint.startsWith('/auth/me')) {
    const savedUser = localStorage.getItem('msme_auth_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: 'Pranesh Sivakumar',
      email: 'admin@bizpartner.ai',
      role: 'ROLE_OWNER'
    };
  }

  // 2. CUSTOMERS
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

  // 3. PRODUCTS
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
        sellingPrice: parseFloat(body.sellingPrice),
        purchasePrice: parseFloat(body.purchasePrice || 0),
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      products.unshift(newProduct);
      setLocalData('msme_products', products);

      // Also create inventory record
      const inventory = getLocalData('msme_inventory');
      inventory.push({
        id: newProduct.id,
        productId: newProduct.id,
        sku: `PRD-${String(newProduct.id).slice(-4)}`,
        productName: newProduct.name,
        category: newProduct.category,
        purchasePrice: newProduct.purchasePrice,
        sellingPrice: newProduct.sellingPrice,
        currentStock: 25,
        reorderLevel: 10,
        status: 'IN_STOCK',
        lastRestockedAt: new Date().toISOString().split('T')[0]
      });
      setLocalData('msme_inventory', inventory);

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

  // 4. SALES
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

      // Deduct inventory
      const inventory = getLocalData('msme_inventory');
      calculatedItems.forEach(item => {
        const inv = inventory.find(i => i.productId === item.productId);
        if (inv) {
          inv.currentStock = Math.max(0, inv.currentStock - item.quantity);
          inv.status = inv.currentStock === 0 ? 'OUT_OF_STOCK' : inv.currentStock <= inv.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';
        }
      });
      setLocalData('msme_inventory', inventory);

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

  // 5. EXPENSES
  if (endpoint.startsWith('/expenses/summary')) {
    const expenses = getLocalData('msme_expenses');
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const byCategory = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount || 0);
    });

    let highestCat = 'Rent';
    let highestAmt = 0;
    Object.entries(byCategory).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = cat;
      }
    });

    return {
      totalExpenses,
      totalExpenseCount: expenses.length,
      thisMonthExpenses: totalExpenses,
      highestExpenseCategory: highestCat,
      highestCategoryAmount: highestAmt,
      expensesByCategory: byCategory
    };
  }

  if (endpoint.startsWith('/expenses')) {
    const expenses = getLocalData('msme_expenses');
    const idMatch = endpoint.match(/\/expenses\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) {
      return expenses;
    }
    if (method === 'GET' && id) {
      const found = expenses.find(e => e.id === id);
      if (!found) throw new Error('Expense not found');
      return found;
    }
    if (method === 'POST') {
      const newExpense = {
        id: Date.now(),
        title: body.title,
        description: body.title,
        category: body.category || 'Other',
        amount: parseFloat(body.amount),
        paymentMethod: body.paymentMethod || 'UPI',
        expenseDate: body.expenseDate || new Date().toISOString().split('T')[0],
        notes: body.notes || '',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      expenses.unshift(newExpense);
      setLocalData('msme_expenses', expenses);
      return newExpense;
    }
    if (method === 'PUT' && id) {
      const idx = expenses.findIndex(e => e.id === id);
      if (idx === -1) throw new Error('Expense not found');
      expenses[idx] = {
        ...expenses[idx],
        ...body,
        amount: parseFloat(body.amount)
      };
      setLocalData('msme_expenses', expenses);
      return expenses[idx];
    }
    if (method === 'DELETE' && id) {
      const updated = expenses.filter(e => e.id !== id);
      setLocalData('msme_expenses', updated);
      return { success: true };
    }
  }

  // 6. INVENTORY
  if (endpoint.startsWith('/inventory/summary')) {
    const inventory = getLocalData('msme_inventory');
    const totalUnits = inventory.reduce((sum, item) => sum + Number(item.currentStock || 0), 0);
    const totalValue = inventory.reduce((sum, item) => sum + (Number(item.purchasePrice || 0) * Number(item.currentStock || 0)), 0);
    const lowStock = inventory.filter(i => i.status === 'LOW_STOCK').length;
    const outOfStock = inventory.filter(i => i.status === 'OUT_OF_STOCK').length;
    const inStock = inventory.filter(i => i.status === 'IN_STOCK').length;

    return {
      totalStockUnits: totalUnits,
      totalInventoryValue: totalValue,
      inStock,
      lowStockCount: lowStock,
      lowStock,
      outOfStockCount: outOfStock,
      outOfStock,
      totalValue
    };
  }

  if (endpoint.startsWith('/inventory/low-stock')) {
    const inventory = getLocalData('msme_inventory');
    return inventory.filter(i => i.status === 'LOW_STOCK');
  }

  if (endpoint.startsWith('/inventory/out-of-stock')) {
    const inventory = getLocalData('msme_inventory');
    return inventory.filter(i => i.status === 'OUT_OF_STOCK');
  }

  if (endpoint.startsWith('/inventory')) {
    const inventory = getLocalData('msme_inventory');
    const idMatch = endpoint.match(/\/inventory\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) {
      return inventory;
    }
    if (method === 'PUT' && id) {
      const idx = inventory.findIndex(i => i.productId === id || i.id === id);
      if (idx !== -1) {
        // Query param parse for stock update
        const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
        const currentStock = urlParams.has('currentStock') ? parseInt(urlParams.get('currentStock')) : body?.currentStock ?? inventory[idx].currentStock;
        const reorderLevel = urlParams.has('reorderLevel') ? parseInt(urlParams.get('reorderLevel')) : body?.reorderLevel ?? inventory[idx].reorderLevel;

        inventory[idx].currentStock = currentStock;
        inventory[idx].reorderLevel = reorderLevel;
        inventory[idx].status = currentStock === 0 ? 'OUT_OF_STOCK' : currentStock <= reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';
        inventory[idx].lastRestockedAt = new Date().toISOString().split('T')[0];

        setLocalData('msme_inventory', inventory);
        return inventory[idx];
      }
      return { success: true };
    }
    return inventory;
  }

  // 7. STOCK MOVEMENTS
  if (endpoint.startsWith('/stock-movements')) {
    const movements = getLocalData('msme_stock_movements');
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

  // 8. GST COMPLIANCE
  if (endpoint.startsWith('/gst/summary')) {
    const sales = getLocalData('msme_sales');
    const grossSales = sales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
    // Standard 18% GST calculation (Taxable = Gross / 1.18)
    const netTaxable = Math.round(grossSales / 1.18);
    const totalGst = grossSales - netTaxable;
    const cgst = Math.round(totalGst / 2);
    const sgst = totalGst - cgst;

    return {
      gstin: '29ABCDE1234F1Z5',
      totalTaxableSales: netTaxable,
      outputGstLiability: totalGst,
      cgstLiability: cgst,
      sgstLiability: sgst,
      igstLiability: 0,
      nextFilingDeadline: '2026-10-11',
      activeQuarter: 'Q2 (Jul - Sep 2026)',
      status: 'CURRENT'
    };
  }

  if (endpoint.startsWith('/gst/reminders')) {
    const reminders = getLocalData('msme_gst_reminders');
    const idMatch = endpoint.match(/\/gst\/reminders\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === 'GET' && !id) return reminders;
    if (method === 'POST') {
      const newRem = {
        id: Date.now(),
        ...body,
        status: body.status || 'PENDING'
      };
      reminders.push(newRem);
      setLocalData('msme_gst_reminders', reminders);
      return newRem;
    }
    if (method === 'PUT' && id) {
      const idx = reminders.findIndex(r => r.id === id);
      if (idx !== -1) {
        reminders[idx] = { ...reminders[idx], ...body };
        setLocalData('msme_gst_reminders', reminders);
        return reminders[idx];
      }
    }
    if (method === 'DELETE' && id) {
      const updated = reminders.filter(r => r.id !== id);
      setLocalData('msme_gst_reminders', updated);
      return { success: true };
    }
    return reminders;
  }

  // 9. ALERTS
  if (endpoint.startsWith('/alerts')) {
    const alerts = getLocalData('msme_alerts');
    const idMatch = endpoint.match(/\/alerts\/(\d+)\/read/);
    if (idMatch && method === 'PUT') {
      const id = parseInt(idMatch[1]);
      const alert = alerts.find(a => a.id === id);
      if (alert) alert.isRead = true;
      setLocalData('msme_alerts', alerts);
      return { success: true };
    }
    return alerts;
  }

  // 10. BUSINESS PROFILE
  if (endpoint.startsWith('/business-profile')) {
    const saved = localStorage.getItem('msme_business_info');
    const profile = saved ? JSON.parse(saved) : {
      businessName: 'Lakshmi Enterprise',
      tagline: 'Wholesale & Retail Commercial Trading',
      gstin: '29ABCDE1234F1Z5',
      phone: '+91 9876543210',
      email: 'contact@lakshmi.in',
      address: '102 Market Road, Bengaluru - 560001'
    };
    if (method === 'PUT') {
      const updated = { ...profile, ...body };
      localStorage.setItem('msme_business_info', JSON.stringify(updated));
      return updated;
    }
    return profile;
  }

  // 11. DASHBOARD STATS & REPORTS
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

  if (endpoint.startsWith('/reports/sales-summary') || endpoint.startsWith('/reports/sales')) {
    const sales = getLocalData('msme_sales');
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const avgValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;

    const dateMap = {};
    sales.forEach(s => {
      dateMap[s.saleDate] = (dateMap[s.saleDate] || 0) + Number(s.totalAmount);
    });

    const salesByDate = Object.keys(dateMap).sort().map(d => ({
      date: d,
      amount: dateMap[d]
    }));

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

  // 12. FORECASTS & RECOMMENDATIONS
  if (endpoint.startsWith('/forecasts/sales')) {
    return {
      projectedGrowth: '+14.2%',
      nextMonthEstimate: 34500,
      confidenceScore: '92%',
      trend: 'UPWARD',
      insights: 'Groceries and Electronics show consistent repeat order patterns.'
    };
  }

  if (endpoint.startsWith('/recommendations/purchases') || endpoint.startsWith('/forecasts/inventory')) {
    return [
      { id: 1, productName: 'Pure Cotton Handloom Shirt', currentStock: 0, suggestedOrder: 20, urgency: 'HIGH', reason: 'Currently OUT OF STOCK, strong festival demand.' },
      { id: 2, productName: 'Refined Sunflower Oil 1L', currentStock: 8, suggestedOrder: 25, urgency: 'MEDIUM', reason: 'Below minimum safety reorder threshold (8/20).' },
      { id: 3, productName: 'Type-C Fast Charging Cable', currentStock: 4, suggestedOrder: 30, urgency: 'MEDIUM', reason: 'High turnover rate in electronics category.' }
    ];
  }

  // 13. AI ASSISTANT (Gemini Offline Business Engine)
  if (endpoint.startsWith('/ai/chat')) {
    const msg = (body?.message || '').toLowerCase();
    const inventory = getLocalData('msme_inventory');
    const sales = getLocalData('msme_sales');
    const totalRev = sales.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);

    let reply = `Based on your live business database, your current gross revenue is ₹${totalRev.toLocaleString('en-IN')}. `;
    if (msg.includes('purchase') || msg.includes('buy') || msg.includes('order')) {
      reply += "I recommend creating an urgent purchase order for 'Pure Cotton Handloom Shirt' (OUT OF STOCK) and 'Refined Sunflower Oil 1L' (8 units remaining). Restocking now prevents lost revenue.";
    } else if (msg.includes('stock') || msg.includes('inventory')) {
      const lowCount = inventory.filter(i => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;
      reply += `You have ${inventory.length} total SKUs in your catalog. ${lowCount} items need attention (1 Out of Stock, 2 Low Stock).`;
    } else if (msg.includes('sell') || msg.includes('best') || msg.includes('most')) {
      reply += "Your top-selling product by revenue is 'Premium Basmati Rice 5kg' (₹6,050 total sales), followed by 'Pure Cotton Handloom Shirt'.";
    } else if (msg.includes('gst') || msg.includes('tax')) {
      reply += "Your GSTR-1 filing is due on October 11th. Total output GST liability across recorded transactions is currently ₹2,185.";
    } else {
      reply += "I have analyzed your store performance. Margins are healthy at 28.5%. To maximize cash flow, consider running a promotional bundle for slower-moving stationery items.";
    }

    return {
      reply,
      actions: [
        "Which products should I purchase?",
        "What is my current stock status?",
        "How much GST do I owe?",
        "Show top selling products"
      ]
    };
  }

  return { message: 'Success' };
}

// Exported Service API
export const api = {
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
  sendAiChat: (message, language = 'en') => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, language }) }),

  // Utilities
  resetSampleData: () => {
    localStorage.setItem('msme_customers', JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem('msme_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('msme_sales', JSON.stringify(INITIAL_SALES));
    localStorage.setItem('msme_expenses', JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem('msme_inventory', JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem('msme_stock_movements', JSON.stringify(INITIAL_STOCK_MOVEMENTS));
    localStorage.setItem('msme_gst_reminders', JSON.stringify(INITIAL_GST_REMINDERS));
    localStorage.setItem('msme_alerts', JSON.stringify(INITIAL_ALERTS));
  }
};
