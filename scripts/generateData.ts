import * as fs from 'fs';
import * as path from 'path';

// Interfaces
interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  weight?: string;
  dimensions?: string;
  colors?: string[];
  sizes?: string[];
  material?: string;
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-customer' | 'resolved' | 'closed';
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'shipping' | 'returns' | 'privacy' | 'terms' | 'warranty' | 'payment';
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free-shipping' | 'buy-one-get-one';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categories?: string[];
  excludedProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

// Helper functions
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals: number = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Data pools
const categories = [
  { name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Wearables', 'Accessories'] },
  { name: 'Home & Kitchen', subcategories: ['Appliances', 'Cookware', 'Furniture', 'Bedding', 'Storage', 'Decor', 'Lighting'] },
  { name: 'Fashion', subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Watches', 'Bags'] },
  { name: 'Sports & Outdoors', subcategories: ['Fitness', 'Camping', 'Cycling', 'Water Sports', 'Team Sports', 'Outdoor Gear', 'Athletic Wear'] },
  { name: 'Beauty & Personal Care', subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Tools', 'Men\'s Grooming', 'Bath & Body'] },
  { name: 'Toys & Games', subcategories: ['Educational', 'Board Games', 'Action Figures', 'Dolls', 'Building Sets', 'Outdoor Play', 'Puzzles'] },
  { name: 'Books & Media', subcategories: ['Fiction', 'Non-Fiction', 'Children\'s Books', 'eBooks', 'Audiobooks', 'Movies', 'Music'] },
  { name: 'Office Supplies', subcategories: ['Stationery', 'Organizers', 'Electronics', 'Furniture', 'Art Supplies', 'Shipping', 'Presentation'] },
  { name: 'Automotive', subcategories: ['Parts', 'Accessories', 'Tools', 'Car Care', 'Electronics', 'Interior', 'Exterior'] },
  { name: 'Health & Wellness', subcategories: ['Vitamins', 'Supplements', 'Medical Supplies', 'Fitness Equipment', 'Nutrition', 'Personal Care', 'Mobility'] }
];

const brands = [
  'TechPro', 'HomeEssentials', 'StyleCraft', 'ActiveLife', 'BeautyFirst', 'PlayZone',
  'SmartChoice', 'PremiumPlus', 'EcoLiving', 'UrbanStyle', 'NatureBest', 'InnovateTech',
  'ComfortHome', 'FitZone', 'EliteWear', 'PureBeauty', 'ClassicChoice', 'ModernSpace',
  'PowerTech', 'LuxuryLine', 'EcoFriendly', 'SportMax', 'HealthyLife', 'CreativeMinds'
];

const adjectives = [
  'Premium', 'Professional', 'Deluxe', 'Ultra', 'Advanced', 'Smart', 'Eco-Friendly',
  'Portable', 'Wireless', 'Compact', 'Durable', 'Lightweight', 'Heavy-Duty', 'Ergonomic',
  'Stylish', 'Modern', 'Classic', 'Luxury', 'Budget-Friendly', 'High-Performance'
];

// Image search terms by subcategory for more relevant product images
const subcategoryImageTerms: Record<string, string> = {
  'Smartphones': 'smartphone,phone,mobile',
  'Laptops': 'laptop,computer,macbook',
  'Tablets': 'tablet,ipad,digital',
  'Cameras': 'camera,photography,dslr',
  'Audio': 'headphones,speaker,audio',
  'Wearables': 'smartwatch,wearable,fitness',
  'Accessories': 'tech,gadget,accessory',
  'Appliances': 'appliance,kitchen,modern',
  'Cookware': 'cookware,pan,kitchen',
  'Furniture': 'furniture,modern,interior',
  'Bedding': 'bedding,bedroom,pillow',
  'Storage': 'storage,organize,container',
  'Decor': 'decor,home,interior',
  'Lighting': 'lamp,light,lighting',
  "Men's Clothing": 'menswear,fashion,clothing',
  "Women's Clothing": 'dress,fashion,women',
  'Shoes': 'shoes,sneakers,footwear',
  'Jewelry': 'jewelry,necklace,ring',
  'Watches': 'watch,luxury,timepiece',
  'Bags': 'bag,handbag,backpack',
  'Fitness': 'fitness,gym,workout',
  'Camping': 'camping,outdoor,tent',
  'Cycling': 'bicycle,cycling,bike',
  'Water Sports': 'swimming,water,sports',
  'Team Sports': 'sports,ball,athletic',
  'Outdoor Gear': 'outdoor,hiking,adventure',
  'Athletic Wear': 'sportswear,athletic,running',
  'Skincare': 'skincare,beauty,cosmetic',
  'Makeup': 'makeup,cosmetic,beauty',
  'Hair Care': 'haircare,shampoo,hair',
  'Fragrances': 'perfume,fragrance,cologne',
  'Tools': 'tools,equipment,beauty',
  "Men's Grooming": 'grooming,razor,mens',
  'Bath & Body': 'bath,soap,body',
  'Educational': 'toys,educational,learning',
  'Board Games': 'boardgame,game,puzzle',
  'Action Figures': 'toys,action,figure',
  'Dolls': 'doll,toys,children',
  'Building Sets': 'lego,building,blocks',
  'Outdoor Play': 'playground,outdoor,toys',
  'Puzzles': 'puzzle,jigsaw,brain',
  'Fiction': 'book,reading,novel',
  'Non-Fiction': 'book,knowledge,reading',
  "Children's Books": 'childrens,book,colorful',
  'eBooks': 'ebook,digital,reading',
  'Audiobooks': 'audiobook,headphones,book',
  'Movies': 'movie,film,cinema',
  'Music': 'music,vinyl,record',
  'Stationery': 'stationery,pen,paper',
  'Organizers': 'organizer,desk,office',
  'Art Supplies': 'art,paint,creative',
  'Shipping': 'box,package,shipping',
  'Presentation': 'presentation,office,business',
  'Parts': 'car,auto,parts',
  'Car Care': 'carwash,cleaning,auto',
  'Interior': 'car,interior,seat',
  'Exterior': 'car,exterior,accessory',
  'Vitamins': 'vitamins,health,supplement',
  'Supplements': 'supplement,protein,health',
  'Medical Supplies': 'medical,health,firstaid',
  'Fitness Equipment': 'gym,equipment,fitness',
  'Nutrition': 'nutrition,healthy,food',
  'Personal Care': 'personalcare,wellness,health',
  'Mobility': 'mobility,wheelchair,health'
};

const userNames = [
  'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Williams',
  'James Brown', 'Amanda Lee', 'Christopher Davis', 'Ashley Martinez', 'Matthew Wilson',
  'Jennifer Taylor', 'Daniel Anderson', 'Lisa Thomas', 'Robert Jackson', 'Michelle White',
  'Kevin Harris', 'Laura Martin', 'Brian Thompson', 'Nicole Garcia', 'Steven Martinez'
];

const reviewTitles = {
  5: [
    'Absolutely Perfect!', 'Best Purchase Ever!', 'Exceeded All Expectations',
    'Outstanding Quality', 'Highly Recommend!', 'Love It!', 'Amazing Product',
    'Could Not Be Happier', 'Exactly What I Needed', 'Premium Quality'
  ],
  4: [
    'Very Good Product', 'Great Value', 'Happy With Purchase', 'Solid Choice',
    'Recommended', 'Good Quality', 'Well Made', 'Satisfied Customer',
    'Worth the Money', 'Nice Product'
  ],
  3: [
    'It\'s Okay', 'Average Product', 'Meets Basic Needs', 'Decent for the Price',
    'Has Pros and Cons', 'Could Be Better', 'Acceptable', 'Nothing Special',
    'Mixed Feelings', 'Fair Quality'
  ],
  2: [
    'Disappointed', 'Not What I Expected', 'Below Average', 'Quality Issues',
    'Had Problems', 'Not Recommended', 'Could Use Improvement', 'Somewhat Disappointed',
    'Not Great', 'Expected More'
  ],
  1: [
    'Very Disappointed', 'Poor Quality', 'Waste of Money', 'Terrible Product',
    'Do Not Buy', 'Completely Unsatisfied', 'Broke Quickly', 'Not Worth It',
    'Terrible Experience', 'Regret This Purchase'
  ]
};

const ticketCategories = [
  'Order Issue', 'Shipping', 'Product Quality', 'Returns & Refunds', 'Account',
  'Payment', 'Technical Support', 'Product Information', 'Website Issue', 'Other'
];

// Real products with actual specs (20 each = 100 total)
const realProducts = {
  laptops: [
    { name: 'MacBook Pro 14-inch M3 Pro', brand: 'Apple', price: 1999, specs: { processor: 'Apple M3 Pro (11-core CPU, 14-core GPU)', ram: '18GB Unified Memory', storage: '512GB SSD', display: '14.2" Liquid Retina XDR (3024x1964)', battery: 'Up to 17 hours', weight: '3.5 lbs' }},
    { name: 'MacBook Air 15-inch M3', brand: 'Apple', price: 1299, specs: { processor: 'Apple M3 (8-core CPU, 10-core GPU)', ram: '8GB Unified Memory', storage: '256GB SSD', display: '15.3" Liquid Retina (2880x1864)', battery: 'Up to 18 hours', weight: '3.3 lbs' }},
    { name: 'Dell XPS 15 9530', brand: 'Dell', price: 1849, specs: { processor: 'Intel Core i7-13700H', ram: '16GB DDR5', storage: '512GB NVMe SSD', display: '15.6" OLED 3.5K (3456x2160)', graphics: 'NVIDIA RTX 4060', weight: '4.23 lbs' }},
    { name: 'Dell XPS 13 Plus', brand: 'Dell', price: 1399, specs: { processor: 'Intel Core i7-1360P', ram: '16GB LPDDR5', storage: '512GB SSD', display: '13.4" OLED 3.5K Touch', battery: 'Up to 13 hours', weight: '2.73 lbs' }},
    { name: 'ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', price: 1649, specs: { processor: 'Intel Core i7-1365U vPro', ram: '16GB LPDDR5', storage: '512GB SSD', display: '14" 2.8K OLED (2880x1800)', battery: 'Up to 15 hours', weight: '2.48 lbs' }},
    { name: 'ThinkPad T14s Gen 4', brand: 'Lenovo', price: 1429, specs: { processor: 'AMD Ryzen 7 PRO 7840U', ram: '32GB LPDDR5X', storage: '512GB SSD', display: '14" 2.8K OLED', battery: 'Up to 12 hours', weight: '2.87 lbs' }},
    { name: 'HP Spectre x360 16', brand: 'HP', price: 1649, specs: { processor: 'Intel Core i7-13700H', ram: '16GB DDR4', storage: '512GB SSD', display: '16" 3K+ OLED Touch (3072x1920)', graphics: 'Intel Arc A370M', weight: '4.45 lbs' }},
    { name: 'HP EliteBook 840 G10', brand: 'HP', price: 1579, specs: { processor: 'Intel Core i7-1365U vPro', ram: '16GB DDR5', storage: '512GB SSD', display: '14" WUXGA IPS', battery: 'Up to 14 hours', weight: '3.06 lbs' }},
    { name: 'ASUS ROG Zephyrus G14 (2024)', brand: 'ASUS', price: 1599, specs: { processor: 'AMD Ryzen 9 8945HS', ram: '16GB DDR5', storage: '1TB SSD', display: '14" ROG Nebula OLED (2880x1800) 120Hz', graphics: 'NVIDIA RTX 4060', weight: '3.31 lbs' }},
    { name: 'ASUS ZenBook 14 OLED', brand: 'ASUS', price: 999, specs: { processor: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5X', storage: '512GB SSD', display: '14" 3K OLED (2880x1800)', battery: 'Up to 14 hours', weight: '2.87 lbs' }},
    { name: 'Microsoft Surface Laptop 6', brand: 'Microsoft', price: 1299, specs: { processor: 'Intel Core Ultra 7 165H', ram: '16GB LPDDR5x', storage: '512GB SSD', display: '13.8" PixelSense (2304x1536)', battery: 'Up to 17 hours', weight: '2.96 lbs' }},
    { name: 'Surface Pro 10', brand: 'Microsoft', price: 1499, specs: { processor: 'Intel Core Ultra 7 165U', ram: '16GB LPDDR5x', storage: '512GB SSD', display: '13" PixelSense Flow (2880x1920) 120Hz', battery: 'Up to 14 hours', weight: '1.97 lbs' }},
    { name: 'Razer Blade 16 (2024)', brand: 'Razer', price: 2999, specs: { processor: 'Intel Core i9-14900HX', ram: '32GB DDR5', storage: '1TB SSD', display: '16" QHD+ 240Hz', graphics: 'NVIDIA RTX 4080', weight: '5.4 lbs' }},
    { name: 'Razer Blade 14 (2024)', brand: 'Razer', price: 2199, specs: { processor: 'AMD Ryzen 9 8945HS', ram: '16GB DDR5', storage: '1TB SSD', display: '14" QHD+ 240Hz', graphics: 'NVIDIA RTX 4070', weight: '4.05 lbs' }},
    { name: 'MSI Creator Z16 HX Studio', brand: 'MSI', price: 2799, specs: { processor: 'Intel Core i9-13950HX', ram: '64GB DDR5', storage: '2TB NVMe SSD', display: '16" QHD+ Mini LED 120Hz', graphics: 'NVIDIA RTX 4070', weight: '5.29 lbs' }},
    { name: 'Acer Swift Go 14', brand: 'Acer', price: 849, specs: { processor: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5X', storage: '512GB SSD', display: '14" 2.8K OLED (2880x1800)', battery: 'Up to 12 hours', weight: '2.87 lbs' }},
    { name: 'Samsung Galaxy Book4 Pro', brand: 'Samsung', price: 1449, specs: { processor: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5', storage: '512GB SSD', display: '14" 3K AMOLED (2880x1800)', battery: 'Up to 18 hours', weight: '2.71 lbs' }},
    { name: 'LG Gram 17 (2024)', brand: 'LG', price: 1699, specs: { processor: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5X', storage: '1TB SSD', display: '17" WQXGA IPS (2560x1600)', battery: 'Up to 15.5 hours', weight: '3.2 lbs' }},
    { name: 'Framework Laptop 16', brand: 'Framework', price: 1399, specs: { processor: 'AMD Ryzen 7 7840HS', ram: '16GB DDR5 (upgradeable)', storage: '512GB SSD (upgradeable)', display: '16" 2560x1600 165Hz', graphics: 'AMD Radeon 780M', weight: '4.63 lbs' }},
    { name: 'Alienware m18 R2', brand: 'Alienware', price: 2499, specs: { processor: 'Intel Core i9-14900HX', ram: '32GB DDR5', storage: '1TB SSD', display: '18" QHD+ 165Hz', graphics: 'NVIDIA RTX 4080', weight: '8.99 lbs' }},
  ],
  smartphones: [
    { name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, specs: { display: '6.7" Super Retina XDR OLED (2796x1290) 120Hz', processor: 'A17 Pro chip', camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto', storage: '256GB', battery: '4441mAh, USB-C', features: 'Titanium design, Action button' }},
    { name: 'iPhone 15 Pro', brand: 'Apple', price: 999, specs: { display: '6.1" Super Retina XDR OLED (2556x1179) 120Hz', processor: 'A17 Pro chip', camera: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto', storage: '128GB', battery: '3274mAh, USB-C', features: 'Titanium design, Action button' }},
    { name: 'iPhone 15', brand: 'Apple', price: 799, specs: { display: '6.1" Super Retina XDR OLED (2556x1179)', processor: 'A16 Bionic chip', camera: '48MP Main + 12MP Ultra Wide', storage: '128GB', battery: '3349mAh, USB-C', features: 'Dynamic Island' }},
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 1299, specs: { display: '6.8" Dynamic AMOLED 2X (3120x1440) 120Hz', processor: 'Snapdragon 8 Gen 3', camera: '200MP Main + 12MP Ultra Wide + 50MP 5x + 10MP 3x', storage: '256GB', battery: '5000mAh', features: 'S Pen, Titanium frame, Galaxy AI' }},
    { name: 'Samsung Galaxy S24+', brand: 'Samsung', price: 999, specs: { display: '6.7" Dynamic AMOLED 2X (3120x1440) 120Hz', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main + 12MP Ultra Wide + 10MP 3x Telephoto', storage: '256GB', battery: '4900mAh', features: 'Galaxy AI' }},
    { name: 'Samsung Galaxy Z Fold 5', brand: 'Samsung', price: 1799, specs: { display: '7.6" QXGA+ Dynamic AMOLED (folding) + 6.2" cover', processor: 'Snapdragon 8 Gen 2', camera: '50MP Main + 12MP Ultra Wide + 10MP 3x Telephoto', storage: '256GB', battery: '4400mAh', features: 'Flex Mode, Multi-window' }},
    { name: 'Google Pixel 8 Pro', brand: 'Google', price: 999, specs: { display: '6.7" LTPO OLED (2992x1344) 120Hz', processor: 'Google Tensor G3', camera: '50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto', storage: '128GB', battery: '5050mAh', features: 'AI photo editing, 7 years of updates' }},
    { name: 'Google Pixel 8', brand: 'Google', price: 699, specs: { display: '6.2" OLED (2400x1080) 120Hz', processor: 'Google Tensor G3', camera: '50MP Main + 12MP Ultra Wide', storage: '128GB', battery: '4575mAh', features: 'Magic Eraser, Best Take, 7 years updates' }},
    { name: 'OnePlus 12', brand: 'OnePlus', price: 799, specs: { display: '6.82" LTPO AMOLED (3168x1440) 120Hz', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main + 64MP 3x Periscope + 48MP Ultra Wide', storage: '256GB', battery: '5400mAh, 100W charging', features: 'Hasselblad camera tuning' }},
    { name: 'OnePlus Open', brand: 'OnePlus', price: 1699, specs: { display: '7.82" LTPO AMOLED (folding) + 6.31" cover', processor: 'Snapdragon 8 Gen 2', camera: '48MP Main + 64MP 3x Periscope + 48MP Ultra Wide', storage: '512GB', battery: '4805mAh, 67W charging', features: 'Hasselblad cameras, Open Canvas' }},
    { name: 'Sony Xperia 1 V', brand: 'Sony', price: 1399, specs: { display: '6.5" 4K HDR OLED (3840x1644) 120Hz', processor: 'Snapdragon 8 Gen 2', camera: '52MP Main + 12MP Ultra Wide + 12MP 3.5-5.2x Telephoto', storage: '256GB', battery: '5000mAh', features: 'Real-time Eye AF, S-Cinetone' }},
    { name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', price: 1299, specs: { display: '6.73" LTPO AMOLED (3200x1440) 120Hz', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main + 50MP Ultra Wide + 50MP 3.2x + 50MP 5x', storage: '512GB', battery: '5000mAh, 90W charging', features: 'Leica Summilux lenses, 1" sensor' }},
    { name: 'Nothing Phone (2)', brand: 'Nothing', price: 599, specs: { display: '6.7" LTPO OLED (2412x1080) 120Hz', processor: 'Snapdragon 8+ Gen 1', camera: '50MP Main + 50MP Ultra Wide', storage: '128GB', battery: '4700mAh, 45W charging', features: 'Glyph Interface with 33 LED zones' }},
    { name: 'ASUS ROG Phone 8 Pro', brand: 'ASUS', price: 1199, specs: { display: '6.78" LTPO AMOLED (2400x1080) 165Hz', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main + 13MP Ultra Wide + 32MP 3x Telephoto', storage: '512GB', battery: '5500mAh, 65W charging', features: 'AirTriggers, X Mode gaming' }},
    { name: 'Motorola Edge+ (2023)', brand: 'Motorola', price: 799, specs: { display: '6.7" pOLED (2400x1080) 165Hz', processor: 'Snapdragon 8 Gen 2', camera: '50MP Main + 50MP Ultra Wide + 12MP 2x Telephoto', storage: '512GB', battery: '5100mAh, 68W TurboPower', features: 'Ready For desktop mode' }},
    { name: 'OPPO Find X7 Ultra', brand: 'OPPO', price: 1199, specs: { display: '6.82" LTPO AMOLED (3168x1440) 120Hz', processor: 'Snapdragon 8 Gen 3', camera: '50MP Main + 50MP Ultra Wide + 50MP 3x + 50MP 6x', storage: '256GB', battery: '5000mAh, 100W charging', features: 'Hasselblad cameras, dual periscope' }},
    { name: 'Huawei Pura 70 Ultra', brand: 'Huawei', price: 1299, specs: { display: '6.8" LTPO OLED (2844x1260) 120Hz', processor: 'Kirin 9010', camera: '50MP 1" Main + 40MP Ultra Wide + 50MP 3.5x Macro Telephoto', storage: '512GB', battery: '5200mAh, 100W charging', features: 'Retractable lens, XMAGE imaging' }},
    { name: 'Google Pixel Fold', brand: 'Google', price: 1799, specs: { display: '7.6" OLED (2208x1840) + 5.8" cover (2092x1080)', processor: 'Google Tensor G2', camera: '48MP Main + 10.8MP Ultra Wide + 10.8MP 5x Telephoto', storage: '256GB', battery: '4821mAh', features: 'Tabletop mode, Real Tone' }},
    { name: 'Samsung Galaxy A54 5G', brand: 'Samsung', price: 449, specs: { display: '6.4" Super AMOLED (2340x1080) 120Hz', processor: 'Exynos 1380', camera: '50MP Main + 12MP Ultra Wide + 5MP Macro', storage: '128GB', battery: '5000mAh', features: 'IP67, 4 years OS updates' }},
    { name: 'iPhone SE (3rd Gen)', brand: 'Apple', price: 429, specs: { display: '4.7" Retina HD LCD (1334x750)', processor: 'A15 Bionic chip', camera: '12MP Main with Deep Fusion', storage: '64GB', battery: 'Up to 15hr video playback', features: 'Touch ID, 5G' }},
  ],
  headphones: [
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 399, specs: { driver: '30mm', frequency: '4Hz-40kHz', anc: 'Adaptive ANC with 8 microphones', battery: '30 hours (ANC on)', connectivity: 'Bluetooth 5.2, LDAC, multipoint', weight: '250g' }},
    { name: 'Sony WF-1000XM5', brand: 'Sony', price: 299, specs: { driver: '8.4mm Dynamic', frequency: '20Hz-40kHz', anc: 'Integrated Processor V2', battery: '8hrs (24hrs with case)', connectivity: 'Bluetooth 5.3, LDAC, LE Audio', weight: '5.9g per earbud' }},
    { name: 'Apple AirPods Max', brand: 'Apple', price: 549, specs: { driver: '40mm Apple-designed', frequency: '20Hz-20kHz', anc: 'Active Noise Cancellation with Transparency', battery: '20 hours', connectivity: 'Bluetooth 5.0, H1 chip', weight: '384.8g' }},
    { name: 'Apple AirPods Pro (2nd Gen)', brand: 'Apple', price: 249, specs: { driver: 'Apple-designed H2 chip', frequency: '20Hz-20kHz', anc: 'Adaptive Transparency, Conversation Awareness', battery: '6hrs (30hrs with case)', connectivity: 'Bluetooth 5.3', weight: '5.3g per earbud' }},
    { name: 'Bose QuietComfort Ultra Headphones', brand: 'Bose', price: 429, specs: { driver: 'Proprietary Bose', frequency: '20Hz-20kHz', anc: 'CustomTune ANC', battery: '24 hours', connectivity: 'Bluetooth 5.3, Snapdragon Sound', weight: '250g' }},
    { name: 'Bose QuietComfort Ultra Earbuds', brand: 'Bose', price: 299, specs: { driver: '9.3mm', frequency: '20Hz-20kHz', anc: 'CustomTune ANC', battery: '6hrs (24hrs with case)', connectivity: 'Bluetooth 5.3', weight: '6.24g per earbud' }},
    { name: 'Sennheiser Momentum 4 Wireless', brand: 'Sennheiser', price: 379, specs: { driver: '42mm', frequency: '6Hz-22kHz', anc: 'Adaptive Noise Cancellation', battery: '60 hours', connectivity: 'Bluetooth 5.2, aptX Adaptive', weight: '293g' }},
    { name: 'Sennheiser HD 660S2', brand: 'Sennheiser', price: 599, specs: { driver: '38mm', frequency: '8Hz-41.5kHz', impedance: '300 ohms', type: 'Open-back audiophile', connectivity: 'Wired (6.35mm & 4.4mm)', weight: '260g' }},
    { name: 'Audio-Technica ATH-M50xBT2', brand: 'Audio-Technica', price: 199, specs: { driver: '45mm', frequency: '15Hz-28kHz', type: 'Closed-back studio', battery: '50 hours', connectivity: 'Bluetooth 5.0, LDAC', weight: '307g' }},
    { name: 'Beyerdynamic DT 900 Pro X', brand: 'Beyerdynamic', price: 299, specs: { driver: '45mm STELLAR.45', frequency: '5Hz-40kHz', impedance: '48 ohms', type: 'Open-back studio', connectivity: 'Wired with Mini-XLR', weight: '345g' }},
    { name: 'JBL Tour One M2', brand: 'JBL', price: 349, specs: { driver: '40mm', frequency: '10Hz-40kHz', anc: 'True Adaptive ANC', battery: '50 hours', connectivity: 'Bluetooth 5.3, LE Audio', weight: '268g' }},
    { name: 'Bang & Olufsen Beoplay H95', brand: 'Bang & Olufsen', price: 899, specs: { driver: '40mm titanium', frequency: '20Hz-22kHz', anc: 'Adaptive ANC with 4 mics', battery: '38 hours', connectivity: 'Bluetooth 5.1, aptX Adaptive', weight: '323g' }},
    { name: 'Jabra Elite 85t', brand: 'Jabra', price: 229, specs: { driver: '12mm', frequency: '20Hz-20kHz', anc: 'Advanced ANC with HearThrough', battery: '5.5hrs (25hrs with case)', connectivity: 'Bluetooth 5.1', weight: '7g per earbud' }},
    { name: 'Samsung Galaxy Buds2 Pro', brand: 'Samsung', price: 229, specs: { driver: '10mm woofer + 5.3mm tweeter', frequency: '20Hz-20kHz', anc: 'Intelligent ANC', battery: '5hrs (18hrs with case)', connectivity: 'Bluetooth 5.3, 360 Audio', weight: '5.5g per earbud' }},
    { name: 'Shure AONIC 50 Gen 2', brand: 'Shure', price: 349, specs: { driver: '50mm', frequency: '20Hz-22kHz', anc: 'Adjustable ANC', battery: '45 hours', connectivity: 'Bluetooth 5.0, LDAC, aptX HD', weight: '334g' }},
    { name: 'Focal Bathys', brand: 'Focal', price: 699, specs: { driver: '40mm aluminum/magnesium', frequency: '15Hz-22kHz', anc: 'Active Noise Cancellation', battery: '30 hours (35 passive)', connectivity: 'Bluetooth 5.1, aptX Adaptive', weight: '350g' }},
    { name: 'Beats Studio Pro', brand: 'Beats', price: 349, specs: { driver: '40mm', frequency: '20Hz-20kHz', anc: 'Active Noise Cancelling', battery: '40 hours', connectivity: 'Bluetooth 5.3, USB-C audio', weight: '260g' }},
    { name: 'Master & Dynamic MW75', brand: 'Master & Dynamic', price: 599, specs: { driver: '40mm beryllium', frequency: '5Hz-44kHz', anc: 'Adaptive ANC', battery: '32 hours', connectivity: 'Bluetooth 5.1, aptX Adaptive', weight: '330g' }},
    { name: 'Denon PerL Pro', brand: 'Denon', price: 349, specs: { driver: '10mm', frequency: '20Hz-40kHz', anc: 'Adaptive Noise Cancelling', battery: '8hrs (32hrs with case)', connectivity: 'Bluetooth 5.3, Dirac Virtuo', weight: '8g per earbud' }},
    { name: 'Technics EAH-A800', brand: 'Technics', price: 349, specs: { driver: '40mm', frequency: '4Hz-40kHz', anc: 'Dual Hybrid ANC', battery: '50 hours', connectivity: 'Bluetooth 5.2, LDAC, multipoint', weight: '298g' }},
  ],
  cameras: [
    { name: 'Canon EOS R5', brand: 'Canon', price: 3899, specs: { sensor: '45MP Full-Frame CMOS', iso: '100-51200 (exp. 50-102400)', video: '8K RAW, 4K 120fps', autofocus: 'Dual Pixel CMOS AF II, 1053 zones', stabilization: '8-stop IBIS', screen: '3.2" 2.1M-dot vari-angle touch' }},
    { name: 'Canon EOS R6 Mark II', brand: 'Canon', price: 2499, specs: { sensor: '24.2MP Full-Frame CMOS', iso: '100-102400 (exp. 204800)', video: '4K 60fps, 6K oversampled', autofocus: 'Dual Pixel CMOS AF II, 4897 zones', stabilization: '8-stop IBIS', screen: '3" 1.62M-dot vari-angle' }},
    { name: 'Sony Alpha 7R V', brand: 'Sony', price: 3899, specs: { sensor: '61MP Full-Frame Exmor R BSI', iso: '100-32000 (exp. 50-102400)', video: '8K 24fps, 4K 60fps', autofocus: 'AI-based Real-time Recognition AF', stabilization: '8-stop IBIS', screen: '3.2" 2.1M-dot 4-axis tilting' }},
    { name: 'Sony Alpha 7 IV', brand: 'Sony', price: 2499, specs: { sensor: '33MP Full-Frame Exmor R BSI', iso: '100-51200 (exp. 50-204800)', video: '4K 60fps 10-bit', autofocus: '759-point phase-detect', stabilization: '5.5-stop IBIS', screen: '3" 1.04M-dot vari-angle' }},
    { name: 'Sony Alpha 1', brand: 'Sony', price: 6499, specs: { sensor: '50.1MP Full-Frame Stacked CMOS', iso: '100-32000 (exp. 50-102400)', video: '8K 30fps, 4K 120fps', autofocus: '759 phase-detect, 30fps', stabilization: '5.5-stop IBIS', screen: '3" 1.44M-dot touch' }},
    { name: 'Nikon Z8', brand: 'Nikon', price: 3999, specs: { sensor: '45.7MP Full-Frame Stacked CMOS', iso: '64-25600 (exp. 32-102400)', video: '8K 30fps, 4K 120fps', autofocus: '493 points, 3D tracking', stabilization: '6-stop IBIS', screen: '3.2" 2.1M-dot tilting touch' }},
    { name: 'Nikon Z6 III', brand: 'Nikon', price: 2499, specs: { sensor: '24.5MP Full-Frame Stacked CMOS', iso: '100-64000 (exp. 204800)', video: '6K 60fps, 4K 120fps', autofocus: '299 phase-detect points', stabilization: '8-stop IBIS', screen: '3.2" 2.1M-dot vari-angle' }},
    { name: 'Fujifilm X-T5', brand: 'Fujifilm', price: 1699, specs: { sensor: '40.2MP APS-C X-Trans CMOS 5 HR', iso: '125-12800 (exp. 64-51200)', video: '6.2K 30fps, 4K 60fps', autofocus: '425 points phase-detect', stabilization: '7-stop IBIS', screen: '3" 1.84M-dot 3-way tilting' }},
    { name: 'Fujifilm X100VI', brand: 'Fujifilm', price: 1599, specs: { sensor: '40.2MP APS-C X-Trans CMOS 5 HR', iso: '125-12800 (exp. 64-51200)', video: '6.2K 30fps', lens: '23mm f/2 (35mm equiv)', stabilization: '6-stop IBIS', screen: '3" 1.62M-dot tilting LCD' }},
    { name: 'Panasonic Lumix S5 IIX', brand: 'Panasonic', price: 2199, specs: { sensor: '24.2MP Full-Frame CMOS', iso: '100-51200 (exp. 204800)', video: '6K 30fps, 4K 60fps, ProRes', autofocus: '779 phase-detect points', stabilization: '6.5-stop IBIS', screen: '3" 1.84M-dot vari-angle' }},
    { name: 'Leica Q3', brand: 'Leica', price: 5995, specs: { sensor: '60.3MP Full-Frame BSI CMOS', iso: '50-100000', video: '8K 30fps, 4K 60fps', lens: '28mm f/1.7 Summilux', stabilization: 'Optical IS', screen: '3" 1.84M-dot tilting touch' }},
    { name: 'Leica M11-P', brand: 'Leica', price: 9195, specs: { sensor: '60MP Full-Frame BSI CMOS', iso: '64-50000', type: 'Digital Rangefinder', mount: 'Leica M-mount', features: 'Content Authenticity Initiative', screen: '2.95" 2.3M-dot touch' }},
    { name: 'GoPro HERO12 Black', brand: 'GoPro', price: 399, specs: { sensor: '1/1.9" CMOS', video: '5.3K 60fps, 4K 120fps', stabilization: 'HyperSmooth 6.0', waterproof: '33ft (10m) without housing', battery: '1720mAh', features: 'HDR Video, GP-Log' }},
    { name: 'DJI Osmo Action 4', brand: 'DJI', price: 399, specs: { sensor: '1/1.3" CMOS', video: '4K 120fps, 4K HDR', stabilization: 'RockSteady 3.0+ & HorizonSteady', waterproof: '60ft (18m) without housing', battery: '1770mAh', features: '360° HorizonSteady' }},
    { name: 'DJI Pocket 3', brand: 'DJI', price: 519, specs: { sensor: '1" CMOS', video: '4K 120fps, 10-bit D-Log M', stabilization: '3-axis mechanical gimbal', screen: '2" rotatable OLED touchscreen', battery: '166 minutes', features: 'Full-pixel fast focus, 2" screen' }},
    { name: 'Hasselblad X2D 100C', brand: 'Hasselblad', price: 8199, specs: { sensor: '100MP Medium Format BSI CMOS', iso: '64-25600', autofocus: 'Phase-detect AF', stabilization: '7-stop IBIS', shutter: '90-min long exposure', screen: '3.6" 2.36M-dot tilting' }},
    { name: 'Phase One XT', brand: 'Phase One', price: 52000, specs: { sensor: '150MP Full-Frame Medium Format', iso: '50-12800', type: 'Technical field camera', movements: 'Tilt/shift/rise/fall', mount: 'Rodenstock HR lenses', features: 'Capture One tethering' }},
    { name: 'OM System OM-1 Mark II', brand: 'OM System', price: 2199, specs: { sensor: '20.4MP Micro Four Thirds Stacked', iso: '200-102400', video: '4K 120fps', autofocus: '1053 cross-type points', stabilization: '8.5-stop IBIS', screen: '3" 1.62M-dot vari-angle' }},
    { name: 'Blackmagic Pocket Cinema Camera 6K Pro', brand: 'Blackmagic', price: 2495, specs: { sensor: '6K Super 35', iso: 'Dual ISO 400/3200', video: '6K 50fps, 4K 120fps', recording: 'Blackmagic RAW, ProRes', mount: 'EF mount', screen: '5" HDR touchscreen' }},
    { name: 'RED Komodo-X 6K', brand: 'RED', price: 9995, specs: { sensor: '19.9MP Super 35 Global Shutter', iso: '250-16000', video: '6K 80fps, 4K 120fps', recording: 'REDCODE RAW', mount: 'RF mount', features: 'Global shutter, compact body' }},
  ],
  monitors: [
    { name: 'LG UltraGear 27GR95QE-B', brand: 'LG', price: 999, specs: { size: '27"', resolution: '2560x1440 QHD', panel: 'OLED', refresh: '240Hz', response: '0.03ms GtG', hdr: 'DisplayHDR True Black 400', features: 'Anti-Glare Low Reflection' }},
    { name: 'LG UltraFine 32UQ85R-W', brand: 'LG', price: 799, specs: { size: '32"', resolution: '3840x2160 4K', panel: 'Nano IPS Black', refresh: '60Hz', response: '5ms GtG', hdr: 'VESA DisplayHDR 400', features: 'USB-C 96W PD, DCI-P3 98%' }},
    { name: 'Samsung Odyssey OLED G9 G95SC', brand: 'Samsung', price: 1799, specs: { size: '49" (32:9 Super Ultrawide)', resolution: '5120x1440 DQHD', panel: 'QD-OLED', refresh: '240Hz', response: '0.03ms', hdr: 'DisplayHDR True Black 400', features: 'Samsung Gaming Hub, 1800R curve' }},
    { name: 'Samsung ViewFinity S9 S90PC', brand: 'Samsung', price: 1299, specs: { size: '27"', resolution: '5120x2880 5K', panel: 'IPS', refresh: '60Hz', response: '5ms', hdr: 'DisplayHDR 600', features: 'Matte display, 4K SlimFit Camera, Thunderbolt 4' }},
    { name: 'Dell UltraSharp U3224KB', brand: 'Dell', price: 3199, specs: { size: '32"', resolution: '6144x3456 6K', panel: 'IPS Black', refresh: '60Hz', response: '5ms', hdr: 'DisplayHDR 600', features: '6K resolution, Thunderbolt 4 hub, 4K webcam' }},
    { name: 'Dell Alienware AW3423DWF', brand: 'Dell', price: 1099, specs: { size: '34" (21:9 Ultrawide)', resolution: '3440x1440 WQHD', panel: 'QD-OLED', refresh: '165Hz', response: '0.1ms', hdr: 'DisplayHDR True Black 400', features: 'AMD FreeSync Premium Pro, 1800R curve' }},
    { name: 'ASUS ProArt PA32UCG-K', brand: 'ASUS', price: 4999, specs: { size: '32"', resolution: '3840x2160 4K', panel: 'Mini LED IPS', refresh: '120Hz', response: '5ms', hdr: 'DisplayHDR 1400', features: '1152 local dimming zones, Dolby Vision, hardware calibration' }},
    { name: 'ASUS ROG Swift OLED PG27AQDM', brand: 'ASUS', price: 999, specs: { size: '27"', resolution: '2560x1440 QHD', panel: 'OLED', refresh: '240Hz', response: '0.03ms GtG', hdr: 'DisplayHDR True Black 400', features: 'G-SYNC Compatible, custom heatsink' }},
    { name: 'BenQ PD3225U', brand: 'BenQ', price: 1199, specs: { size: '32"', resolution: '3840x2160 4K', panel: 'IPS', refresh: '60Hz', response: '5ms', hdr: 'VESA DisplayHDR 400', features: 'Thunderbolt 3, AQCOLOR calibrated, Hotkey Puck G3' }},
    { name: 'BenQ MOBIUZ EX3210U', brand: 'BenQ', price: 799, specs: { size: '32"', resolution: '3840x2160 4K', panel: 'IPS', refresh: '144Hz', response: '1ms MPRT', hdr: 'DisplayHDR 600', features: 'treVolo speakers, FreeSync Premium Pro' }},
    { name: 'ViewSonic VP3481a', brand: 'ViewSonic', price: 799, specs: { size: '34" (21:9 Ultrawide)', resolution: '3440x1440 WQHD', panel: 'VA', refresh: '100Hz', response: '5ms', curve: '1800R', features: 'Delta E<2 factory calibrated, USB-C 90W PD' }},
    { name: 'Acer Predator X27U', brand: 'Acer', price: 1099, specs: { size: '27"', resolution: '2560x1440 QHD', panel: 'OLED', refresh: '240Hz', response: '0.03ms', hdr: 'DisplayHDR True Black 400', features: 'G-SYNC Compatible, AgileVision' }},
    { name: 'MSI MEG 342C QD-OLED', brand: 'MSI', price: 1199, specs: { size: '34" (21:9 Ultrawide)', resolution: '3440x1440 WQHD', panel: 'QD-OLED', refresh: '175Hz', response: '0.03ms', hdr: 'DisplayHDR True Black 400', features: 'G-SYNC Compatible, 1800R curve' }},
    { name: 'HP Z27k G3 4K USB-C Display', brand: 'HP', price: 649, specs: { size: '27"', resolution: '3840x2160 4K', panel: 'IPS', refresh: '60Hz', response: '5ms', color: 'sRGB 99%, DCI-P3 98%', features: 'USB-C 100W PD, daisy chain, factory calibrated' }},
    { name: 'Gigabyte M32U', brand: 'Gigabyte', price: 699, specs: { size: '32"', resolution: '3840x2160 4K', panel: 'IPS', refresh: '144Hz', response: '1ms MPRT', hdr: 'VESA DisplayHDR 400', features: 'KVM switch, FreeSync Premium Pro' }},
    { name: 'AOC AGON PRO AG274QZM', brand: 'AOC', price: 999, specs: { size: '27"', resolution: '2560x1440 QHD', panel: 'Mini LED IPS', refresh: '240Hz', response: '1ms GtG', hdr: 'DisplayHDR 1000', features: '576 local dimming zones, G-SYNC Compatible' }},
    { name: 'Corsair Xeneon 32QHD165', brand: 'Corsair', price: 699, specs: { size: '32"', resolution: '2560x1440 QHD', panel: 'IPS', refresh: '165Hz', response: '1ms', hdr: 'DisplayHDR 400', features: 'iCUE integration, USB-C 65W, KVM' }},
    { name: 'Apple Studio Display', brand: 'Apple', price: 1599, specs: { size: '27"', resolution: '5120x2880 5K', panel: 'IPS', refresh: '60Hz', brightness: '600 nits', color: 'P3 wide color gamut', features: '12MP Ultra Wide camera, 6-speaker system, A13 Bionic' }},
    { name: 'Apple Pro Display XDR', brand: 'Apple', price: 4999, specs: { size: '32"', resolution: '6016x3384 6K', panel: 'IPS with 576 LED zones', brightness: '1600 nits peak, 1000 sustained', hdr: 'Extreme Dynamic Range', color: 'P3 wide color gamut', features: 'Reference modes, nano-texture glass option' }},
    { name: 'Eizo ColorEdge CG2700S', brand: 'Eizo', price: 2499, specs: { size: '27"', resolution: '2560x1440 QHD', panel: 'IPS', refresh: '60Hz', color: 'Adobe RGB 99%, DCI-P3 98%', features: 'Built-in calibration sensor, 10-bit, 24/7 operation' }},
  ],
};

// Real unique review owners with review dates
const reviewOwners = [
  { name: 'Marcus Chen', date: '2025-01-15' },
  { name: 'Sarah Mitchell', date: '2025-01-12' },
  { name: 'David Park', date: '2025-01-08' },
  { name: 'Emily Rodriguez', date: '2025-01-05' },
  { name: 'James Wilson', date: '2024-12-28' },
  { name: 'Olivia Thompson', date: '2024-12-22' },
  { name: 'Michael Brown', date: '2024-12-18' },
  { name: 'Jessica Lee', date: '2024-12-15' },
  { name: 'Christopher Davis', date: '2024-12-10' },
  { name: 'Amanda Garcia', date: '2024-12-05' },
  { name: 'Daniel Martinez', date: '2024-11-30' },
  { name: 'Rachel Kim', date: '2024-11-25' },
  { name: 'Andrew Johnson', date: '2024-11-20' },
  { name: 'Lauren White', date: '2024-11-15' },
  { name: 'Kevin Taylor', date: '2024-11-10' },
  { name: 'Stephanie Anderson', date: '2024-11-05' },
  { name: 'Brandon Moore', date: '2024-10-30' },
  { name: 'Megan Jackson', date: '2024-10-25' },
  { name: 'Tyler Harris', date: '2024-10-20' },
  { name: 'Nicole Clark', date: '2024-10-15' },
  { name: 'Ryan Lewis', date: '2024-10-10' },
  { name: 'Ashley Walker', date: '2024-10-05' },
  { name: 'Justin Hall', date: '2024-09-30' },
  { name: 'Samantha Young', date: '2024-09-25' },
  { name: 'Matthew Allen', date: '2024-09-20' },
  { name: 'Rebecca King', date: '2024-09-15' },
  { name: 'Jonathan Wright', date: '2024-09-10' },
  { name: 'Victoria Scott', date: '2024-09-05' },
  { name: 'Nicholas Green', date: '2024-08-30' },
  { name: 'Christina Baker', date: '2024-08-25' },
  { name: 'Robert Adams', date: '2024-08-20' },
  { name: 'Jennifer Nelson', date: '2024-08-15' },
  { name: 'William Hill', date: '2024-08-10' },
  { name: 'Elizabeth Rivera', date: '2024-08-05' },
  { name: 'Alexander Campbell', date: '2024-07-30' },
  { name: 'Catherine Mitchell', date: '2024-07-25' },
  { name: 'Benjamin Roberts', date: '2024-07-20' },
  { name: 'Hannah Turner', date: '2024-07-15' },
  { name: 'Samuel Phillips', date: '2024-07-10' },
  { name: 'Natalie Evans', date: '2024-07-05' },
  { name: 'Joseph Collins', date: '2024-06-30' },
  { name: 'Grace Stewart', date: '2024-06-25' },
  { name: 'Patrick Sanchez', date: '2024-06-20' },
  { name: 'Abigail Morris', date: '2024-06-15' },
  { name: 'Ethan Rogers', date: '2024-06-10' },
  { name: 'Madison Reed', date: '2024-06-05' },
  { name: 'Thomas Cook', date: '2024-05-30' },
  { name: 'Kayla Morgan', date: '2024-05-25' },
  { name: 'Brian Bell', date: '2024-05-20' },
  { name: 'Alexis Murphy', date: '2024-05-15' },
  { name: 'Nathan Bailey', date: '2024-05-10' },
  { name: 'Julia Rivera', date: '2024-05-05' },
  { name: 'Aaron Cooper', date: '2024-04-30' },
  { name: 'Vanessa Richardson', date: '2024-04-25' },
  { name: 'Sean Cox', date: '2024-04-20' },
  { name: 'Morgan Howard', date: '2024-04-15' },
  { name: 'Derek Ward', date: '2024-04-10' },
  { name: 'Brittany Torres', date: '2024-04-05' },
  { name: 'Jeremy Peterson', date: '2024-03-30' },
  { name: 'Lindsey Gray', date: '2024-03-25' },
  { name: 'Travis Ramirez', date: '2024-03-20' },
  { name: 'Chelsea James', date: '2024-03-15' },
  { name: 'Kyle Watson', date: '2024-03-10' },
  { name: 'Diana Brooks', date: '2024-03-05' },
  { name: 'Eric Kelly', date: '2024-02-28' },
  { name: 'Monica Sanders', date: '2024-02-23' },
  { name: 'Corey Price', date: '2024-02-18' },
  { name: 'Melissa Bennett', date: '2024-02-13' },
  { name: 'Dustin Wood', date: '2024-02-08' },
  { name: 'Amy Barnes', date: '2024-02-03' },
  { name: 'Jordan Ross', date: '2024-01-29' },
  { name: 'Heather Henderson', date: '2024-01-24' },
  { name: 'Blake Coleman', date: '2024-01-19' },
  { name: 'Kristen Jenkins', date: '2024-01-14' },
  { name: 'Cody Perry', date: '2024-01-09' },
  { name: 'Courtney Powell', date: '2024-01-04' },
  { name: 'Jared Long', date: '2023-12-30' },
  { name: 'Danielle Patterson', date: '2023-12-25' },
  { name: 'Ian Hughes', date: '2023-12-20' },
  { name: 'Kimberly Flores', date: '2023-12-15' },
  { name: 'Trevor Washington', date: '2023-12-10' },
  { name: 'Andrea Butler', date: '2023-12-05' },
  { name: 'Lucas Simmons', date: '2023-11-30' },
  { name: 'Brooke Foster', date: '2023-11-25' },
  { name: 'Shane Gonzales', date: '2023-11-20' },
  { name: 'Tiffany Bryant', date: '2023-11-15' },
  { name: 'Garrett Alexander', date: '2023-11-10' },
  { name: 'Jasmine Russell', date: '2023-11-05' },
  { name: 'Mitchell Griffin', date: '2023-10-30' },
  { name: 'Paige Diaz', date: '2023-10-25' },
  { name: 'Wesley Hayes', date: '2023-10-20' },
  { name: 'Amber Myers', date: '2023-10-15' },
  { name: 'Caleb Ford', date: '2023-10-10' },
  { name: 'Erica Hamilton', date: '2023-10-05' },
  { name: 'Dakota Graham', date: '2023-09-30' },
  { name: 'Taylor Sullivan', date: '2023-09-25' },
  { name: 'Chase Wallace', date: '2023-09-20' },
  { name: 'Destiny Woods', date: '2023-09-15' },
  { name: 'Spencer West', date: '2023-09-10' },
  { name: 'Haley Cole', date: '2023-09-05' },
  { name: 'Carson Jordan', date: '2023-08-30' },
  { name: 'Shelby Owens', date: '2023-08-25' },
  { name: 'Preston Reynolds', date: '2023-08-20' },
  { name: 'Savannah Fisher', date: '2023-08-15' },
  { name: 'Grant Ellis', date: '2023-08-10' },
  { name: 'Hayley Harrison', date: '2023-08-05' },
  { name: 'Clayton Gibson', date: '2023-07-30' },
  { name: 'Faith McDonald', date: '2023-07-25' },
  { name: 'Omar Cruz', date: '2023-07-20' },
  { name: 'Gabrielle Marshall', date: '2023-07-15' },
  { name: 'Xavier Ortiz', date: '2023-07-10' },
  { name: 'Jade Gomez', date: '2023-07-05' },
  { name: 'Roman Murray', date: '2023-06-30' },
  { name: 'Chloe Freeman', date: '2023-06-25' },
  { name: 'Maxwell Wells', date: '2023-06-20' },
  { name: 'Skylar Webb', date: '2023-06-15' },
  { name: 'Cameron Simpson', date: '2023-06-10' },
  { name: 'Allison Stevens', date: '2023-06-05' },
  { name: 'Dominic Tucker', date: '2023-05-30' },
  { name: 'Kennedy Porter', date: '2023-05-25' },
  { name: 'Adrian Hunter', date: '2023-05-20' },
  { name: 'Sierra Hicks', date: '2023-05-15' },
  { name: 'Colin Crawford', date: '2023-05-10' },
  { name: 'Bailey Boyd', date: '2023-05-05' },
  { name: 'Andre Mason', date: '2023-04-30' },
  { name: 'Leah Dixon', date: '2023-04-25' },
  { name: 'Felix Hunt', date: '2023-04-20' },
  { name: 'Aubrey Dunn', date: '2023-04-15' },
  { name: 'Ivan Carr', date: '2023-04-10' },
  { name: 'Kylie Stephens', date: '2023-04-05' },
  { name: 'Hugo Fernandez', date: '2023-03-30' },
  { name: 'Molly Garza', date: '2023-03-25' },
  { name: 'Wyatt Harvey', date: '2023-03-20' },
  { name: 'Zoe Lynch', date: '2023-03-15' },
  { name: 'Leo Webb', date: '2023-03-10' },
  { name: 'Gianna Burns', date: '2023-03-05' },
  { name: 'Oscar Stone', date: '2023-02-28' },
  { name: 'Arianna Kelley', date: '2023-02-23' },
  { name: 'Vincent Soto', date: '2023-02-18' },
  { name: 'Ellie Mendoza', date: '2023-02-13' },
  { name: 'Marco Ruiz', date: '2023-02-08' },
  { name: 'Claire Medina', date: '2023-02-03' },
  { name: 'Nolan Aguilar', date: '2023-01-29' },
  { name: 'Makayla Reyes', date: '2023-01-24' },
  { name: 'Tristan Shaw', date: '2023-01-19' },
  { name: 'Briana Herrera', date: '2023-01-14' },
  { name: 'Ezra Newman', date: '2023-01-09' },
  { name: 'Jocelyn Walsh', date: '2023-01-04' },
  { name: 'Miles Chapman', date: '2022-12-30' },
  { name: 'Naomi Snyder', date: '2022-12-25' },
  { name: 'Owen Lloyd', date: '2022-12-20' },
  { name: 'Summer Parks', date: '2022-12-15' },
  { name: 'Asher Carpenter', date: '2022-12-10' },
  { name: 'Willow Bates', date: '2022-12-05' },
  { name: 'Micah Greene', date: '2022-11-30' },
  { name: 'Peyton Jensen', date: '2022-11-25' },
  { name: 'Carter Nichols', date: '2022-11-20' },
  { name: 'Reagan Vargas', date: '2022-11-15' },
  { name: 'Eli Patel', date: '2022-11-10' },
  { name: 'Brooke Sharma', date: '2022-11-05' },
  { name: 'Finn Grant', date: '2022-10-30' },
  { name: 'Scarlett Lane', date: '2022-10-25' },
  { name: 'Axel Ray', date: '2022-10-20' },
  { name: 'Luna Dawson', date: '2022-10-15' },
  { name: 'Emmett Powers', date: '2022-10-10' },
  { name: 'Stella Malone', date: '2022-10-05' },
  { name: 'Aiden Wheeler', date: '2022-09-30' },
  { name: 'Aurora Francis', date: '2022-09-25' },
  { name: 'Colton Andrews', date: '2022-09-20' },
  { name: 'Isla Dean', date: '2022-09-15' },
  { name: 'Ryker Moss', date: '2022-09-10' },
  { name: 'Layla Jimenez', date: '2022-09-05' },
  { name: 'Sawyer Howell', date: '2022-08-30' },
  { name: 'Nora Lambert', date: '2022-08-25' },
  { name: 'Everett Knight', date: '2022-08-20' },
  { name: 'Maya Kim', date: '2022-08-15' },
  { name: 'Hudson Welch', date: '2022-08-10' },
  { name: 'Violet Bishop', date: '2022-08-05' },
  { name: 'Jasper Burton', date: '2022-07-30' },
  { name: 'Ivy Hansen', date: '2022-07-25' },
  { name: 'Ryder Carroll', date: '2022-07-20' },
  { name: 'Eliana Lawson', date: '2022-07-15' },
  { name: 'Beckett Casey', date: '2022-07-10' },
  { name: 'Piper Franklin', date: '2022-07-05' },
  { name: 'Maddox Chambers', date: '2022-06-30' },
  { name: 'Emery Ramos', date: '2022-06-25' },
  { name: 'Harrison Schultz', date: '2022-06-20' },
  { name: 'Adalyn McIntyre', date: '2022-06-15' },
  { name: 'Brooks Goodwin', date: '2022-06-10' },
  { name: 'Vivian Le', date: '2022-06-05' },
];

// Unsplash image IDs for each category
const imageIds = {
  laptops: [
    '1496181133206-80ce9b88a853', '1525547719851-df4c4c21e37d', '1517336714731-489689fd1ca8', '1504707748692-419802cf939d', '1498050108023-c5249f4df085',
    '1531297484001-80022131f5a1', '1593062096033-9a26b09da705', '1588872657578-7efd1f1555ed', '1541807084-5c52b6b92ae2', '1484788984921-03950022c9ef',
    '1611186871348-b1ce696e52c9', '1515378791036-0648a3ef77b2', '1460925895917-afdab827c52f', '1499951360447-b19be8fe80f5', '1516387938699-a93567ec168e',
    '1587614382346-4ec70e388b28', '1603302576837-37561b2e2302', '1544244015-0df4b3ffc6b0', '1629131726692-1accd0c53ce0', '1496181133206-80ce9b88a853'
  ],
  smartphones: [
    '1511707171634-5f897ff02aa9', '1510557880182-3d4d3cba35a5', '1592750475338-74b7b21085ab', '1565849904461-04a58ad377e0', '1574944985070-8f3ebc6b79d2',
    '1605236453806-6ff36851218e', '1512941937669-90a1b58e7e9c', '1591337676887-a217a6970a8a', '1580910051074-3eb694886f2e', '1601784551446-20c9e07cdbdb',
    '1585060544812-6b45742d762f', '1598327105666-5b89351aff97', '1533228100845-08145b01de14', '1523206489230-c012c64b2b48', '1556656793-08538906a9f8',
    '1609692814858-f7cd2f0afa4f', '1567581935884-3349723552ca', '1570891836654-d4961a7b6929', '1604076913837-52ab5629fba9', '1611532736597-de2d4265fba3'
  ],
  headphones: [
    '1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1484704849700-f032a568e944', '1546435770-a3e426bf472b', '1524678606370-a47ad25cb82a',
    '1487215078519-e21cc028cb29', '1558756520-22cfe5d382ca', '1545127398-14699f92334b', '1572536147248-ac59a8abfa4b', '1599669454699-248893623440',
    '1493225457124-a3eb161ffa5f', '1520170350707-b2da59970118', '1577174881658-0f30ed549adc', '1570993492881-25240ce854f4', '1613040809024-b4ef7ba99bc3',
    '1606220588913-b3aacb4d2f46', '1614149162883-504ce4d13909', '1618366712010-f4ae9c647dcb', '1608043152269-423dbba4e7e1', '1590658268037-6bf12165a8df'
  ],
  cameras: [
    '1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd', '1510127034890-ba27508e9f1c', '1495745966610-2a67f2297e5e', '1581591524425-c7e0978cca2e',
    '1617005082133-548c4dd27f35', '1452780212940-6f5c0d14d848', '1500634245200-e5245c7574ef', '1512790182412-b19e6d62bc39', '1560518883-ce09059eeffa',
    '1606986628492-c01a5686d9b4', '1519638399535-1b036603ac77', '1609952542840-df54cfddc3fb', '1510784722466-f2aa9c52fff6', '1516724562728-afc824a36e84',
    '1471341971476-ae15ff5dd4ea', '1473091534298-04dcbce3278c', '1542567455-cd733f23fbb1', '1502982720700-bfff97f2ecac', '1607462109225-6b64ae2dd3cb'
  ],
  monitors: [
    '1527443224154-c4a3942d3acf', '1585792180666-f7347c490ee2', '1593640408182-31c70c8268f5', '1616763355548-1b11f1a73290', '1558618666-fcd25c85cd64',
    '1498049794561-7780e7231661', '1586210579191-33b45e38fa2c', '1609619385002-f40f1df827b7', '1547658719-da2b51169166', '1621259182978-fbf93132d53d',
    '1559163499-413811fb2344', '1567603532449-e2b5c0f01943', '1612815154929-0dc2e8e8bdc5', '1550751827-4bd374c3f58b', '1618172193763-c511deb635ca',
    '1563089145-599997674d42', '1603481588273-2f908a9a7a1b', '1541877944-ac82a091518a', '1625842268584-8f3e34f6f2e4', '1615573588078-23c3fb3c8a39'
  ]
};

// Generate Products with real data
function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  let productIndex = 0;

  const categories = [
    { key: 'laptops' as const, type: 'Laptop', subcategory: 'Laptops' },
    { key: 'smartphones' as const, type: 'Smartphone', subcategory: 'Smartphones' },
    { key: 'headphones' as const, type: 'Headphones', subcategory: 'Headphones' },
    { key: 'cameras' as const, type: 'Camera', subcategory: 'Cameras' },
    { key: 'monitors' as const, type: 'Monitor', subcategory: 'Monitors' },
  ];

  for (const category of categories) {
    const realProductList = realProducts[category.key];
    const categoryImageIds = imageIds[category.key];

    for (let i = 0; i < realProductList.length; i++) {
      productIndex++;
      const realProduct = realProductList[i];

      const hasDiscount = Math.random() > 0.7;
      const compareAtPrice = hasDiscount ? Math.round(realProduct.price * randomFloat(1.1, 1.25)) : undefined;

      const productId = `prod_${String(productIndex).padStart(4, '0')}`;

      const imageId = categoryImageIds[i % categoryImageIds.length];
      const imageUrl = `https://images.unsplash.com/photo-${imageId}?w=800&h=600&fit=crop&auto=format`;
      const images = Array(4).fill(0).map((_, idx) => {
        const altImageId = categoryImageIds[(i + idx + 1) % categoryImageIds.length];
        return `https://images.unsplash.com/photo-${altImageId}?w=800&h=600&fit=crop&auto=format`;
      });

      // Build features from real specs
      const features = Object.entries(realProduct.specs).slice(0, 6).map(([key, value]) => `${key}: ${value}`);

      const product: Product = {
        id: productId,
        sku: `SKU-${realProduct.brand.substring(0, 3).toUpperCase()}-${randomInt(10000, 99999)}`,
        title: realProduct.name,
        description: generateRealProductDescription(realProduct.name, realProduct.brand, category.type, realProduct.specs),
        longDescription: generateRealLongDescription(realProduct.name, realProduct.brand, category.type, realProduct.specs),
        category: 'Electronics',
        subcategory: category.subcategory,
        brand: realProduct.brand,
        price: realProduct.price,
        compareAtPrice,
        inStock: Math.random() > 0.1,
        stockQuantity: randomInt(5, 200),
        imageUrl,
        images,
        rating: randomFloat(4.0, 4.9, 1),
        reviewCount: 2,
        features,
        specifications: realProduct.specs as Record<string, string>,
        tags: [category.type.toLowerCase(), realProduct.brand.toLowerCase(), 'electronics', 'tech', ...realProduct.name.toLowerCase().split(' ').slice(0, 3)],
        weight: category.type === 'Laptop' ? `${randomFloat(2.5, 6, 2)} lbs` :
                category.type === 'Smartphone' ? `${randomFloat(0.3, 0.5, 2)} lbs` :
                category.type === 'Headphones' ? `${randomFloat(0.4, 0.9, 2)} lbs` :
                category.type === 'Camera' ? `${randomFloat(1, 4, 2)} lbs` :
                `${randomFloat(8, 25, 1)} lbs`,
        dimensions: category.type === 'Monitor' ? `${randomInt(24, 50)}"W x ${randomInt(15, 30)}"H x ${randomInt(2, 8)}"D` :
                    `${randomInt(5, 15)}"L x ${randomInt(3, 12)}"W x ${randomInt(1, 6)}"H`,
        colors: getRandomElements(['Black', 'Silver', 'Space Gray', 'White', 'Midnight', 'Starlight'], randomInt(1, 3)),
        warranty: getRandomElement(['1-year manufacturer warranty', '2-year extended warranty', '3-year comprehensive warranty']),
        createdAt: generatePastDate(365),
        updatedAt: generatePastDate(30)
      };

      products.push(product);
    }
  }

  return products;
}

// Generate real product description based on actual specs
function generateRealProductDescription(name: string, brand: string, type: string, specs: any): string {
  const specHighlights = Object.entries(specs).slice(0, 3).map(([k, v]) => `${v}`).join(', ');

  const descriptions: Record<string, string> = {
    'Laptop': `The ${name} delivers exceptional performance with ${specHighlights}. Engineered by ${brand} for professionals and creators who demand the best in portable computing.`,
    'Smartphone': `Experience the ${name} featuring ${specHighlights}. ${brand}'s latest flagship combines cutting-edge technology with stunning design for the ultimate mobile experience.`,
    'Headphones': `Immerse yourself in superior audio with the ${name}. Featuring ${specHighlights}, these ${brand} headphones deliver studio-quality sound wherever you go.`,
    'Camera': `Capture stunning imagery with the ${name}. With ${specHighlights}, this ${brand} camera empowers photographers and videographers to achieve their creative vision.`,
    'Monitor': `Transform your workspace with the ${name}. Featuring ${specHighlights}, this ${brand} display delivers exceptional visual clarity for work and play.`,
  };

  return descriptions[type] || `The ${name} by ${brand} offers premium quality and performance.`;
}

function generateProductDescription(type: string, brand: string, adjective: string): string {
  const descriptions: Record<string, string[]> = {
    'Laptop': [
      `The ${brand} ${adjective} Laptop delivers exceptional performance for work and play. Featuring a stunning display, powerful processor, and all-day battery life, this laptop is designed for professionals and creators who demand the best.`,
      `Experience premium computing with the ${brand} ${adjective} Laptop. Built with cutting-edge technology and a sleek design, it offers the perfect balance of power, portability, and style for modern professionals.`,
      `Unleash your productivity with the ${brand} ${adjective} Laptop. With lightning-fast performance, crystal-clear graphics, and a comfortable keyboard, it's the ultimate tool for getting things done anywhere.`,
    ],
    'Smartphone': [
      `The ${brand} ${adjective} Smartphone redefines mobile excellence. With an advanced camera system, brilliant display, and powerful chip, capture life's moments and stay connected like never before.`,
      `Meet the ${brand} ${adjective} Smartphone - where innovation meets elegance. Experience stunning photography, seamless performance, and all-day battery life in a beautifully crafted device.`,
      `Elevate your mobile experience with the ${brand} ${adjective} Smartphone. Featuring pro-level cameras, a gorgeous display, and 5G connectivity for the fastest speeds.`,
    ],
    'Headphones': [
      `Immerse yourself in pure audio bliss with ${brand} ${adjective} Headphones. Industry-leading noise cancellation, exceptional sound quality, and supreme comfort for endless listening.`,
      `The ${brand} ${adjective} Headphones deliver studio-quality sound wherever you go. With advanced active noise cancellation and long battery life, your music never sounded better.`,
      `Experience audio perfection with ${brand} ${adjective} Headphones. Precision-engineered drivers, adaptive sound, and a comfortable fit for the ultimate listening experience.`,
    ],
    'Camera': [
      `Capture stunning images with the ${brand} ${adjective} Camera. Professional-grade features, exceptional low-light performance, and intuitive controls help you create masterpieces.`,
      `The ${brand} ${adjective} Camera empowers your creative vision. With advanced autofocus, high-resolution sensor, and 4K video, bring your stories to life with cinematic quality.`,
      `Unleash your creativity with the ${brand} ${adjective} Camera. Whether shooting photos or video, this versatile camera delivers outstanding results in any situation.`,
    ],
    'Monitor': [
      `Transform your workspace with the ${brand} ${adjective} Monitor. Stunning visuals, accurate colors, and ergonomic design make every task a pleasure.`,
      `The ${brand} ${adjective} Monitor delivers an immersive viewing experience. With high refresh rates, vibrant colors, and eye-care technology, it's perfect for work and gaming.`,
      `Elevate your visual experience with the ${brand} ${adjective} Monitor. Crystal-clear resolution, wide color gamut, and sleek design for professionals and enthusiasts.`,
    ],
  };

  return getRandomElement(descriptions[type] || descriptions['Laptop']);
}

// Generate detailed long description with real specs
function generateRealLongDescription(name: string, brand: string, type: string, specs: any): string {
  const specsList = Object.entries(specs).map(([key, value]) => `- **${key}:** ${value}`).join('\n');

  return `
# ${name}

Introducing the ${name} - ${brand}'s premium ${type.toLowerCase()} engineered for excellence.

## Key Specifications
${specsList}

## Why Choose the ${name}?

**Exceptional Performance**
The ${name} delivers outstanding performance for demanding tasks. Whether you're working, creating, or enjoying entertainment, experience smooth and responsive operation powered by industry-leading technology.

**Premium Build Quality**
Crafted with premium materials and meticulous attention to detail, the ${name} combines beauty with functionality. ${brand}'s commitment to quality is evident in every aspect of the design.

**Advanced Features**
Packed with innovative features that enhance your experience. From intuitive controls to smart connectivity options, everything is designed with the user in mind.

**What's in the Box**
- ${name}
- Power adapter and charging cables
- Quick start guide
- Warranty documentation

Experience the ${brand} difference today with the ${name}.
  `.trim();
}

function generateLongProductDescription(type: string, brand: string, adjective: string): string {
  return `
Introducing the ${brand} ${adjective} ${type} - a premium device engineered for excellence.

**Exceptional Performance**
Built with the latest technology, this ${type.toLowerCase()} delivers outstanding performance for demanding tasks. Whether you're working, creating, or enjoying entertainment, experience smooth and responsive operation.

**Premium Design**
Crafted with premium materials and meticulous attention to detail, the ${brand} ${adjective} ${type} combines beauty with functionality. Its sleek profile and refined finish make a statement wherever you go.

**Advanced Features**
Packed with innovative features that enhance your experience. From intuitive controls to smart connectivity options, everything is designed with you in mind.

**Built to Last**
Quality construction and rigorous testing ensure reliability you can count on. Backed by ${brand}'s commitment to excellence and comprehensive warranty coverage.

**What's in the Box**
- ${brand} ${adjective} ${type}
- Power adapter and cables
- Quick start guide
- Warranty documentation

Experience the ${brand} difference today.
  `.trim();
}

function generateProductSpecs(type: string, brand: string): Record<string, string> {
  const baseSpecs: Record<string, string> = {
    'Brand': brand,
    'Model Number': `${brand.substring(0, 2).toUpperCase()}-${randomInt(1000, 9999)}`,
    'Warranty': getRandomElement(['1 Year', '2 Years', '3 Years']),
  };

  const typeSpecs: Record<string, Record<string, string>> = {
    'Laptop': {
      'Processor': getRandomElement(['Intel Core i7', 'Intel Core i9', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M3', 'Apple M3 Pro']),
      'RAM': getRandomElement(['8GB', '16GB', '32GB', '64GB']),
      'Storage': getRandomElement(['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']),
      'Display': getRandomElement(['13.3" FHD', '14" QHD', '15.6" FHD', '16" 4K', '17" QHD']),
      'Graphics': getRandomElement(['Integrated', 'NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'NVIDIA RTX 4080', 'AMD Radeon']),
      'Battery': getRandomElement(['8 hours', '10 hours', '12 hours', '15 hours', '20 hours']),
    },
    'Smartphone': {
      'Display': getRandomElement(['6.1" OLED', '6.5" AMOLED', '6.7" Super Retina', '6.8" Dynamic AMOLED']),
      'Processor': getRandomElement(['A17 Pro', 'Snapdragon 8 Gen 3', 'Exynos 2400', 'Tensor G3', 'Dimensity 9300']),
      'Storage': getRandomElement(['128GB', '256GB', '512GB', '1TB']),
      'Camera': getRandomElement(['48MP Triple', '50MP Quad', '200MP Main', '108MP Triple']),
      'Battery': getRandomElement(['4000mAh', '4500mAh', '5000mAh', '5500mAh']),
      'OS': getRandomElement(['iOS 17', 'Android 14', 'Android 15']),
    },
    'Headphones': {
      'Driver Size': getRandomElement(['30mm', '40mm', '50mm', '53mm']),
      'Frequency Response': getRandomElement(['20Hz-20kHz', '4Hz-40kHz', '10Hz-40kHz']),
      'Battery Life': getRandomElement(['20 hours', '30 hours', '40 hours', '60 hours']),
      'Connectivity': getRandomElement(['Bluetooth 5.0', 'Bluetooth 5.2', 'Bluetooth 5.3']),
      'Noise Cancellation': getRandomElement(['Active (ANC)', 'Adaptive ANC', 'Hybrid ANC']),
      'Weight': getRandomElement(['250g', '280g', '320g', '350g']),
    },
    'Camera': {
      'Sensor': getRandomElement(['24.2MP APS-C', '33MP APS-C', '45MP Full-Frame', '61MP Full-Frame', '102MP Medium Format']),
      'ISO Range': getRandomElement(['100-51200', '100-102400', '64-25600', '50-204800']),
      'Video': getRandomElement(['4K 30fps', '4K 60fps', '4K 120fps', '8K 30fps']),
      'Autofocus': getRandomElement(['Hybrid AF', 'Phase Detection', 'Dual Pixel AF', 'AI Autofocus']),
      'Stabilization': getRandomElement(['5-axis IBIS', 'Optical IS', 'Dual IS', 'SteadyShot']),
      'Screen': getRandomElement(['3" LCD', '3.2" Touchscreen', '3" Tilt Screen', '3.2" Vari-angle']),
    },
    'Monitor': {
      'Screen Size': getRandomElement(['24"', '27"', '32"', '34" Ultrawide', '38" Curved', '49" Super Ultrawide']),
      'Resolution': getRandomElement(['1920x1080 FHD', '2560x1440 QHD', '3840x2160 4K', '5120x1440 DQHD']),
      'Refresh Rate': getRandomElement(['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz']),
      'Panel Type': getRandomElement(['IPS', 'VA', 'OLED', 'Mini LED']),
      'Response Time': getRandomElement(['1ms', '4ms', '5ms', '0.1ms OLED']),
      'HDR': getRandomElement(['HDR10', 'HDR400', 'HDR600', 'HDR1000', 'DisplayHDR True Black']),
    },
  };

  return { ...baseSpecs, ...typeSpecs[type] };
}

function getWarranty(): string {
  return getRandomElement([
    '1-year limited warranty',
    '2-year manufacturer warranty',
    '3-year extended warranty',
  ]);
}

function generatePastDate(maxDaysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(1, maxDaysAgo));
  return date.toISOString();
}

// Generate Reviews
// Generate unique product-specific reviews (1 positive, 1 negative per product)
function generateReviews(products: Product[]): Review[] {
  const reviews: Review[] = [];
  let reviewId = 1;
  let ownerIndex = 0;

  products.forEach((product, productIndex) => {
    // Get unique owners for this product's reviews
    const positiveOwner = reviewOwners[ownerIndex % reviewOwners.length];
    const negativeOwner = reviewOwners[(ownerIndex + 1) % reviewOwners.length];
    ownerIndex += 2;

    // Generate positive review (rating 4-5)
    const positiveRating = Math.random() > 0.5 ? 5 : 4;
    const positiveReview = generateUniquePositiveReview(product, productIndex);

    reviews.push({
      id: `rev_${String(reviewId++).padStart(4, '0')}`,
      productId: product.id,
      userId: `user_${randomInt(1000, 9999)}`,
      userName: positiveOwner.name,
      rating: positiveRating,
      title: positiveReview.title,
      text: positiveReview.text,
      helpful: randomInt(5, 85),
      verified: true,
      createdAt: new Date(positiveOwner.date).toISOString(),
      updatedAt: new Date(positiveOwner.date).toISOString()
    });

    // Generate negative review (rating 1-2)
    const negativeRating = Math.random() > 0.5 ? 2 : 1;
    const negativeReview = generateUniqueNegativeReview(product, productIndex);

    reviews.push({
      id: `rev_${String(reviewId++).padStart(4, '0')}`,
      productId: product.id,
      userId: `user_${randomInt(1000, 9999)}`,
      userName: negativeOwner.name,
      rating: negativeRating,
      title: negativeReview.title,
      text: negativeReview.text,
      helpful: randomInt(2, 45),
      verified: Math.random() > 0.3,
      createdAt: new Date(negativeOwner.date).toISOString(),
      updatedAt: new Date(negativeOwner.date).toISOString()
    });

    product.reviewCount = 2;
  });

  return reviews;
}

// Generate unique positive review mentioning product name and specs
function generateUniquePositiveReview(product: Product, index: number): { title: string; text: string } {
  const specs = Object.entries(product.specifications).slice(0, 2);
  const specMention = specs.length > 0 ? specs.map(([k, v]) => v).join(' and ') : 'features';

  const positiveTitles = [
    `Excellent ${product.title}!`,
    `${product.brand} delivers again with the ${product.title}`,
    `Thrilled with my ${product.title}`,
    `${product.title} exceeds expectations`,
    `Best purchase - ${product.title}`,
    `${product.title} is a game-changer`,
    `Highly recommend the ${product.title}`,
    `${product.title} - Worth every dollar`,
    `Amazing ${product.title} from ${product.brand}`,
    `Five stars for ${product.title}`,
  ];

  const positiveTemplates = [
    `After weeks of research, I purchased the ${product.title} and couldn't be happier. The ${specMention} is exactly what I needed. ${product.brand} really outdid themselves with this one. Build quality is exceptional and performance is rock solid.`,
    `The ${product.title} has exceeded all my expectations. As someone who uses ${product.subcategory.toLowerCase()} daily, I can confidently say this is the best I've owned. The ${specMention} makes a real difference in day-to-day use.`,
    `I've been using the ${product.title} for about a month now and it's fantastic. The ${specMention} works flawlessly. ${product.brand} quality is evident from the moment you unbox it. Highly recommend!`,
    `Upgraded to the ${product.title} from an older model and the difference is night and day. The ${specMention} is impressive. Worth the investment if you want premium quality from ${product.brand}.`,
    `The ${product.title} is exactly what I was looking for. Great ${specMention}, excellent build quality, and ${product.brand}'s attention to detail shows. Perfect for both work and personal use.`,
    `Purchased the ${product.title} after reading many positive reviews and I agree with all of them. The ${specMention} performs beautifully. This ${product.brand} product is a keeper.`,
    `I'm impressed with the ${product.title}. The ${specMention} is top-notch and the overall experience has been smooth. ${product.brand} really knows what they're doing.`,
    `Five stars for the ${product.title}! The ${specMention} works great and the product feels premium. Very happy with this ${product.brand} purchase.`,
    `The ${product.title} is a solid choice. Love the ${specMention} and the ${product.brand} ecosystem integration. Everything just works seamlessly together.`,
    `Amazing ${product.title} from ${product.brand}! The ${specMention} is excellent and the product has been reliable since day one. Would buy again.`,
  ];

  return {
    title: positiveTitles[index % positiveTitles.length],
    text: positiveTemplates[index % positiveTemplates.length]
  };
}

// Generate unique negative review mentioning product name and specific issues
function generateUniqueNegativeReview(product: Product, index: number): { title: string; text: string } {
  const specs = Object.entries(product.specifications).slice(0, 1);
  const specMention = specs.length > 0 ? specs[0][1] : 'main feature';

  const negativeTitles = [
    `Disappointed with ${product.title}`,
    `${product.title} has issues`,
    `Expected more from ${product.brand}`,
    `${product.title} not worth the price`,
    `Problems with my ${product.title}`,
    `${product.title} fell short`,
    `Returning my ${product.title}`,
    `${product.brand} ${product.title} letdown`,
    `${product.title} quality concerns`,
    `Would not recommend ${product.title}`,
  ];

  const negativeTemplates = [
    `I had high hopes for the ${product.title} but it fell short. The ${specMention} isn't as good as ${product.brand} advertises. For the price of $${product.price}, I expected much better quality and performance.`,
    `Disappointed with my ${product.title} purchase. Within the first week, I noticed issues with the ${specMention}. ${product.brand}'s quality control seems to have slipped. Considering a return.`,
    `The ${product.title} looks nice but doesn't perform well. The ${specMention} is underwhelming compared to competitors at this price point. ${product.brand} needs to do better.`,
    `Bought the ${product.title} based on reviews but my experience has been poor. The ${specMention} doesn't work as expected and customer support was unhelpful. Not impressed with ${product.brand}.`,
    `Returned my ${product.title} after two weeks. The ${specMention} was inconsistent and I had multiple issues. For $${product.price}, this ${product.brand} product should be flawless.`,
    `The ${product.title} is overpriced for what you get. The ${specMention} is decent but not $${product.price} decent. ${product.brand} is riding on brand name alone here.`,
    `Had issues with the ${product.title} from day one. The ${specMention} didn't meet specifications. Disappointed in ${product.brand}'s quality on this product.`,
    `The ${product.title} seemed great at first but problems emerged quickly. The ${specMention} degrades over time. Not what I expected from ${product.brand} at this price.`,
    `Regret buying the ${product.title}. The ${specMention} is mediocre and ${product.brand} support was no help. There are better options for less money.`,
    `Would not recommend the ${product.title}. For a ${product.brand} product costing $${product.price}, the ${specMention} should be much better. Going back to my old device.`,
  ];

  return {
    title: negativeTitles[index % negativeTitles.length],
    text: negativeTemplates[index % negativeTemplates.length]
  };
}

// Generate Policies
function generatePolicies(count: number): Policy[] {
  const policies: Policy[] = [];

  const policyTemplates = [
    {
      category: 'shipping' as const,
      title: 'Standard Shipping Policy',
      description: 'Our comprehensive shipping policy covers delivery times, shipping methods, international orders, and tracking information to ensure your purchases arrive safely and on time.',
      content: `**Shipping Methods and Delivery Times**

We offer multiple shipping options to meet your needs, including standard ground shipping (5-7 business days), expedited shipping (2-3 business days), and overnight delivery for urgent orders. All orders are processed within 24-48 hours of placement, excluding weekends and holidays. You will receive a confirmation email with tracking information once your order ships.

**Domestic Shipping**

For orders within the continental United States, we offer free standard shipping on all orders over $50. Orders under $50 incur a flat shipping fee of $5.99. Expedited shipping is available for an additional fee of $12.99, and overnight shipping costs $24.99. We ship to all 50 states, including Alaska and Hawaii, though delivery times may vary for these locations.

**International Shipping**

We proudly ship to over 100 countries worldwide. International shipping rates are calculated based on destination, package weight, and selected shipping method. Customers are responsible for any customs duties, taxes, or fees imposed by their country. International orders typically arrive within 7-21 business days depending on location and customs processing times.

**Order Tracking**

All shipments include tracking information sent via email. You can monitor your package's progress through our website or the carrier's tracking portal. If you experience any issues with tracking or delivery, our customer service team is available to assist you promptly.

**Damaged or Lost Packages**

In the rare event that your package arrives damaged or is lost in transit, please contact us within 48 hours of delivery (or expected delivery date for lost packages). We will work with you to file a claim with the carrier and arrange for a replacement or refund as appropriate. All shipments are insured for their full value.`
    },
    {
      category: 'returns' as const,
      title: 'Return and Exchange Policy',
      description: 'Easy returns and exchanges within 30 days of purchase. We want you to be completely satisfied with your order and offer a hassle-free return process for your convenience.',
      content: `**Return Period and Eligibility**

We accept returns within 30 days of the original purchase date. To be eligible for a return, items must be unused, in their original condition, and in the original packaging with all tags attached. Certain items including personalized products, intimate apparel, and sale items marked as final sale are not eligible for return.

**Return Process**

To initiate a return, log into your account and navigate to your order history. Select the items you wish to return and choose your reason for the return. You will receive a prepaid return shipping label via email within 24 hours. Package your items securely and drop off the package at any authorized shipping location. We recommend obtaining a receipt with tracking information for your records.

**Refunds and Processing**

Once we receive your returned items, our quality assurance team will inspect them to ensure they meet our return criteria. This process typically takes 2-3 business days. Approved returns will be refunded to your original payment method within 5-7 business days. You will receive an email confirmation once your refund has been processed. Please note that original shipping charges are non-refundable except in cases where we made an error or the item arrived defective.

**Exchanges**

If you would like to exchange an item for a different size, color, or model, you can indicate this when initiating your return. We will ship your replacement item as soon as we receive your return. If there is a price difference, we will either charge you for the additional amount or issue a partial refund. Exchange shipping is free for all domestic orders.

**Defective or Damaged Items**

If you receive a defective or damaged item, please contact us immediately with photos of the damage. We will arrange for a free return shipping label and send a replacement at no charge, or issue a full refund including original shipping costs if you prefer. Your satisfaction is our priority.`
    },
    {
      category: 'privacy' as const,
      title: 'Privacy Policy',
      description: 'We are committed to protecting your privacy and personal information. This policy explains how we collect, use, store, and safeguard your data in compliance with all applicable regulations.',
      content: `**Information We Collect**

We collect information that you provide directly to us, including your name, email address, shipping address, billing address, phone number, and payment information when you create an account or make a purchase. We also automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, pages visited, time spent on pages, and referring website addresses.

**How We Use Your Information**

We use the information we collect to process and fulfill your orders, communicate with you about your purchases, respond to your customer service inquiries, send you marketing communications (with your consent), improve our website and services, prevent fraud and enhance security, and comply with legal obligations. We do not sell your personal information to third parties under any circumstances.

**Data Security and Protection**

We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. All payment information is encrypted using SSL technology and processed through PCI-compliant payment processors. We regularly update our security practices and conduct security audits to ensure your data remains protected.

**Third-Party Services**

We work with trusted third-party service providers who assist us with payment processing, shipping, email delivery, and analytics. These partners are contractually obligated to keep your information confidential and use it only for the specific services they provide to us. We carefully vet all third-party partners to ensure they meet our privacy and security standards.

**Your Rights and Choices**

You have the right to access, correct, or delete your personal information at any time by logging into your account or contacting our privacy team. You can opt out of marketing emails by clicking the unsubscribe link in any promotional message. You can also disable cookies in your browser settings, though this may affect your ability to use certain features of our website. We will honor your preferences and respond to all privacy requests within 30 days.

**Updates to This Policy**

We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the effective date. Your continued use of our services after such changes constitutes acceptance of the updated policy.`
    },
    {
      category: 'terms' as const,
      title: 'Terms and Conditions',
      description: 'These terms govern your use of our website and services. Please read them carefully before making a purchase or creating an account.',
      content: `**Acceptance of Terms**

By accessing and using this website, you accept and agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our website or services. These terms apply to all visitors, users, and customers of our website and services.

**Account Registration and Security**

To make purchases or access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update this information as needed. Notify us immediately of any unauthorized use of your account or any other security breach.

**Product Information and Pricing**

We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions, images, pricing, or other content on our website is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice. Prices are subject to change without notice, though price changes will not affect orders that have already been placed.

**Order Acceptance and Cancellation**

All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent or unauthorized transactions. If your order is cancelled after your payment has been processed, we will issue a full refund to your original payment method.

**Intellectual Property Rights**

All content on this website, including text, graphics, logos, images, videos, and software, is our property or the property of our licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise use our content without our express written permission.

**Limitation of Liability**

To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of our website or services. Our total liability shall not exceed the amount you paid for the specific product or service giving rise to the claim.

**Governing Law and Dispute Resolution**

These terms shall be governed by and construed in accordance with the laws of the state in which our business is registered, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in accordance with the commercial arbitration rules, except that you may assert claims in small claims court if they qualify.`
    },
    {
      category: 'warranty' as const,
      title: 'Product Warranty Policy',
      description: 'We stand behind the quality of our products with comprehensive warranty coverage. Learn about warranty terms, coverage details, and how to make a warranty claim.',
      content: `**Warranty Coverage**

All products purchased from us are covered by a manufacturer's warranty that protects against defects in materials and workmanship under normal use. Warranty periods vary by product and manufacturer, typically ranging from 90 days to lifetime coverage. The specific warranty period for your product is listed on the product page and included with your purchase documentation.

**What Is Covered**

The warranty covers defects in materials and workmanship that occur under normal use during the warranty period. This includes component failures, manufacturing defects, and malfunctions not caused by misuse, abuse, or normal wear and tear. If a covered defect occurs, we will repair or replace the product at our discretion, or issue a refund if repair or replacement is not feasible.

**What Is Not Covered**

The warranty does not cover damage caused by accidents, misuse, abuse, improper installation, unauthorized modifications or repairs, normal wear and tear, acts of nature, or failure to follow care and maintenance instructions. Cosmetic damage such as scratches, dents, or discoloration that does not affect functionality is also not covered. Products purchased from unauthorized resellers may not be eligible for warranty coverage.

**Making a Warranty Claim**

To file a warranty claim, contact our customer service team with your order number, product information, and a description of the issue. You may be asked to provide photos or videos demonstrating the defect. If your claim is approved, we will provide instructions for returning the product (if necessary) and will cover return shipping costs for warranty-related returns. Most warranty claims are processed within 7-10 business days of receiving the returned product.

**Extended Warranty Options**

For many products, we offer optional extended warranty plans that provide additional coverage beyond the standard manufacturer's warranty. Extended warranties may include accidental damage protection, expedited replacement, and extended coverage periods. Details about extended warranty options are available on individual product pages or by contacting our sales team.

**Manufacturer Support**

Some products may be covered by the manufacturer's warranty rather than our store warranty. In these cases, warranty service is provided directly by the manufacturer. We will assist you in contacting the appropriate manufacturer and navigating their warranty process to ensure you receive the support you need.`
    },
    {
      category: 'payment' as const,
      title: 'Payment Policy',
      description: 'Our secure payment policy outlines accepted payment methods, billing procedures, security measures, and payment-related terms to ensure safe and convenient transactions.',
      content: `**Accepted Payment Methods**

We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also accept payments through PayPal, Apple Pay, Google Pay, and Amazon Pay for your convenience. For business customers, we offer net-30 terms upon approval. All prices are listed in US dollars unless otherwise specified, and payment is required at the time of order placement.

**Payment Security**

We take payment security very seriously and employ industry-standard encryption and security measures to protect your financial information. All payment transactions are processed through PCI-DSS compliant payment processors, and we never store your complete credit card information on our servers. Our website uses 256-bit SSL encryption to ensure your payment data is transmitted securely.

**Billing and Charges**

Your payment method will be charged when your order is processed, typically within 24 hours of order placement. For pre-order items, you will be charged when the item ships, not when you place the order. If you are charged for an item that is subsequently found to be out of stock or unavailable, we will issue a full refund within 5-7 business days.

**Payment Verification**

To prevent fraud and protect our customers, we may need to verify payment information for certain orders. This may include contacting you directly, requesting additional documentation, or using address verification services. Orders requiring verification may experience a delay in processing. We appreciate your patience and cooperation in maintaining a secure shopping environment.

**Billing Disputes and Chargebacks**

If you notice an unauthorized charge or have concerns about a transaction, please contact our customer service team immediately before initiating a chargeback with your bank or card issuer. We are committed to resolving billing issues quickly and fairly. Initiating a chargeback without first attempting to resolve the issue with us may result in suspension of your account and could affect your ability to place future orders.

**Currency and International Payments**

International customers should note that their bank or credit card company may charge foreign transaction fees or currency conversion fees. These fees are determined by your financial institution and are not charged by us. Final charges may vary slightly from the amount shown at checkout due to currency exchange rate fluctuations and bank fees.

**Tax Collection**

We are required to collect sales tax on orders shipped to certain states and jurisdictions based on applicable tax laws. The tax amount will be calculated and displayed during checkout before you complete your purchase. Tax rates and requirements are subject to change based on current legislation and regulations.`
    }
  ];

  for (let i = 0; i < count; i++) {
    const template = policyTemplates[i % policyTemplates.length];
    const versionNum = randomFloat(1.0, 3.9, 1);

    const policy: Policy = {
      id: `pol_${String(i + 1).padStart(4, '0')}`,
      title: template.title,
      description: template.description,
      content: template.content,
      category: template.category,
      version: `${versionNum}.0`,
      effectiveDate: generatePastDate(365),
      lastUpdated: generatePastDate(30),
      isActive: Math.random() > 0.1 // 90% active
    };

    policies.push(policy);
  }

  return policies;
}

// Generate Coupons
function generateCoupons(count: number): Coupon[] {
  const coupons: Coupon[] = [];

  const couponPrefixes = ['SAVE', 'DEAL', 'SPECIAL', 'WELCOME', 'VIP', 'FLASH', 'SUPER', 'MEGA', 'EXTRA', 'BONUS'];
  const couponSuffixes = ['2026', 'NOW', 'TODAY', 'PLUS', 'MAX', 'BEST', 'PRIME', 'ELITE'];

  for (let i = 0; i < count; i++) {
    const type = getRandomElement(['percentage', 'fixed', 'free-shipping', 'buy-one-get-one'] as const);
    const prefix = getRandomElement(couponPrefixes);
    const suffix = getRandomElement(couponSuffixes);
    const code = `${prefix}${randomInt(10, 99)}${suffix}`;

    let value: number;
    let title: string;
    let description: string;

    switch (type) {
      case 'percentage':
        value = getRandomElement([10, 15, 20, 25, 30, 40, 50]);
        title = `${value}% Off Your Purchase`;
        description = `Enjoy an exceptional ${value}% discount on your entire order with this exclusive coupon code. This limited-time offer applies to all eligible products in our extensive catalog, allowing you to save significantly on premium quality items. Whether you're shopping for essentials or treating yourself to something special, this generous discount helps you get more value from every purchase. Simply enter the code at checkout to see your savings instantly applied. Don't miss this opportunity to shop smart and save big on the products you love. Valid for a limited time only, so take advantage of these incredible savings while you can. Share with friends and family so they can enjoy the savings too!`;
        break;
      case 'fixed':
        value = getRandomElement([5, 10, 15, 20, 25, 50, 75, 100]);
        title = `$${value} Off Your Order`;
        description = `Save a substantial $${value} on your purchase with this valuable coupon code designed to make quality products more affordable. This straightforward discount is automatically applied to your order total when you enter the code at checkout, providing immediate savings that you can see in real-time. Perfect for customers looking to maximize their budget while still enjoying premium products and exceptional service. Whether you're making a small purchase or stocking up on multiple items, every dollar saved makes a difference. This offer represents our commitment to providing outstanding value to our loyal customers. Take advantage of this special promotion and discover how much you can save on your next order. Terms and conditions apply, and minimum purchase requirements may be necessary.`;
        break;
      case 'free-shipping':
        value = 0;
        title = 'Free Shipping on Your Order';
        description = `Eliminate shipping costs entirely with this fantastic free shipping coupon code that delivers exceptional value on every order. Shipping fees can add up quickly, especially for larger or heavier items, but with this exclusive offer you can enjoy complimentary delivery right to your doorstep without any additional charges. This promotion makes online shopping more convenient and economical than ever before, allowing you to focus on finding the perfect products without worrying about extra costs. Whether you're ordering a single item or filling your cart with multiple purchases, shipping is completely free when you apply this code at checkout. We've partnered with reliable shipping carriers to ensure your packages arrive safely and on time. This is an excellent opportunity to save on shipping while enjoying our full product selection and exceptional customer service.`;
        break;
      case 'buy-one-get-one':
        value = 50;
        title = 'Buy One Get One 50% Off';
        description = `Take advantage of our incredible buy-one-get-one offer where you receive 50% off your second item, making it easier than ever to stock up on favorites or try new products at a fantastic value. This promotion is perfect for purchasing gifts, building your collection, or simply getting more of what you love at an unbeatable price. The discount automatically applies to the lower-priced item in your cart, ensuring you always get the maximum savings possible. Mix and match from eligible products to create the perfect combination that suits your needs and preferences. This offer encourages you to explore our diverse product range while enjoying significant savings on quality items. Whether you're shopping for yourself or planning ahead for upcoming occasions, this buy-one-get-one deal provides exceptional value that's hard to resist. Share this offer with friends so they can benefit from these amazing savings as well.`;
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - randomInt(1, 30));

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomInt(7, 90));

    const usageLimit = randomInt(50, 1000);
    const usageCount = randomInt(0, Math.floor(usageLimit * 0.7));

    const coupon: Coupon = {
      id: `cpn_${String(i + 1).padStart(4, '0')}`,
      code,
      title,
      description,
      type,
      value,
      minPurchase: type !== 'free-shipping' ? randomFloat(25, 100) : undefined,
      maxDiscount: type === 'percentage' ? randomFloat(50, 200) : undefined,
      usageLimit,
      usageCount,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: endDate > new Date() && usageCount < usageLimit,
      categories: Math.random() > 0.5 ? getRandomElements(categories.map(c => c.name), randomInt(1, 3)) : undefined,
      excludedProducts: Math.random() > 0.8 ? [`prod_${String(randomInt(1, 100)).padStart(4, '0')}`] : undefined,
      createdAt: startDate.toISOString(),
      updatedAt: generatePastDate(15)
    };

    coupons.push(coupon);
  }

  return coupons;
}

// Generate Support Tickets
function generateTickets(count: number): Ticket[] {
  const tickets: Ticket[] = [];

  const subjects = [
    'Order not received',
    'Item damaged during shipping',
    'Wrong item delivered',
    'Missing parts/accessories',
    'Product not working as expected',
    'Request for return/refund',
    'Tracking information not updating',
    'Payment not processed',
    'Discount code not working',
    'Account login issues',
    'Unable to place order',
    'Product quality concerns',
    'Size/fit issues',
    'Color different from photo',
    'Shipping delay inquiry',
    'Warranty claim',
    'Installation help needed',
    'Product compatibility question',
    'Bulk order inquiry',
    'International shipping question'
  ];

  const descriptions = [
    'I placed an order over a week ago and still haven\'t received it. The tracking shows it was delivered but I never got the package. Can you please help me locate it or send a replacement?',
    'The product arrived damaged. The box was in good condition but the item inside has visible scratches and dents. I would like to return it for a refund or exchange.',
    'I ordered the blue version but received the red one instead. I need to exchange it for the correct color as soon as possible.',
    'The product seems to be missing some essential parts mentioned in the manual. Could you send the missing components or arrange a return?',
    'I received my order but the product doesn\'t work as described. I\'ve tried troubleshooting but no luck. Please advise on next steps.',
    'I would like to return this item as it doesn\'t meet my needs. What is the return process and will I get a full refund?',
    'My tracking number hasn\'t updated in 5 days. Can you check the status of my shipment?',
    'I was charged twice for my order. Please refund the duplicate payment immediately.',
    'I tried using the discount code from your email but it says it\'s invalid. Can you help?',
    'I can\'t log into my account. Password reset isn\'t working either. Need urgent help.',
    'The website keeps giving me an error when I try to checkout. I\'ve tried multiple times with different payment methods.',
    'The product quality is not as expected. It feels cheap and flimsy. Very disappointed.',
    'I ordered the large size but it fits like a medium. Do you have sizing charts?',
    'The color in person is completely different from the website photos. This is misleading.',
    'My order was supposed to arrive yesterday but there\'s been a delay. When can I expect delivery?',
    'I need to file a warranty claim. The product stopped working after just 2 months of use.',
    'Can you provide detailed installation instructions? The manual that came with it is unclear.',
    'Will this product work with my existing setup? I need compatibility information before installing.',
    'I need to order 50 units for my business. Do you offer bulk discounts?',
    'Do you ship to my country? The checkout won\'t let me select my shipping address.'
  ];

  for (let i = 0; i < count; i++) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - randomInt(1, 60));

    const status = getRandomElement(['open', 'in-progress', 'waiting-customer', 'resolved', 'closed'] as const);
    const priority = getRandomElement(['low', 'medium', 'high', 'urgent'] as const);

    const userName = getRandomElement(userNames);
    const emailName = userName.toLowerCase().replace(/\s+/g, '.');

    const ticket: Ticket = {
      id: `tick_${String(i + 1).padStart(4, '0')}`,
      ticketNumber: `TKT-${randomInt(100000, 999999)}`,
      userId: `user_${randomInt(1000, 9999)}`,
      userName,
      userEmail: `${emailName}@email.com`,
      subject: getRandomElement(subjects),
      description: getRandomElement(descriptions),
      category: getRandomElement(ticketCategories),
      priority,
      status,
      assignedTo: status !== 'open' ? getRandomElement(['Support Team', 'John Smith', 'Sarah Williams', 'Mike Johnson', 'Emily Chen']) : undefined,
      tags: getRandomElements(['urgent', 'shipping', 'refund', 'quality', 'technical', 'payment', 'order'], randomInt(1, 3)),
      createdAt: createdDate.toISOString(),
      updatedAt: generatePastDate(randomInt(0, 30)),
      resolvedAt: ['resolved', 'closed'].includes(status) ? generatePastDate(randomInt(1, 15)) : undefined
    };

    tickets.push(ticket);
  }

  return tickets;
}

// Main execution
console.log('🚀 Starting data generation...\n');

console.log('📦 Generating 100 products...');
const products = generateProducts(100);
console.log(`✅ Generated ${products.length} products across ${categories.length} categories\n`);

console.log('⭐ Generating 200 reviews (2 per product)...');
const reviews = generateReviews(products);
console.log(`✅ Generated ${reviews.length} reviews\n`);

console.log('🎫 Generating 50 support tickets...');
const tickets = generateTickets(50);
console.log(`✅ Generated ${tickets.length} support tickets\n`);

console.log('📋 Generating 20 policies...');
const policies = generatePolicies(20);
console.log(`✅ Generated ${policies.length} policies\n`);

console.log('🎟️  Generating 20 coupons...');
const coupons = generateCoupons(20);
console.log(`✅ Generated ${coupons.length} coupons\n`);

// Create output directory
const outputDir = path.join(process.cwd(), 'src', 'data', 'generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to JSON files
console.log('💾 Writing data to files...');

fs.writeFileSync(
  path.join(outputDir, 'products.json'),
  JSON.stringify(products, null, 2)
);
console.log(`✅ Wrote products.json (${products.length} products)`);

fs.writeFileSync(
  path.join(outputDir, 'reviews.json'),
  JSON.stringify(reviews, null, 2)
);
console.log(`✅ Wrote reviews.json (${reviews.length} reviews)`);

fs.writeFileSync(
  path.join(outputDir, 'tickets.json'),
  JSON.stringify(tickets, null, 2)
);
console.log(`✅ Wrote tickets.json (${tickets.length} tickets)`);

fs.writeFileSync(
  path.join(outputDir, 'policies.json'),
  JSON.stringify(policies, null, 2)
);
console.log(`✅ Wrote policies.json (${policies.length} policies)`);

fs.writeFileSync(
  path.join(outputDir, 'coupons.json'),
  JSON.stringify(coupons, null, 2)
);
console.log(`✅ Wrote coupons.json (${coupons.length} coupons)`);

// Write summary
const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    products: products.length,
    reviews: reviews.length,
    tickets: tickets.length,
    policies: policies.length,
    coupons: coupons.length
  },
  categories: categories.map(c => ({
    name: c.name,
    productCount: products.filter(p => p.category === c.name).length
  })),
  stats: {
    averageProductPrice: (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2),
    totalReviewRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    ticketsByStatus: {
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      waitingCustomer: tickets.filter(t => t.status === 'waiting-customer').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length
    },
    activePolicies: policies.filter(p => p.isActive).length,
    activeCoupons: coupons.filter(c => c.isActive).length,
    couponsByType: {
      percentage: coupons.filter(c => c.type === 'percentage').length,
      fixed: coupons.filter(c => c.type === 'fixed').length,
      freeShipping: coupons.filter(c => c.type === 'free-shipping').length,
      buyOneGetOne: coupons.filter(c => c.type === 'buy-one-get-one').length
    }
  }
};

fs.writeFileSync(
  path.join(outputDir, 'summary.json'),
  JSON.stringify(summary, null, 2)
);
console.log(`✅ Wrote summary.json\n`);

console.log('📊 Summary:');
console.log('─'.repeat(50));
console.log(`Total Products: ${summary.counts.products}`);
console.log(`Total Reviews: ${summary.counts.reviews}`);
console.log(`Total Tickets: ${summary.counts.tickets}`);
console.log(`Total Policies: ${summary.counts.policies}`);
console.log(`Total Coupons: ${summary.counts.coupons}`);
console.log(`Average Product Price: $${summary.stats.averageProductPrice}`);
console.log(`Average Review Rating: ${summary.stats.totalReviewRating}/5.0`);
console.log('\nProducts by Category:');
summary.categories.forEach(cat => {
  console.log(`  - ${cat.name}: ${cat.productCount} products`);
});
console.log('\nTickets by Status:');
console.log(`  - Open: ${summary.stats.ticketsByStatus.open}`);
console.log(`  - In Progress: ${summary.stats.ticketsByStatus.inProgress}`);
console.log(`  - Waiting Customer: ${summary.stats.ticketsByStatus.waitingCustomer}`);
console.log(`  - Resolved: ${summary.stats.ticketsByStatus.resolved}`);
console.log(`  - Closed: ${summary.stats.ticketsByStatus.closed}`);
console.log('\nPolicies:');
console.log(`  - Active: ${summary.stats.activePolicies}`);
console.log(`  - Inactive: ${summary.counts.policies - summary.stats.activePolicies}`);
console.log('\nCoupons:');
console.log(`  - Active: ${summary.stats.activeCoupons}`);
console.log(`  - Inactive: ${summary.counts.coupons - summary.stats.activeCoupons}`);
console.log('\nCoupons by Type:');
console.log(`  - Percentage Off: ${summary.stats.couponsByType.percentage}`);
console.log(`  - Fixed Amount: ${summary.stats.couponsByType.fixed}`);
console.log(`  - Free Shipping: ${summary.stats.couponsByType.freeShipping}`);
console.log(`  - Buy One Get One: ${summary.stats.couponsByType.buyOneGetOne}`);
console.log('\n✨ Data generation complete!');
console.log(`📁 Files saved to: ${outputDir}`);
