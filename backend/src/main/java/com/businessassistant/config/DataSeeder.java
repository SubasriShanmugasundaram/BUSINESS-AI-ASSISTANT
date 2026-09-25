package com.businessassistant.config;

import com.businessassistant.entity.*;
import com.businessassistant.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final GstReminderRepository gstReminderRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(CustomerRepository customerRepository,
                      ProductRepository productRepository,
                      SaleRepository saleRepository,
                      ExpenseRepository expenseRepository,
                      InventoryRepository inventoryRepository,
                      StockMovementRepository stockMovementRepository,
                      UserRepository userRepository,
                      BusinessProfileRepository businessProfileRepository,
                      GstReminderRepository gstReminderRepository,
                      org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.expenseRepository = expenseRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.userRepository = userRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.gstReminderRepository = gstReminderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Seed default owner user
        if (!userRepository.existsByEmail("admin@bizpartner.ai")) {
            User defaultAdmin = new User("Pranesh Sivakumar", "admin@bizpartner.ai", passwordEncoder.encode("password123"), "ROLE_OWNER");
            userRepository.save(defaultAdmin);
            System.out.println("DataSeeder: Default admin seeded (admin@bizpartner.ai / password123)");
        }

        // Seed default Business Profile
        if (businessProfileRepository.count() == 0) {
            BusinessProfile profile = new BusinessProfile(
                    "Lakshmi Enterprise",
                    "Wholesale & Retail Commercial Trading",
                    "+91 9876543210",
                    "contact@lakshmi.in",
                    "29ABCDE1234F1Z5",
                    "102 Market Road, Bengaluru - 560001"
            );
            businessProfileRepository.save(profile);
            System.out.println("DataSeeder: Default business profile seeded (Lakshmi Enterprise)");
        }

        // Seed GST Reminders
        if (gstReminderRepository.count() == 0) {
            gstReminderRepository.saveAll(Arrays.asList(
                    new GstReminder("GSTR-3B Monthly Return", "Monthly summary return of inward & outward supplies", LocalDate.now().plusDays(15), "PENDING"),
                    new GstReminder("GSTR-1 Outward Supplies", "Details of outward supplies of taxable goods & services", LocalDate.now().plusDays(25), "PENDING"),
                    new GstReminder("Advance Tax Q3 Installment", "Third quarterly advance tax compliance deposit", LocalDate.now().plusDays(40), "PENDING")
            ));
            System.out.println("DataSeeder: Default GST reminders seeded.");
        }

        if (customerRepository.count() > 0) {
            System.out.println("DataSeeder: Database already contains data, checking inventory and expenses...");
            seedMissingModule2Data();
            return;
        }

        System.out.println("DataSeeder: Initializing full dataset for Module 1 & Module 2...");

        // 1. Seed 5 Customers
        Customer c1 = new Customer("Ramesh General Store", "9876543210", "ramesh.store@gmail.com", "12 Bazaar Street, Gandhi Nagar, Bengaluru");
        Customer c2 = new Customer("Priya Tech Solutions", "9845123456", "contact@priyatech.in", "45 ITPL Main Road, Whitefield, Bengaluru");
        Customer c3 = new Customer("Ananya Boutique", "9900112233", "ananya.fashions@yahoo.com", "78 Commercial Street, Shivaji Nagar, Bengaluru");
        Customer c4 = new Customer("Kiran Traders", "9741852963", "kiran.traders@outlook.com", "102 APMC Market Yard, Yeshwanthpur, Bengaluru");
        Customer c5 = new Customer("Metro Cafe & Bakers", "9632587410", "orders@metrocafe.com", "24 Church Street, MG Road, Bengaluru");

        List<Customer> savedCustomers = customerRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));

        // 2. Seed 8 Products
        Product p1 = new Product("Premium Basmati Rice 5kg", "Groceries", new BigDecimal("550.00"), new BigDecimal("420.00"), "Aged aromatic long-grain royal basmati rice pack");
        Product p2 = new Product("Refined Sunflower Oil 1L", "Groceries", new BigDecimal("145.00"), new BigDecimal("115.00"), "Triple refined healthy cooking oil pouch");
        Product p3 = new Product("Wireless Optical Mouse", "Electronics", new BigDecimal("499.00"), new BigDecimal("280.00"), "Ergonomic 2.4GHz USB wireless optical mouse");
        Product p4 = new Product("Type-C Fast Charging Cable", "Electronics", new BigDecimal("249.00"), new BigDecimal("95.00"), "Braided 1.2m durable fast data sync & charge cable");
        Product p5 = new Product("Pure Cotton Handloom Shirt", "Textiles", new BigDecimal("899.00"), new BigDecimal("520.00"), "Breathable premium comfort formal & casual cotton shirt");
        Product p6 = new Product("Linen Tablecloth 6-Seater", "Textiles", new BigDecimal("650.00"), new BigDecimal("390.00"), "Spill-resistant decorative dining table cover");
        Product p7 = new Product("Executive Hardbound Notebook", "Stationery", new BigDecimal("180.00"), new BigDecimal("90.00"), "A5 ruled 200 pages premium paper notebook");
        Product p8 = new Product("Retractable Gel Pen (Pack of 5)", "Stationery", new BigDecimal("120.00"), new BigDecimal("65.00"), "Smooth ink flow 0.5mm precision writing pens");

        List<Product> savedProducts = productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8));

        // 3. Seed 10 Sales Records with Line Items
        createSale("INV-2026-0001", savedCustomers.get(0), "UPI", LocalDate.now().minusDays(9), "Monthly bulk stock purchase",
                new ItemSpec(savedProducts.get(0), 2, new BigDecimal("550.00")),
                new ItemSpec(savedProducts.get(1), 2, new BigDecimal("145.00")));

        createSale("INV-2026-0002", savedCustomers.get(1), "Card", LocalDate.now().minusDays(8), "Office supplies procurement",
                new ItemSpec(savedProducts.get(2), 3, new BigDecimal("499.00")));

        createSale("INV-2026-0003", savedCustomers.get(2), "UPI", LocalDate.now().minusDays(7), "Boutique decor and team shirts",
                new ItemSpec(savedProducts.get(4), 2, new BigDecimal("899.00")),
                new ItemSpec(savedProducts.get(5), 1, new BigDecimal("650.00")));

        createSale("INV-2026-0004", savedCustomers.get(3), "Cash", LocalDate.now().minusDays(6), "Wholesale grain orders",
                new ItemSpec(savedProducts.get(0), 7, new BigDecimal("550.00")));

        createSale("INV-2026-0005", savedCustomers.get(4), "UPI", LocalDate.now().minusDays(5), "Cooking oil refills for bakery",
                new ItemSpec(savedProducts.get(1), 6, new BigDecimal("145.00")));

        createSale("INV-2026-0006", savedCustomers.get(0), "Other", LocalDate.now().minusDays(4), "Electronics for counter billing",
                new ItemSpec(savedProducts.get(2), 2, new BigDecimal("499.00")));

        createSale("INV-2026-0007", savedCustomers.get(1), "UPI", LocalDate.now().minusDays(3), "Extra cables for workstation setup",
                new ItemSpec(savedProducts.get(3), 3, new BigDecimal("249.00")));

        createSale("INV-2026-0008", savedCustomers.get(2), "Card", LocalDate.now().minusDays(2), "Festive seasonal clothing purchase",
                new ItemSpec(savedProducts.get(4), 2, new BigDecimal("899.00")));

        createSale("INV-2026-0009", savedCustomers.get(3), "Cash", LocalDate.now().minusDays(1), "Basmati rice urgent re-order",
                new ItemSpec(savedProducts.get(0), 2, new BigDecimal("550.00")));

        createSale("INV-2026-0010", savedCustomers.get(4), "UPI", LocalDate.now(), "Register receipt pads & stationery",
                new ItemSpec(savedProducts.get(6), 3, new BigDecimal("180.00")),
                new ItemSpec(savedProducts.get(7), 1, new BigDecimal("120.00")));

        // 4. Seed Inventory for all 8 Products
        seedInventoryAndMovements(savedProducts);

        // 5. Seed 8 Expenses
        seedExpenses();

        System.out.println("DataSeeder: Module 1 and Module 2 successfully initialized!");
    }

    private void seedMissingModule2Data() {
        List<Product> products = productRepository.findAll();
        if (inventoryRepository.count() == 0 && !products.isEmpty()) {
            System.out.println("DataSeeder: Seeding inventory and movements...");
            seedInventoryAndMovements(products);
        }
        if (expenseRepository.count() == 0) {
            System.out.println("DataSeeder: Seeding expenses...");
            seedExpenses();
        }
    }

    private void seedInventoryAndMovements(List<Product> savedProducts) {
        Inventory inv1 = new Inventory(savedProducts.get(0), 45, 20); // Basmati Rice - In Stock
        Inventory inv2 = new Inventory(savedProducts.get(1), 8, 15);  // Oil - Low Stock
        Inventory inv3 = new Inventory(savedProducts.get(2), 18, 10); // Mouse - In Stock
        Inventory inv4 = new Inventory(savedProducts.get(3), 5, 15);  // Type-C Cable - Low Stock
        Inventory inv5 = new Inventory(savedProducts.get(4), 0, 10);  // Cotton Shirt - Out of Stock
        Inventory inv6 = new Inventory(savedProducts.get(5), 25, 10); // Tablecloth - In Stock
        Inventory inv7 = new Inventory(savedProducts.get(6), 4, 12);  // Notebook - Low Stock
        Inventory inv8 = new Inventory(savedProducts.get(7), 60, 20); // Gel Pen - In Stock

        inv1.setLastRestockedAt(LocalDateTime.now().minusDays(10));
        inv2.setLastRestockedAt(LocalDateTime.now().minusDays(14));
        inv3.setLastRestockedAt(LocalDateTime.now().minusDays(8));
        inv4.setLastRestockedAt(LocalDateTime.now().minusDays(12));
        inv5.setLastRestockedAt(LocalDateTime.now().minusDays(20));
        inv6.setLastRestockedAt(LocalDateTime.now().minusDays(5));
        inv7.setLastRestockedAt(LocalDateTime.now().minusDays(15));
        inv8.setLastRestockedAt(LocalDateTime.now().minusDays(3));

        inventoryRepository.saveAll(Arrays.asList(inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8));

        // Seed stock movements
        stockMovementRepository.saveAll(Arrays.asList(
                new StockMovement(savedProducts.get(0), "Purchase", 50, LocalDate.now().minusDays(10), "Initial wholesale stock intake", "PO-2026-001"),
                new StockMovement(savedProducts.get(0), "Sale", -5, LocalDate.now().minusDays(6), "Order fulfillment INV-2026-0004", "INV-2026-0004"),
                new StockMovement(savedProducts.get(1), "Purchase", 20, LocalDate.now().minusDays(14), "Supplier replenishment", "PO-2026-002"),
                new StockMovement(savedProducts.get(1), "Sale", -6, LocalDate.now().minusDays(5), "Order fulfillment INV-2026-0005", "INV-2026-0005"),
                new StockMovement(savedProducts.get(1), "Adjustment", -6, LocalDate.now().minusDays(3), "Damaged bottle leakage during transit", "ADJ-001"),
                new StockMovement(savedProducts.get(2), "Purchase", 25, LocalDate.now().minusDays(8), "Electronics batch import", "PO-2026-003"),
                new StockMovement(savedProducts.get(2), "Sale", -3, LocalDate.now().minusDays(8), "Order fulfillment INV-2026-0002", "INV-2026-0002"),
                new StockMovement(savedProducts.get(3), "Purchase", 15, LocalDate.now().minusDays(12), "Charging cables shipment", "PO-2026-004"),
                new StockMovement(savedProducts.get(3), "Sale", -3, LocalDate.now().minusDays(3), "Order fulfillment INV-2026-0007", "INV-2026-0007"),
                new StockMovement(savedProducts.get(4), "Purchase", 10, LocalDate.now().minusDays(20), "Handloom festive stock", "PO-2026-005"),
                new StockMovement(savedProducts.get(4), "Sale", -2, LocalDate.now().minusDays(7), "Order fulfillment INV-2026-0003", "INV-2026-0003"),
                new StockMovement(savedProducts.get(4), "Sale", -2, LocalDate.now().minusDays(2), "Order fulfillment INV-2026-0008", "INV-2026-0008"),
                new StockMovement(savedProducts.get(4), "Adjustment", -6, LocalDate.now().minusDays(1), "Stock cleared for showroom display", "ADJ-002"),
                new StockMovement(savedProducts.get(5), "Purchase", 30, LocalDate.now().minusDays(5), "Linen dining collection arrival", "PO-2026-006"),
                new StockMovement(savedProducts.get(6), "Purchase", 20, LocalDate.now().minusDays(15), "Office stationery bulk carton", "PO-2026-007"),
                new StockMovement(savedProducts.get(7), "Purchase", 80, LocalDate.now().minusDays(3), "Gel pen carton delivery", "PO-2026-008")
        ));
    }

    private void seedExpenses() {
        expenseRepository.saveAll(Arrays.asList(
                new Expense("Rent", "Storefront premises monthly lease - Commercial Hub", new BigDecimal("25000.00"), LocalDate.now().minusDays(20), "Bank Transfer", "Shop #4 & #5 ground floor rental agreement"),
                new Expense("Salary", "Staff salaries for retail counter & store manager", new BigDecimal("38000.00"), LocalDate.now().minusDays(18), "Bank Transfer", "Processed for 3 staff members"),
                new Expense("Electricity", "Commercial power bill - BESCOM utilities", new BigDecimal("4250.00"), LocalDate.now().minusDays(15), "UPI", "Includes HVAC and lighting charges"),
                new Expense("Purchase", "Bulk replenishment packaging boxes & thermal rolls", new BigDecimal("6800.00"), LocalDate.now().minusDays(12), "Card", "500 corrugated packing cartons"),
                new Expense("Transportation", "Local logistics delivery van fuel & toll charges", new BigDecimal("2400.00"), LocalDate.now().minusDays(8), "Cash", "Route: Yeshwanthpur to Gandhi Nagar"),
                new Expense("Marketing", "Instagram & Meta hyper-local promotional campaign", new BigDecimal("3500.00"), LocalDate.now().minusDays(5), "Card", "Targeted festive discount ads"),
                new Expense("Maintenance", "AC servicing & shop barcode scanner repair", new BigDecimal("1850.00"), LocalDate.now().minusDays(2), "UPI", "Bi-monthly HVAC maintenance"),
                new Expense("Other", "Store pantry refreshments & drinking water cans", new BigDecimal("950.00"), LocalDate.now().minusDays(1), "Cash", "Pantry supplies")
        ));
    }

    private static class ItemSpec {
        Product product;
        int qty;
        BigDecimal price;

        ItemSpec(Product product, int qty, BigDecimal price) {
            this.product = product;
            this.qty = qty;
            this.price = price;
        }
    }

    private void createSale(String saleNumber, Customer customer, String paymentMethod, LocalDate date, String notes, ItemSpec... itemSpecs) {
        BigDecimal total = BigDecimal.ZERO;
        Sale sale = new Sale(saleNumber, customer, BigDecimal.ZERO, paymentMethod, date, notes);

        for (ItemSpec spec : itemSpecs) {
            BigDecimal lineTotal = spec.price.multiply(BigDecimal.valueOf(spec.qty));
            SaleItem item = new SaleItem(spec.product, spec.qty, spec.price, lineTotal);
            sale.addItem(item);
            total = total.add(lineTotal);
        }

        sale.setTotalAmount(total);
        saleRepository.save(sale);
    }
}
