package com.dailybasket.config;

import com.dailybasket.entity.*;
import com.dailybasket.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      CartRepository cartRepository,
                      AddressRepository addressRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@dailybasket.com")) {
            User admin = new User(
                    "DailyBasket Admin",
                    "admin@dailybasket.com",
                    passwordEncoder.encode("admin123"),
                    "+91 9876543210",
                    Role.ROLE_ADMIN
            );
            User savedAdmin = userRepository.save(admin);
            cartRepository.save(new Cart(savedAdmin));
            logger.info("Admin account seeded: admin@dailybasket.com");
        }

        if (!userRepository.existsByEmail("customer@dailybasket.com")) {
            User customer = new User(
                    "Sarah Jenkins",
                    "customer@dailybasket.com",
                    passwordEncoder.encode("customer123"),
                    "+91 9123456780",
                    Role.ROLE_USER
            );
            User savedCustomer = userRepository.save(customer);
            cartRepository.save(new Cart(savedCustomer));

            Address address = new Address();
            address.setUser(savedCustomer);
            address.setFullName("Sarah Jenkins");
            address.setPhone("+91 9123456780");
            address.setStreetAddress("Flat 402, Green Meadows, 5th Main Road");
            address.setLandmark("Near City Center Mall");
            address.setCity("Bengaluru");
            address.setState("Karnataka");
            address.setPinCode("560034");
            address.setAddressType("HOME");
            address.setDefault(true);
            addressRepository.save(address);

            logger.info("Sample Customer account seeded: customer@dailybasket.com");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) {
            return;
        }

        // Categories
        Category fruitsVeg = new Category("Fruits & Vegetables", "fruits-vegetables", "Farm fresh organic fruits, leafy greens and daily vegetables", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80", "Apple", 1);
        Category dairyBreakfast = new Category("Dairy & Breakfast", "dairy-breakfast", "Fresh milk, paneer, butter, artisan breads and eggs", "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500&auto=format&fit=crop&q=80", "Milk", 2);
        Category riceGrains = new Category("Rice & Grains", "rice-grains", "Premium aged basmati rice, organic pulses and whole grains", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80", "Wheat", 3);
        Category attaFlour = new Category("Atta & Flour", "atta-flour", "Freshly ground chakki atta, multigrain and specialty flours", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80", "Package", 4);
        Category snacks = new Category("Snacks & Munchies", "snacks-munchies", "Crispy chips, roasted nuts, cookies and healthy bites", "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80", "Cookie", 5);
        Category beverages = new Category("Beverages", "beverages", "Cold-pressed juices, premium teas, ground coffee and sodas", "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&auto=format&fit=crop&q=80", "Coffee", 6);
        Category household = new Category("Household Essentials", "household-essentials", "Detergents, dishwash liquids, cleaners and kitchen rolls", "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80", "Home", 7);
        Category personalCare = new Category("Personal Care", "personal-care", "Skin care, shampoos, organic soaps and dental care", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80", "Sparkles", 8);
        Category bakery = new Category("Bakery & Breads", "bakery-breads", "Artisanal sourdough, brown bread, croissants and cakes", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80", "Croissant", 9);
        Category meatSeafood = new Category("Eggs & Protein", "eggs-protein", "Farm fresh brown eggs, tofu, soya chunks and protein essentials", "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80", "Egg", 10);

        categoryRepository.saveAll(List.of(fruitsVeg, dairyBreakfast, riceGrains, attaFlour, snacks, beverages, household, personalCare, bakery, meatSeafood));

        // Products
        List<Product> products = List.of(
                // Fruits & Veg
                new Product("Fresh Cow Milk (Pasteurized)", "fresh-cow-milk", "Farm fresh, 100% pure pasteurized homogenised cow milk with rich cream layer.", dairyBreakfast, "1 L", new BigDecimal("72.00"), new BigDecimal("65.00"), 85, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80", "DailyBasket Dairy", true, true),
                new Product("Royal Premium Basmati Rice (Aged)", "premium-basmati-rice", "Long grain aromatic 2-year aged Basmati Rice, perfect for Biryani and Pulao.", riceGrains, "5 kg", new BigDecimal("540.00"), new BigDecimal("449.00"), 40, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "Royal Harvest", true, true),
                new Product("Fresh Farm Brown Eggs", "fresh-farm-brown-eggs", "Free-range organic brown eggs high in protein and Omega-3 fatty acids.", meatSeafood, "12 pcs", new BigDecimal("130.00"), new BigDecimal("110.00"), 60, "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80", "Country Farms", true, false),
                new Product("Fresh Malai Paneer (Cottage Cheese)", "fresh-malai-paneer", "Soft, creamy and melt-in-mouth cottage cheese made from fresh cow milk.", dairyBreakfast, "200 g", new BigDecimal("95.00"), new BigDecimal("82.00"), 45, "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80", "DailyBasket Dairy", true, false),
                new Product("Sharbati Whole Wheat Chakki Atta", "whole-wheat-chakki-atta", "100% whole grain stone-ground chakki fresh atta for soft rotis.", attaFlour, "5 kg", new BigDecimal("275.00"), new BigDecimal("239.00"), 50, "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?w=600&auto=format&fit=crop&q=80", "Nature's Own", true, true),

                // Fruits & Veg
                new Product("Fresh Robusta Bananas", "fresh-robusta-bananas", "Naturally ripened sweet, calcium-rich robusta bananas.", fruitsVeg, "1 kg (approx 6-8 pcs)", new BigDecimal("60.00"), new BigDecimal("48.00"), 90, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80", "DailyBasket Fresh", false, true),
                new Product("Kashmiri Royal Delicious Apples", "kashmiri-royal-apples", "Crisp, sweet, and juicy orchard-fresh red apples directly from Kashmir.", fruitsVeg, "1 kg (4 pcs)", new BigDecimal("180.00"), new BigDecimal("149.00"), 50, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80", "DailyBasket Fresh", true, false),
                new Product("Fresh Hybrid Tomatoes", "fresh-hybrid-tomatoes", "Firm and juicy handpicked red tomatoes, ideal for curries and salads.", fruitsVeg, "1 kg", new BigDecimal("45.00"), new BigDecimal("32.00"), 100, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80", "DailyBasket Fresh", false, false),
                new Product("Fresh Medium Onions", "fresh-medium-onions", "Farm harvested pungent pink onions with long shelf life.", fruitsVeg, "2 kg", new BigDecimal("90.00"), new BigDecimal("74.00"), 120, "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80", "DailyBasket Fresh", false, true),
                new Product("Farm Fresh Mountain Potatoes", "fresh-mountain-potatoes", "Starch-rich dirt-free golden potatoes for crisp fries and curries.", fruitsVeg, "2 kg", new BigDecimal("70.00"), new BigDecimal("55.00"), 110, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80", "DailyBasket Fresh", false, false),

                // Bakery & Breakfast
                new Product("100% Whole Wheat Artisan Brown Bread", "artisan-brown-bread", "Fiber-rich crusty brown bread baked with oats, seeds and wheat bran.", bakery, "400 g", new BigDecimal("55.00"), new BigDecimal("48.00"), 35, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", "BakeHouse", false, false),
                new Product("Crispy Golden Corn Flakes", "golden-corn-flakes", "Nutritious breakfast cereal fortified with iron and 8 essential vitamins.", dairyBreakfast, "475 g", new BigDecimal("220.00"), new BigDecimal("189.00"), 40, "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80", "CrunchMaster", false, true),
                new Product("Pure Cow Ghee (A2 Bilona Method)", "pure-cow-ghee", "Traditional aromatic clarified butter made using cultured bilona churning.", dairyBreakfast, "500 ml", new BigDecimal("599.00"), new BigDecimal("520.00"), 30, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80", "DailyBasket Dairy", true, false),

                // Snacks & Beverages
                new Product("Cold Pressed Fresh Valencia Orange Juice", "cold-pressed-orange-juice", "100% pure squeezed citrus orange juice with zero added sugars or preservatives.", beverages, "1 L", new BigDecimal("140.00"), new BigDecimal("119.00"), 40, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80", "PureSip", true, true),
                new Product("Assam CTC Premium Black Tea", "assam-premium-black-tea", "Strong, full-bodied golden liquor black tea leaves from Assam valley gardens.", beverages, "500 g", new BigDecimal("260.00"), new BigDecimal("219.00"), 60, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80", "Estate Brews", false, false),
                new Product("Dark Roast Arabica Ground Coffee", "arabica-ground-coffee", "Medium-dark roast single-origin high altitude roasted coffee beans with cocoa notes.", beverages, "250 g", new BigDecimal("320.00"), new BigDecimal("275.00"), 45, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", "CoffeeCraft", true, false),
                new Product("Handmade Sea Salt Potato Wafers", "sea-salt-potato-wafers", "Kettle-cooked ultra-crunchy potato chips seasoned with natural rock sea salt.", snacks, "150 g", new BigDecimal("60.00"), new BigDecimal("50.00"), 75, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80", "Crunchy Delights", false, true),
                new Product("Premium California Almonds", "premium-california-almonds", "Jumbo crunchy raw California badam kernels, rich in vitamin E and antioxidants.", snacks, "500 g", new BigDecimal("480.00"), new BigDecimal("399.00"), 50, "https://images.unsplash.com/photo-1508061252445-5350f3777130?w=600&auto=format&fit=crop&q=80", "NutriHarvest", true, true),

                // Household & Personal Care
                new Product("Eco-Active Liquid Laundry Detergent", "eco-active-laundry-detergent", "Tough on stains, gentle on fabrics with natural lavender essential oil freshness.", household, "2 L", new BigDecimal("380.00"), new BigDecimal("310.00"), 55, "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80", "CleanSpark", false, true),
                new Product("Lemon Power Concentrated Dishwash Gel", "lemon-dishwash-gel", "Degreases utensils effortlessly with real lime juice power.", household, "750 ml", new BigDecimal("135.00"), new BigDecimal("115.00"), 65, "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80", "SparkleClean", false, false),
                new Product("Organic Herbal Anti-Dandruff Shampoo", "herbal-anti-dandruff-shampoo", "Sulfate-free soothing tea tree and neem shampoo for scalp nourishment.", personalCare, "350 ml", new BigDecimal("290.00"), new BigDecimal("245.00"), 40, "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80", "NatureCare", false, false),
                new Product("Cold-Pressed Virgin Coconut Cooking Oil", "virgin-coconut-oil", "Unrefined 100% natural pure coconut oil ideal for cooking, skin & hair care.", riceGrains, "1 L", new BigDecimal("310.00"), new BigDecimal("265.00"), 50, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80", "PureNaturals", false, true),
                new Product("Organic Unpolished Toor Dal (Pigeon Pea)", "organic-toor-dal", "Nutritious high-protein unpolished yellow pigeon pea dal without chemical polish.", riceGrains, "1 kg", new BigDecimal("185.00"), new BigDecimal("159.00"), 60, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "Nature's Own", false, false)
        );

        productRepository.saveAll(products);
        logger.info("Seeded 10 categories and {} grocery products successfully!", products.size());
    }
}
