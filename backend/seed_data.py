"""Seed catalog for BharatMart - Indian e-commerce demo."""

SEED_PRODUCTS = [
    # ELECTRONICS
    {
        "id": "iphone-15-pro",
        "name": "Apple iPhone 15 Pro (256GB, Natural Titanium)",
        "brand": "Apple",
        "category": "Electronics",
        "price": 129900,
        "original_price": 149900,
        "rating": 4.7,
        "rating_count": 12480,
        "description": "The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system with 5x telephoto zoom.",
        "features": ["A17 Pro Chip", "48MP Pro Camera", "Titanium Design", "USB-C", "6.1\" Super Retina XDR"],
        "images": [
            "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1695048132498-2fbe95c50c1c?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 42,
        "is_bestseller": True,
        "is_new": True,
    },
    {
        "id": "samsung-s24-ultra",
        "name": "Samsung Galaxy S24 Ultra (512GB, Titanium Black)",
        "brand": "Samsung",
        "category": "Electronics",
        "price": 134999,
        "original_price": 154999,
        "rating": 4.6,
        "rating_count": 8965,
        "description": "Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3, built-in S Pen and a stunning 6.8\" QHD+ Dynamic AMOLED display.",
        "features": ["200MP Camera", "Snapdragon 8 Gen 3", "Built-in S Pen", "Galaxy AI", "5000mAh Battery"],
        "images": [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 30,
        "is_bestseller": True,
    },
    {
        "id": "sony-wh1000xm5",
        "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        "brand": "Sony",
        "category": "Electronics",
        "price": 29990,
        "original_price": 34990,
        "rating": 4.8,
        "rating_count": 15200,
        "description": "Industry-leading noise cancellation with two processors, 30-hour battery life and crystal clear hands-free calling.",
        "features": ["30-hour battery", "Auto NC Optimizer", "8 Microphones", "Multipoint Connection", "LDAC"],
        "images": [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 78,
        "is_bestseller": True,
    },
    {
        "id": "macbook-air-m3",
        "name": "Apple MacBook Air 13\" M3 (16GB / 512GB, Midnight)",
        "brand": "Apple",
        "category": "Electronics",
        "price": 134900,
        "original_price": 144900,
        "rating": 4.9,
        "rating_count": 4520,
        "description": "Supercharged by the M3 chip. Up to 18 hours of battery life, whisper-quiet fanless design, stunning Liquid Retina display.",
        "features": ["Apple M3 chip", "16GB RAM", "512GB SSD", "18-hr Battery", "Liquid Retina Display"],
        "images": [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 22,
        "is_new": True,
    },
    {
        "id": "oneplus-nord-ce4",
        "name": "OnePlus Nord CE 4 5G (128GB, Celadon Marble)",
        "brand": "OnePlus",
        "category": "Electronics",
        "price": 24999,
        "original_price": 27999,
        "rating": 4.3,
        "rating_count": 6890,
        "description": "Snapdragon 7 Gen 3, 100W SUPERVOOC charging, 50MP Sony camera - flagship experience without the flagship price.",
        "features": ["Snapdragon 7 Gen 3", "100W SUPERVOOC", "50MP Sony IMX882", "5500mAh Battery", "AMOLED 120Hz"],
        "images": [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 120,
    },
    {
        "id": "boat-airdopes-141",
        "name": "boAt Airdopes 141 True Wireless Earbuds",
        "brand": "boAt",
        "category": "Electronics",
        "price": 1299,
        "original_price": 2990,
        "rating": 4.1,
        "rating_count": 89340,
        "description": "42 hours playback, ENx tech for clear calls, BEAST mode for gaming and IPX4 water resistance. India's #1 earbuds.",
        "features": ["42H Playback", "ENx Technology", "BEAST Mode", "IPX4 Rated", "Bluetooth 5.1"],
        "images": [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 500,
        "is_bestseller": True,
    },

    # FASHION
    {
        "id": "levis-slim-jeans",
        "name": "Levi's Men's 511 Slim Fit Jeans (Dark Wash)",
        "brand": "Levi's",
        "category": "Fashion",
        "price": 2299,
        "original_price": 3499,
        "rating": 4.4,
        "rating_count": 3421,
        "description": "The classic 511 with modern slim fit. Made from stretch denim for all-day comfort. Iconic Levi's craftsmanship.",
        "features": ["Slim Fit", "Stretch Denim", "5-Pocket Styling", "Zip Fly"],
        "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 200,
    },
    {
        "id": "nike-air-max-270",
        "name": "Nike Air Max 270 Men's Sneakers",
        "brand": "Nike",
        "category": "Fashion",
        "price": 12995,
        "original_price": 14995,
        "rating": 4.6,
        "rating_count": 7860,
        "description": "The largest heel Air unit yet delivers next-level cushioning. Iconic silhouette meets everyday comfort.",
        "features": ["Max Air Cushioning", "Breathable Mesh Upper", "Rubber Outsole", "Foam Midsole"],
        "images": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 60,
        "is_bestseller": True,
    },
    {
        "id": "fabindia-kurta",
        "name": "Fabindia Handloom Cotton Kurta - Indigo Blue",
        "brand": "Fabindia",
        "category": "Fashion",
        "price": 1899,
        "original_price": 2499,
        "rating": 4.5,
        "rating_count": 1290,
        "description": "Hand-woven cotton kurta with subtle block prints. Perfect for festive occasions or everyday comfort.",
        "features": ["100% Handloom Cotton", "Block Print", "Machine Washable", "Sustainable"],
        "images": [
            "https://images.unsplash.com/photo-1610030006870-c5f56e2f8b78?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 85,
        "is_new": True,
    },
    {
        "id": "hm-floral-dress",
        "name": "H&M Women's Midi Floral Wrap Dress",
        "brand": "H&M",
        "category": "Fashion",
        "price": 1799,
        "original_price": 2499,
        "rating": 4.2,
        "rating_count": 980,
        "description": "Flowy wrap dress in a lightweight viscose weave. V-neck, short puff sleeves, tie at the waist.",
        "features": ["Viscose Blend", "Wrap Design", "Puff Sleeves", "Midi Length"],
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 110,
    },
    {
        "id": "rayban-wayfarer",
        "name": "Ray-Ban Wayfarer Classic Sunglasses (Black)",
        "brand": "Ray-Ban",
        "category": "Fashion",
        "price": 7990,
        "original_price": 9990,
        "rating": 4.7,
        "rating_count": 2450,
        "description": "The world's most recognizable style of sunwear. Timeless design, premium acetate frame, crystal green lenses.",
        "features": ["100% UV Protection", "Acetate Frame", "Crystal Green Lenses", "Made in Italy"],
        "images": [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 45,
    },
    {
        "id": "titan-analog-watch",
        "name": "Titan Karishma Analog Watch for Men",
        "brand": "Titan",
        "category": "Fashion",
        "price": 2695,
        "original_price": 3495,
        "rating": 4.4,
        "rating_count": 5600,
        "description": "Classic analog watch with a sleek stainless steel bracelet. Water resistant and backed by Titan's 2-year warranty.",
        "features": ["Stainless Steel", "Water Resistant 3ATM", "2-Year Warranty", "Quartz Movement"],
        "images": [
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 180,
    },

    # HOME & KITCHEN
    {
        "id": "prestige-induction",
        "name": "Prestige PIC 20 Induction Cooktop (1600W)",
        "brand": "Prestige",
        "category": "Home & Kitchen",
        "price": 2199,
        "original_price": 3195,
        "rating": 4.3,
        "rating_count": 15800,
        "description": "1600W induction cooktop with soft-touch buttons, auto shut-off, and 7 preset Indian menu options.",
        "features": ["1600W", "7 Preset Menus", "Auto Shut-off", "Anti-Magnetic Wall"],
        "images": [
            "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 240,
        "is_bestseller": True,
    },
    {
        "id": "milton-thermosteel",
        "name": "Milton Thermosteel Flask 1000ml (Silver)",
        "brand": "Milton",
        "category": "Home & Kitchen",
        "price": 799,
        "original_price": 1195,
        "rating": 4.5,
        "rating_count": 22000,
        "description": "Double-wall vacuum insulated stainless steel flask. Keeps beverages hot for 24 hours and cold for 24 hours.",
        "features": ["24 Hours Hot/Cold", "Double Wall Vacuum", "18/8 Stainless Steel", "Leak Proof"],
        "images": [
            "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 350,
    },
    {
        "id": "philips-airfryer",
        "name": "Philips HD9200 Digital Air Fryer (4.1L)",
        "brand": "Philips",
        "category": "Home & Kitchen",
        "price": 8999,
        "original_price": 12995,
        "rating": 4.6,
        "rating_count": 9800,
        "description": "Rapid Air Technology fries with up to 90% less fat. Digital touch screen with 7 preset programs.",
        "features": ["4.1L Capacity", "7 Preset Programs", "Rapid Air Tech", "Digital Display"],
        "images": [
            "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 65,
        "is_bestseller": True,
    },
    {
        "id": "bombay-dyeing-bedsheet",
        "name": "Bombay Dyeing Cotton Double Bedsheet (2 Pillow Covers)",
        "brand": "Bombay Dyeing",
        "category": "Home & Kitchen",
        "price": 1299,
        "original_price": 1999,
        "rating": 4.2,
        "rating_count": 6540,
        "description": "144 TC pure cotton double bedsheet with 2 pillow covers. Soft, breathable and machine washable.",
        "features": ["100% Cotton", "144 TC", "Includes 2 Pillow Covers", "Machine Washable"],
        "images": [
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 90,
    },
    {
        "id": "cello-water-bottle",
        "name": "Cello Butterflow Insulated Water Bottle (1L, Blue)",
        "brand": "Cello",
        "category": "Home & Kitchen",
        "price": 449,
        "original_price": 799,
        "rating": 4.4,
        "rating_count": 45000,
        "description": "BPA-free insulated water bottle keeps water cool for hours. Perfect for office, gym or travel.",
        "features": ["BPA Free", "Insulated", "Leak Proof", "1 Litre Capacity"],
        "images": [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 800,
    },

    # BEAUTY
    {
        "id": "ordinary-niacinamide",
        "name": "The Ordinary Niacinamide 10% + Zinc 1% Serum (30ml)",
        "brand": "The Ordinary",
        "category": "Beauty",
        "price": 750,
        "original_price": 950,
        "rating": 4.5,
        "rating_count": 34500,
        "description": "High-strength vitamin and zinc formula that reduces the look of blemishes and congestion.",
        "features": ["10% Niacinamide", "1% Zinc PCA", "Water-based Serum", "For Blemish-prone Skin"],
        "images": [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 300,
        "is_bestseller": True,
    },
    {
        "id": "mamaearth-ubtan",
        "name": "Mamaearth Ubtan Natural Face Wash (100ml)",
        "brand": "Mamaearth",
        "category": "Beauty",
        "price": 199,
        "original_price": 249,
        "rating": 4.3,
        "rating_count": 68000,
        "description": "Natural face wash with turmeric and saffron. Removes tan and gives instant glow. Toxin-free & dermatologically tested.",
        "features": ["With Turmeric & Saffron", "Removes Tan", "No SLS/Paraben", "Dermatologically Tested"],
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 1000,
    },
    {
        "id": "lakme-9to5-lipstick",
        "name": "Lakme 9To5 Primer + Matte Lip Color (Ruby Rush)",
        "brand": "Lakme",
        "category": "Beauty",
        "price": 550,
        "original_price": 700,
        "rating": 4.2,
        "rating_count": 12300,
        "description": "Long-lasting matte lipstick with built-in primer for velvety finish. 16 shades available.",
        "features": ["Primer + Matte", "12hr Wear", "Enriched with Vitamin E", "Free from Parabens"],
        "images": [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 420,
    },
    {
        "id": "nivea-body-lotion",
        "name": "Nivea Nourishing Body Milk Lotion (400ml)",
        "brand": "Nivea",
        "category": "Beauty",
        "price": 379,
        "original_price": 499,
        "rating": 4.6,
        "rating_count": 55000,
        "description": "48h moisture for dry skin. Enriched with almond oil and Vitamin E. Fast-absorbing formula.",
        "features": ["48hr Moisture", "Almond Oil", "Vitamin E", "For Dry Skin"],
        "images": [
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 700,
    },

    # BOOKS
    {
        "id": "wings-of-fire",
        "name": "Wings of Fire: An Autobiography - APJ Abdul Kalam",
        "brand": "Universities Press",
        "category": "Books",
        "price": 195,
        "original_price": 295,
        "rating": 4.8,
        "rating_count": 89000,
        "description": "The inspiring autobiography of India's Missile Man, Dr. APJ Abdul Kalam. Journey from Rameswaram to the President's office.",
        "features": ["Paperback", "180 Pages", "English", "Autobiography"],
        "images": [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 1200,
        "is_bestseller": True,
    },
    {
        "id": "the-alchemist",
        "name": "The Alchemist - Paulo Coelho",
        "brand": "HarperCollins",
        "category": "Books",
        "price": 299,
        "original_price": 399,
        "rating": 4.7,
        "rating_count": 156000,
        "description": "A magical story about following your dreams. The international bestseller translated into 80+ languages.",
        "features": ["Paperback", "163 Pages", "English", "Fiction"],
        "images": [
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 950,
    },
    {
        "id": "atomic-habits",
        "name": "Atomic Habits - James Clear",
        "brand": "Random House",
        "category": "Books",
        "price": 549,
        "original_price": 799,
        "rating": 4.8,
        "rating_count": 89000,
        "description": "An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller.",
        "features": ["Paperback", "320 Pages", "English", "Self-Help"],
        "images": [
            "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 780,
        "is_bestseller": True,
    },
    {
        "id": "ikigai",
        "name": "Ikigai: The Japanese Secret to a Long and Happy Life",
        "brand": "Penguin",
        "category": "Books",
        "price": 299,
        "original_price": 399,
        "rating": 4.5,
        "rating_count": 65000,
        "description": "Discover your ikigai - your reason for being. A gentle guide to living longer, better and happier.",
        "features": ["Hardcover", "208 Pages", "English", "Philosophy"],
        "images": [
            "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 640,
    },

    # GROCERY
    {
        "id": "tata-salt",
        "name": "Tata Salt Iodized (1 kg)",
        "brand": "Tata",
        "category": "Grocery",
        "price": 28,
        "original_price": 32,
        "rating": 4.7,
        "rating_count": 34000,
        "description": "Desh ka Namak. Iodized crystal salt for daily cooking. Free-flowing and 100% pure.",
        "features": ["Iodized", "Free-flowing", "1 kg pack", "PFA Approved"],
        "images": [
            "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 5000,
    },
    {
        "id": "aashirvaad-atta",
        "name": "Aashirvaad Shudh Chakki Atta (5 kg)",
        "brand": "Aashirvaad",
        "category": "Grocery",
        "price": 285,
        "original_price": 325,
        "rating": 4.6,
        "rating_count": 42000,
        "description": "100% whole wheat atta from ITC. Soft, fluffy rotis that stay soft for hours.",
        "features": ["100% Whole Wheat", "Chakki Ground", "5 kg pack", "No Maida"],
        "images": [
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 1200,
        "is_bestseller": True,
    },
    {
        "id": "amul-butter",
        "name": "Amul Pasteurised Butter (500g)",
        "brand": "Amul",
        "category": "Grocery",
        "price": 265,
        "original_price": 290,
        "rating": 4.8,
        "rating_count": 28000,
        "description": "Utterly butterly delicious! Made from fresh cream, salted and pasteurised.",
        "features": ["500g Pack", "Salted", "Pasteurised", "Rich in Vitamins A & D"],
        "images": [
            "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 1600,
    },
    {
        "id": "fortune-oil",
        "name": "Fortune Sunlite Refined Sunflower Oil (1L pouch)",
        "brand": "Fortune",
        "category": "Grocery",
        "price": 149,
        "original_price": 179,
        "rating": 4.4,
        "rating_count": 19000,
        "description": "Light and healthy refined sunflower oil. Rich in Vitamin A, D and E. Ideal for daily cooking.",
        "features": ["Refined", "Rich in Vitamins", "1 Litre Pouch", "Low in Cholesterol"],
        "images": [
            "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=1200&q=80"
        ],
        "stock": 2200,
    },
]

CATEGORIES = [
    {"slug": "electronics", "name": "Electronics", "tagline": "Latest tech at the best prices",
     "image": "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg"},
    {"slug": "fashion", "name": "Fashion", "tagline": "Trends that turn heads",
     "image": "https://images.pexels.com/photos/5639235/pexels-photo-5639235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {"slug": "home-kitchen", "name": "Home & Kitchen", "tagline": "Everyday essentials, elevated",
     "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80"},
    {"slug": "beauty", "name": "Beauty", "tagline": "Glow from within",
     "image": "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?auto=format&fit=crop&w=1200&q=80"},
    {"slug": "books", "name": "Books", "tagline": "Stories that stay with you",
     "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80"},
    {"slug": "grocery", "name": "Grocery", "tagline": "Pantry staples, delivered",
     "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"},
]
