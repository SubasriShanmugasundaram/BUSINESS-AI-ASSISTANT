package com.businessassistant.service;

import com.businessassistant.dto.AiChatRequest;
import com.businessassistant.dto.AiChatResponse;
import com.businessassistant.entity.*;
import com.businessassistant.repository.*;
import com.businessassistant.util.MoneyUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final SaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AiService(ProductRepository productRepository,
                     InventoryRepository inventoryRepository,
                     SaleRepository saleRepository,
                     ExpenseRepository expenseRepository,
                     BusinessProfileRepository businessProfileRepository,
                     ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.saleRepository = saleRepository;
        this.expenseRepository = expenseRepository;
        this.businessProfileRepository = businessProfileRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    public AiChatResponse processChat(AiChatRequest request) {
        String userQuery = request.getMessage().trim();
        String lang = (request.getLanguage() != null && !request.getLanguage().isBlank()) ? request.getLanguage() : "en";

        // 1. Determine effective Gemini API key (Request parameter > System Environment > Configured property)
        String effectiveKey = (request.getGeminiApiKey() != null && !request.getGeminiApiKey().isBlank())
                ? request.getGeminiApiKey().trim()
                : this.geminiApiKey;

        if (effectiveKey == null || effectiveKey.isBlank() || effectiveKey.contains("your_gemini")) {
            String envKey = System.getenv("GEMINI_API_KEY");
            if (envKey != null && !envKey.isBlank()) {
                effectiveKey = envKey.trim();
            }
        }

        // 2. Gather targeted factual business context based on live database
        String context = buildBusinessContext(userQuery);

        // 3. If Gemini API key is available, call Gemini with live store telemetry
        if (effectiveKey != null && !effectiveKey.isBlank() && !effectiveKey.contains("your_gemini")) {
            try {
                String geminiAnswer = callGemini(userQuery, context, lang, effectiveKey);
                if (geminiAnswer != null && !geminiAnswer.isBlank()) {
                    List<String> actions = generateSuggestedActions(userQuery);
                    return new AiChatResponse(geminiAnswer, lang, actions, "Google Gemini 1.5 Flash (Live Store Context)");
                }
            } catch (Exception e) {
                logger.warn("Gemini API call failed: {}. Falling back to internal business intelligence engine.", e.getMessage());
            }
        }

        // 4. High-precision contextual answer generated directly from factual database calculations
        String answer = generateFactualResponse(userQuery, lang);
        List<String> actions = generateSuggestedActions(userQuery);
        return new AiChatResponse(answer, lang, actions, "Direct Business Intelligence Engine (Live Database)");
    }

    private String buildBusinessContext(String query) {
        StringBuilder sb = new StringBuilder();

        BusinessProfile bp = businessProfileRepository.findFirstByOrderByIdAsc().orElse(null);
        if (bp != null) {
            sb.append("Business Name: ").append(bp.getBusinessName()).append("\n");
            sb.append("GSTIN: ").append(bp.getGstin()).append("\n");
        }

        // Inventory status
        List<Inventory> inventoryList = inventoryRepository.findAll();
        sb.append("\nINVENTORY SUMMARY:\n");
        for (Inventory inv : inventoryList) {
            sb.append(String.format("- %s: Stock %d (Reorder Level: %d, Status: %s, Price: ₹%s)\n",
                    inv.getProduct().getName(),
                    inv.getCurrentStock(),
                    inv.getReorderLevel(),
                    inv.getStockStatus(),
                    inv.getProduct().getSellingPrice()));
        }

        // Sales totals
        List<Sale> sales = saleRepository.findAll();
        BigDecimal totalSales = sales.stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal todaySales = sales.stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()) && LocalDate.now().equals(s.getSaleDate()))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        sb.append(String.format("\nFINANCIALS:\n- Total Sales Revenue: ₹%s\n- Today's Sales: ₹%s\n- Completed Invoices: %d\n",
                totalSales, todaySales, sales.size()));

        // Expenses totals
        List<Expense> expenses = expenseRepository.findAll();
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netProfit = totalSales.subtract(totalExpenses);
        sb.append(String.format("- Total Expenses: ₹%s\n- Net Profit (Sales - Expenses): ₹%s\n",
                totalExpenses, netProfit));

        // Expense category breakdown
        Map<String, BigDecimal> expensesByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
        sb.append("Expenses by Category: ").append(expensesByCategory).append("\n");

        return sb.toString();
    }

    private String callGemini(String userQuery, String businessContext, String language, String apiKey) throws Exception {
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String systemInstruction = "You are BizPartner AI, a friendly and highly knowledgeable business partner assisting an Indian MSME / retail business owner.\n" +
                "You must strictly use the provided live business data below to answer accurately with real numbers.\n" +
                "Do NOT fabricate sales or inventory values. If information is not in the data, state clearly that it is not available.\n" +
                "Language requirement: You MUST reply in the requested language: " + language + ".\n\n" +
                "LIVE BUSINESS DATA:\n" + businessContext;

        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", userQuery);
        contentMap.put("parts", List.of(parts));

        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", systemInstruction);

        Map<String, Object> root = new HashMap<>();
        root.put("contents", List.of(contentMap));
        root.put("systemInstruction", Map.of("parts", List.of(systemPart)));

        String jsonPayload = objectMapper.writeValueAsString(root);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JsonNode respNode = objectMapper.readTree(response.body());
            JsonNode candidates = respNode.get("candidates");
            if (candidates != null && candidates.isArray() && !candidates.isEmpty()) {
                JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                return textNode.asText();
            }
        } else {
            logger.warn("Gemini API call failed with status code {}: {}", response.statusCode(), response.body());
        }
        return null;
    }

    private String generateFactualResponse(String query, String lang) {
        String q = query.toLowerCase().trim();

        boolean isGreeting = q.contains("bro") || q.contains("hi") || q.contains("hello") || q.contains("hey") ||
                q.contains("vanakkam") || q.contains("வணக்கம்") || q.contains("नमस्ते") || q.contains("help") ||
                q.equals("bro") || q.equals("hi") || q.equals("hello") || q.equals("வணக்கம்");

        if (isGreeting) {
            List<Sale> sales = saleRepository.findAll();
            BigDecimal totalSales = sales.stream()
                    .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                    .map(Sale::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<Expense> expenses = expenseRepository.findAll();
            BigDecimal totalExpenses = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal netProfit = totalSales.subtract(totalExpenses);

            List<Inventory> lowStock = inventoryRepository.findLowStockItems();
            int lowStockCount = lowStock.size();

            if ("ta".equals(lang)) {
                return String.format("வணக்கம் நண்பா! நான் உங்கள் BizPartner AI வணிக நுண்ணறிவு கூட்டாளி.\n\n" +
                        "📊 **கடையின் தற்போதைய நேரலை நிலவரம்:**\n" +
                        "• மொத்த விற்பனை: ₹%s (%d பில்கள்)\n" +
                        "• நிகர இயக்க லாபம்: ₹%s\n" +
                        "• குறைந்த இருப்பு எச்சரிக்கைகள்: %d பொருட்கள்\n\n" +
                        "கடை வளர்ச்சி, புதிய கொள்முதல், தயாரிப்பு விவரங்கள் அல்லது வரி குறித்து என்னிடம் எதையும் கேளுங்கள்!",
                        totalSales, sales.size(), netProfit, lowStockCount);
            } else if ("hi".equals(lang)) {
                return String.format("नमस्ते भाई! मैं आपका BizPartner AI बिजनेस पार्टनर हूँ।\n\n" +
                        "📊 **लाइव स्टोर स्थिति:**\n" +
                        "• कुल बिक्री: ₹%s (%d इनवॉइस)\n" +
                        "• शुद्ध लाभ: ₹%s\n" +
                        "• कम स्टॉक वाले उत्पाद: %d\n\n" +
                        "आप मुझसे इन्वेंट्री, खरीद सिफारिशें या मुनाफे के बारे में कभी भी पूछ सकते हैं!",
                        totalSales, sales.size(), netProfit, lowStockCount);
            } else {
                return String.format("Hey bro! I am your BizPartner AI business partner with real-time access to your store database.\n\n" +
                        "📊 **Live Store Snapshot:**\n" +
                        "• Gross Sales: ₹%s across %d transactions\n" +
                        "• Net Operating Profit: ₹%s\n" +
                        "• Low Stock Items: %d products\n\n" +
                        "Ask me anything about purchase recommendations, inventory health, fast-selling products, or financial margins!",
                        totalSales, sales.size(), netProfit, lowStockCount);
            }
        }

        boolean isStockQuery = q.contains("run out") || q.contains("low stock") || q.contains("out of stock") || q.contains("stock") ||
                q.contains("இருப்பு") || q.contains("தீர்ந்து") || q.contains("स्टॉक") || q.contains("खत्म") || q.contains("कमी");

        boolean isPurchaseQuery = q.contains("buy") || q.contains("purchase") || q.contains("order") ||
                q.contains("வாங்க") || q.contains("ஆர்டர்") || q.contains("खरीद") || q.contains("मंगाना");

        boolean isProfitQuery = q.contains("profit") || q.contains("revenue") || q.contains("sales") || q.contains("expense") || q.contains("money") ||
                q.contains("லாபம்") || q.contains("வருமானம்") || q.contains("செலவு") || q.contains("விற்பனை") ||
                q.contains("लाभ") || q.contains("मुनाफा") || q.contains("आय") || q.contains("खर्च") || q.contains("बिक्री");

        boolean isProductQuery = q.contains("sell") || q.contains("product") || q.contains("fast") || q.contains("slow") || q.contains("top") ||
                q.contains("பொருள்") || q.contains("அதிகமாக") || q.contains("उत्पाद") || q.contains("ज्यादा") || q.contains("बिक");

        // 1. Stockout / Low stock inquiry
        if (isStockQuery) {
            List<Inventory> outOfStock = inventoryRepository.findOutOfStockItems();
            List<Inventory> lowStock = inventoryRepository.findLowStockItems();

            StringBuilder sb = new StringBuilder();
            if (!outOfStock.isEmpty()) {
                sb.append("ta".equals(lang) ? "⚠️ **கையிருப்பு இல்லாத பொருட்கள்:**\n" :
                          "hi".equals(lang) ? "⚠️ **स्टॉक समाप्त उत्पाद:**\n" :
                          "⚠️ **Out of Stock Alert:**\n");
                for (Inventory inv : outOfStock) {
                    sb.append(String.format("• **%s** (%d units)\n", inv.getProduct().getName(), inv.getCurrentStock()));
                }
            }
            if (!lowStock.isEmpty()) {
                sb.append("ta".equals(lang) ? "\n🔔 **குறைந்த இருப்பு எச்சரிக்கை:**\n" :
                          "hi".equals(lang) ? "\n🔔 **कम स्टॉक वाले उत्पाद:**\n" :
                          "\n🔔 **Low Stock Items:**\n");
                for (Inventory inv : lowStock) {
                    sb.append(String.format("• **%s**: %d units (Reorder: %d)\n",
                            inv.getProduct().getName(), inv.getCurrentStock(), inv.getReorderLevel()));
                }
            }
            if (outOfStock.isEmpty() && lowStock.isEmpty()) {
                sb.append("ta".equals(lang) ? "✅ அனைத்து பொருட்களும் போதுமான இருப்புடன் உள்ளன." :
                          "hi".equals(lang) ? "✅ सभी उत्पाद पर्याप्त स्टॉक में उपलब्ध हैं।" :
                          "✅ All inventory items are currently healthy and above their reorder thresholds.");
            }
            return sb.toString();
        }

        // 2. Which product should I buy / purchase recommendation
        if (isPurchaseQuery) {
            List<Inventory> lowOrOut = inventoryRepository.findLowStockItems();
            if (lowOrOut.isEmpty()) {
                return "ta".equals(lang) ? "அனைத்து பொருட்களும் போதுமான அளவில் உள்ளன. இன்று கொள்முதல் செய்ய வேண்டிய அவசியமில்லை." :
                       "hi".equals(lang) ? "सभी उत्पाद पर्याप्त स्टॉक में हैं। आज कोई नया स्टॉक मंगाने की आवश्यकता नहीं है।" :
                       "All product stocks are currently healthy. No urgent replenishment is needed today.";
            }
            StringBuilder sb = new StringBuilder("ta".equals(lang) ? "📦 **பரிந்துரைக்கப்படும் கொள்முதல்:**\n" :
                                                 "hi".equals(lang) ? "📦 **अनुशंसित खरीद सूची:**\n" :
                                                 "📦 **Recommended Purchases:**\n");
            for (Inventory inv : lowOrOut) {
                int needed = Math.max(inv.getReorderLevel() * 2, inv.getReorderLevel() - inv.getCurrentStock() + 10);
                BigDecimal cost = MoneyUtil.multiply(inv.getProduct().getPurchasePrice(), needed);
                sb.append(String.format("• **%s**: %d units (Est: ₹%s). Stock: %d.\n",
                        inv.getProduct().getName(), needed, cost, inv.getCurrentStock()));
            }
            return sb.toString();
        }

        // 3. Profit / Revenue / Financials
        if (isProfitQuery) {
            List<Sale> sales = saleRepository.findAll();
            BigDecimal totalSales = sales.stream()
                    .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                    .map(Sale::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal todaySales = sales.stream()
                    .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()) && LocalDate.now().equals(s.getSaleDate()))
                    .map(Sale::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<Expense> expenses = expenseRepository.findAll();
            BigDecimal totalExpenses = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal netProfit = totalSales.subtract(totalExpenses);

            return String.format(
                    "📊 **Financial Performance Summary:**\n" +
                    "• **Total Sales Revenue:** ₹%s across %d transactions\n" +
                    "• **Today's Sales:** ₹%s\n" +
                    "• **Operating Expenses:** ₹%s\n" +
                    "• **Net Profit (Revenue − Expenses):** ₹%s\n\n" +
                    "%s",
                    totalSales, sales.size(), todaySales, totalExpenses, netProfit,
                    netProfit.compareTo(BigDecimal.ZERO) >= 0 ? "✅ Your business is operating with a positive net margin." :
                    "💡 Notice: Total operational expenses exceed recent sales revenue. Review major expense categories (Rent/Salaries) and increase sales velocity."
            );
        }

        // 4. Best-selling or slow-selling products
        if (isProductQuery) {
            List<Sale> sales = saleRepository.findAll();
            Map<String, Integer> productQuantities = new HashMap<>();

            for (Sale s : sales) {
                if ("Completed".equalsIgnoreCase(s.getStatus()) && s.getItems() != null) {
                    for (SaleItem item : s.getItems()) {
                        if (item.getProduct() != null) {
                            productQuantities.merge(item.getProduct().getName(), item.getQuantity(), Integer::sum);
                        }
                    }
                }
            }

            List<Map.Entry<String, Integer>> sorted = productQuantities.entrySet().stream()
                    .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                    .collect(Collectors.toList());

            if (sorted.isEmpty()) {
                return "ta".equals(lang) ? "விற்பனை விவரங்கள் எதுவும் இதுவரை பதிவு செய்யப்படவில்லை." :
                       "hi".equals(lang) ? "अभी तक कोई बिक्री लेन-देन दर्ज नहीं किया गया है।" :
                       "No sales transactions recorded yet to determine top-selling products.";
            }

            StringBuilder sb = new StringBuilder("ta".equals(lang) ? "🏆 **அதிகமாக விற்பனையாகும் பொருட்கள்:**\n" :
                                                 "hi".equals(lang) ? "🏆 **सबसे ज्यादा बिकने वाले उत्पाद:**\n" :
                                                 "🏆 **Top Selling Products:**\n");
            int rank = 1;
            for (Map.Entry<String, Integer> e : sorted) {
                sb.append(String.format("%d. **%s** – %d units sold\n", rank++, e.getKey(), e.getValue()));
                if (rank > 4) break;
            }

            if (sorted.size() > 4) {
                Map.Entry<String, Integer> slowest = sorted.get(sorted.size() - 1);
                sb.append("ta".equals(lang) ? String.format("\n🐢 **மெதுவாக விற்பனையாகும் பொருள்:** %s (%d units). சிறப்பு தள்ளுபடி அல்லது சலுகைகளை பரிசீலிக்கவும்.", slowest.getKey(), slowest.getValue()) :
                          "hi".equals(lang) ? String.format("\n🐢 **धीमी गति से बिकने वाला उत्पाद:** %s (%d units). छूट या ऑफर पर विचार करें।", slowest.getKey(), slowest.getValue()) :
                          String.format("\n🐢 **Slow-moving item:** %s (%d units sold). Consider seasonal discounts or bundled offers.", slowest.getKey(), slowest.getValue()));
            }

            return sb.toString();
        }

        // Default overview with live store telemetry
        List<Sale> sales = saleRepository.findAll();
        BigDecimal totalSales = sales.stream()
                .filter(s -> "Completed".equalsIgnoreCase(s.getStatus()))
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Expense> expenses = expenseRepository.findAll();
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal netProfit = totalSales.subtract(totalExpenses);
        List<Inventory> lowStock = inventoryRepository.findLowStockItems();

        if ("ta".equals(lang)) {
            return String.format("வணக்கம்! நான் உங்கள் நேரலை BizPartner AI வணிக நுண்ணறிவு கூட்டாளி.\n\n" +
                    "📊 **கடை நேரலை நிலவரம் (நேரலை தரவுத்தளம்):**\n" +
                    "• மொத்த விற்பனை: ₹%s (%d பில்கள்)\n" +
                    "• நிகர இயக்க லாபம்: ₹%s\n" +
                    "• குறைந்த இருப்பு எச்சரிக்கை: %d பொருட்கள்\n\n" +
                    "நீங்கள் கேட்கக்கூடிய கேள்விகள்:\n" +
                    "• *'எந்தப் பொருட்கள் விரைவில் தீர்ந்துவிடும்?'*\n" +
                    "• *'இன்று நான் என்ன வாங்க வேண்டும்?'*\n" +
                    "• *'எனது நிகர லாபம் எவ்வளவு?'*\n" +
                    "• *'அதிகமாக விற்பனையாகும் பொருள் எது?'*\n\n" +
                    "💡 *முழுமையான ஜெனரேட்டிவ் AI மற்றும் கார்ட்டீசியா நரம்பியல் குரலுக்கு மேலே உள்ள 'Setup AI Keys' பொத்தானைப் பயன்படுத்தி உங்கள் API Key-களை இணைக்கவும்.*",
                    totalSales, sales.size(), netProfit, lowStock.size());
        } else if ("hi".equals(lang)) {
            return String.format("नमस्ते! मैं आपका BizPartner AI बिजनेस पार्टनर हूँ।\n\n" +
                    "📊 **स्टोर लाइव स्थिति (डेटाबेस):**\n" +
                    "• कुल बिक्री: ₹%s (%d इनवॉइस)\n" +
                    "• शुद्ध लाभ: ₹%s\n" +
                    "• कम स्टॉक उत्पाद: %d\n\n" +
                    "आप मुझसे पूछ सकते हैं:\n" +
                    "• *'कौन से उत्पाद जल्द खत्म हो रहे हैं?'*\n" +
                    "• *'मुझे आज क्या खरीदना चाहिए?'*\n" +
                    "• *'मेरा शुद्ध लाभ कितना है?'*\n\n" +
                    "💡 *संपूर्ण Generative AI और Cartesia Voice के लिए ऊपर 'Setup AI Keys' पर क्लिक करें।*",
                    totalSales, sales.size(), netProfit, lowStock.size());
        }

        return String.format("Hello! I am your BizPartner AI business partner with real-time access to your store database.\n\n" +
                "📊 **Live Store Snapshot:**\n" +
                "• Gross Sales: ₹%s across %d transactions\n" +
                "• Net Operating Profit: ₹%s\n" +
                "• Low Stock Items: %d products\n\n" +
                "You can ask me questions like:\n" +
                "• *'Which products may run out soon?'*\n" +
                "• *'What should I purchase today?'*\n" +
                "• *'What is my net profit?'*\n" +
                "• *'Which product sells the most?'*\n\n" +
                "💡 *Pro-tip: Connect your Google Gemini API Key and Cartesia Voice in the 'Setup AI Keys' drawer above for advanced reasoning and neural voice!*",
                totalSales, sales.size(), netProfit, lowStock.size());
    }

    private List<String> generateSuggestedActions(String query) {
        String q = query.toLowerCase();
        List<String> actions = new ArrayList<>();
        if (q.contains("run out") || q.contains("stock") || q.contains("buy")) {
            actions.add("Go to Inventory Management");
            actions.add("View Purchase Recommendations");
            actions.add("Open POS Billing");
        } else if (q.contains("profit") || q.contains("sales") || q.contains("expense")) {
            actions.add("View Reports & Analytics");
            actions.add("Log an Expense");
            actions.add("Check Today's Sales");
        } else {
            actions.add("Check Low Stock Items");
            actions.add("Review Today's Sales");
            actions.add("View Purchase Recommendations");
        }
        return actions;
    }
}
