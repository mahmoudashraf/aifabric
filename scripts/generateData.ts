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
  slug: string;
  category: string;
  description: string;
  content: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  isActive: boolean;
  applicableRegions: string[];
  relatedPolicies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableCategories: string[];
  applicableProducts: string[];
  excludedProducts: string[];
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPublic: boolean;
  requirements: string[];
  terms: string;
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

// Generate Products
function generateProducts(count: number): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const subcategory = getRandomElement(category.subcategories);
    const brand = getRandomElement(brands);
    const adjective = getRandomElement(adjectives);

    const basePrice = randomFloat(9.99, 999.99);
    const hasDiscount = Math.random() > 0.7;
    const compareAtPrice = hasDiscount ? basePrice * randomFloat(1.2, 1.5) : undefined;

    const features = generateFeatures(category.name, subcategory);
    const specs = generateSpecifications(category.name, subcategory);

    const product: Product = {
      id: `prod_${String(i + 1).padStart(4, '0')}`,
      sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${randomInt(10000, 99999)}`,
      title: `${adjective} ${subcategory.replace(/'/g, '')} - ${brand}`,
      description: generateShortDescription(category.name, subcategory, adjective),
      longDescription: generateLongDescription(category.name, subcategory, adjective, brand),
      category: category.name,
      subcategory,
      brand,
      price: basePrice,
      compareAtPrice,
      inStock: Math.random() > 0.1,
      stockQuantity: randomInt(0, 500),
      imageUrl: generateCategoryImageUrl(category.name, subcategory),
      images: Array(randomInt(3, 6)).fill(0).map(() =>
        generateCategoryImageUrl(category.name, subcategory)
      ),
      rating: randomFloat(3.5, 5.0, 1),
      reviewCount: 0, // Will be updated when reviews are generated
      features,
      specifications: specs,
      tags: generateTags(category.name, subcategory, adjective),
      weight: `${randomFloat(0.1, 50, 2)} lbs`,
      dimensions: `${randomInt(1, 30)}"L x ${randomInt(1, 20)}"W x ${randomInt(1, 15)}"H`,
      colors: getRandomElements(['Black', 'White', 'Gray', 'Silver', 'Blue', 'Red', 'Green', 'Gold', 'Rose Gold'], randomInt(1, 4)),
      sizes: category.name === 'Fashion' ? getRandomElements(['XS', 'S', 'M', 'L', 'XL', 'XXL'], randomInt(3, 6)) : undefined,
      material: getMaterial(category.name),
      warranty: getWarranty(),
      createdAt: generatePastDate(365),
      updatedAt: generatePastDate(30)
    };

    products.push(product);
  }

  return products;
}

function generateShortDescription(category: string, subcategory: string, adjective: string): string {
  const templates = [
    `Experience the ${adjective.toLowerCase()} quality of this exceptional ${subcategory.toLowerCase()} designed specifically for discerning customers who value both performance and aesthetics. Perfect for everyday use with exceptional performance that exceeds industry standards. This remarkable product combines innovative engineering with user-friendly features, making it an essential addition to your ${category.toLowerCase()} collection. Whether you're a professional or enthusiast, you'll appreciate the attention to detail and superior craftsmanship.`,
    `Discover our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}, meticulously designed with precision engineering and built to last through years of demanding use. A must-have for your ${category.toLowerCase()} collection that delivers outstanding value and performance. Each component has been carefully selected to ensure maximum durability and reliability. The intuitive design makes it easy to use right out of the box, while advanced features provide room to grow as your needs evolve. Join thousands of satisfied customers who have made this their top choice.`,
    `Elevate your lifestyle with this ${adjective.toLowerCase()} ${subcategory.toLowerCase()} that perfectly combines style, functionality, and reliability in one impressive package. Engineered using cutting-edge technology and premium materials, this product represents the pinnacle of modern design and innovation. Experience unparalleled performance that adapts to your unique needs while maintaining consistent quality over time. The sleek aesthetic ensures it looks great in any setting, whether at home, office, or on the go. Backed by comprehensive warranty and exceptional customer support.`,
    `This ${adjective.toLowerCase()} ${subcategory.toLowerCase()} sets a new standard in ${category.toLowerCase()} products, raising the bar for quality, performance, and value. Crafted for those who demand the best and refuse to compromise on excellence. Every aspect has been optimized through rigorous testing and customer feedback to deliver an experience that truly stands out. From the moment you unbox it, you'll notice the superior build quality and thoughtful features that make daily use a pleasure. Trusted by professionals and recommended by experts worldwide.`,
    `Transform your experience with our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}, expertly engineered for excellence and thoughtfully designed with you in mind. This remarkable product seamlessly integrates into your lifestyle, offering intuitive operation and reliable performance day after day. Advanced features work together harmoniously to provide capabilities that exceed expectations, while maintaining simplicity and ease of use. Premium construction ensures longevity, making this a smart investment that delivers value for years to come. Experience the difference that true quality makes.`
  ];
  return getRandomElement(templates);
}

function generateLongDescription(category: string, subcategory: string, adjective: string, brand: string): string {
  return `
Introducing the ${adjective} ${subcategory} by ${brand}, a revolutionary product that fundamentally redefines what you can expect from ${category.toLowerCase()} products. This exceptional item represents years of research, development, and customer feedback distilled into one extraordinary package that delivers on every promise.

**Superior Design & Construction**
Meticulously crafted with unwavering attention to every detail, this ${subcategory.toLowerCase()} seamlessly combines cutting-edge technology with timeless design principles that have stood the test of time. The result is a product that not only performs exceptionally well under demanding conditions but also looks absolutely stunning in any environment, whether that's your home, office, or anywhere else. The ergonomic design has been refined through countless iterations to ensure maximum comfort and usability, while the premium materials provide a luxurious feel that you'll appreciate every time you use it.

**Advanced Features & Innovation**
Packed with innovative features that genuinely make your life easier and more enjoyable, this product represents the pinnacle of modern engineering excellence. From intuitive controls that require no learning curve to smart connectivity options that seamlessly integrate with your existing devices, every aspect has been meticulously optimized for the ultimate user experience. Advanced sensors and intelligent algorithms work behind the scenes to deliver consistent, reliable performance that adapts to your specific needs and usage patterns over time.

**Uncompromising Quality Standards**
We use only the finest materials sourced from trusted suppliers and employ state-of-the-art manufacturing processes to ensure that each and every unit meets our exacting quality standards. Rigorous multi-stage quality control testing guarantees that you're getting a product genuinely built to last, not just for months, but for years of reliable service. Every component undergoes thorough inspection, and each assembled unit is individually tested before it leaves our facility.

**Perfect For Every Need**
Whether you're a demanding professional seeking reliable tools that won't let you down during critical moments, or someone who simply appreciates quality in everyday items and refuses to settle for mediocrity, this ${subcategory.toLowerCase()} is specifically designed to exceed your highest expectations. It's ideal for both personal and professional use, versatile enough to handle a wide range of applications while maintaining consistent excellence across all use cases.

**Exceptional Customer Satisfaction**
Join thousands of satisfied customers worldwide who have made this their go-to choice and consistently recommend it to friends, family, and colleagues. Backed by our comprehensive warranty program and world-class customer support team that's always ready to help, you can purchase with complete confidence knowing that we stand behind every product we sell. Our commitment to your satisfaction doesn't end at the sale - we're here to support you throughout the entire lifecycle of your purchase.

**Sustainability & Social Responsibility**
${brand} is deeply committed to environmental responsibility and ethical business practices. This product is manufactured using sustainable practices and eco-friendly materials wherever possible, without compromising on quality or performance. We carefully consider the environmental impact of every decision, from sourcing to packaging, ensuring that you can feel good about your purchase.

**Technical Excellence**
State-of-the-art components work in perfect harmony to deliver performance that consistently exceeds industry benchmarks. Advanced engineering ensures optimal efficiency, reducing waste while maximizing output. The result is a product that not only performs better but does so while consuming fewer resources.

**Investment in Quality**
This isn't just a purchase - it's an investment in quality that pays dividends every day through reliable performance, lasting durability, and consistent satisfaction. While others may offer cheaper alternatives, they simply cannot match the comprehensive value proposition that this product delivers.

Order today and experience the ${brand} difference! Transform your expectations of what ${category.toLowerCase()} products can be.
  `.trim();
}

function generateFeatures(category: string, subcategory: string): string[] {
  const universalFeatures = [
    'Premium build quality',
    'Easy to use interface',
    'Durable construction',
    'Sleek modern design',
    'Energy efficient',
    'Eco-friendly materials',
    'Quick setup process',
    'Compact storage'
  ];

  const categoryFeatures: Record<string, string[]> = {
    'Electronics': ['Wireless connectivity', 'Long battery life', 'Fast charging', 'HD display', 'Smart features', '5-year warranty'],
    'Home & Kitchen': ['Dishwasher safe', 'BPA-free', 'Non-stick surface', 'Heat resistant', 'Easy to clean', 'Space-saving design'],
    'Fashion': ['Breathable fabric', 'Machine washable', 'Wrinkle resistant', 'Multiple color options', 'Adjustable fit', 'Premium materials'],
    'Sports & Outdoors': ['Weather resistant', 'Lightweight design', 'Portable', 'Adjustable settings', 'Safety certified', 'Professional grade'],
    'Beauty & Personal Care': ['Dermatologist tested', 'Hypoallergenic', 'Cruelty-free', 'Natural ingredients', 'Long-lasting', 'Suitable for all skin types']
  };

  const features = [
    ...getRandomElements(universalFeatures, 3),
    ...getRandomElements(categoryFeatures[category] || universalFeatures, 3)
  ];

  return features;
}

function generateSpecifications(category: string, subcategory: string): Record<string, string> {
  const baseSpecs: Record<string, string> = {
    'Model Number': `MN-${randomInt(1000, 9999)}`,
    'Manufacturer': getRandomElement(brands),
    'Country of Origin': getRandomElement(['USA', 'Germany', 'Japan', 'South Korea', 'China']),
    'Item Weight': `${randomFloat(0.5, 25, 2)} pounds`
  };

  if (category === 'Electronics') {
    return {
      ...baseSpecs,
      'Battery': `${randomInt(3000, 10000)}mAh`,
      'Connectivity': getRandomElement(['WiFi, Bluetooth 5.0', 'Bluetooth 5.2', 'WiFi 6, Bluetooth']),
      'Display': `${randomFloat(5.0, 15.6, 1)}" ${getRandomElement(['LCD', 'OLED', 'LED', 'AMOLED'])}`,
      'Processor': getRandomElement(['Quad-core 2.4GHz', 'Octa-core 3.0GHz', 'Hexa-core 2.8GHz']),
      'Storage': getRandomElement(['64GB', '128GB', '256GB', '512GB', '1TB'])
    };
  }

  return baseSpecs;
}

function generateTags(category: string, subcategory: string, adjective: string): string[] {
  return [
    category.toLowerCase(),
    subcategory.toLowerCase().replace(/\s+/g, '-'),
    adjective.toLowerCase(),
    getRandomElement(['trending', 'bestseller', 'new-arrival', 'featured', 'popular']),
    getRandomElement(['gift-idea', 'must-have', 'top-rated', 'customer-favorite'])
  ];
}

function getMaterial(category: string): string {
  const materials: Record<string, string[]> = {
    'Electronics': ['Aluminum', 'Plastic', 'Glass', 'Carbon Fiber'],
    'Home & Kitchen': ['Stainless Steel', 'Ceramic', 'Glass', 'Bamboo', 'Silicone'],
    'Fashion': ['Cotton', 'Polyester', 'Leather', 'Wool', 'Nylon', 'Silk'],
    'Sports & Outdoors': ['Nylon', 'Polyester', 'Aluminum', 'Carbon Fiber', 'Rubber'],
    'Beauty & Personal Care': ['Plastic', 'Glass', 'Silicone', 'Stainless Steel']
  };

  return getRandomElement(materials[category] || ['Mixed Materials', 'Composite', 'Synthetic']);
}

function getWarranty(): string {
  return getRandomElement([
    '1-year limited warranty',
    '2-year manufacturer warranty',
    '3-year extended warranty',
    '5-year warranty',
    'Lifetime warranty',
    '90-day warranty'
  ]);
}

function generatePastDate(maxDaysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(1, maxDaysAgo));
  return date.toISOString();
}

function generateCategoryImageUrl(category: string, subcategory: string): string {
  // Use more specific Unsplash photo IDs based on category
  const categoryImages: Record<string, string[]> = {
    'Electronics': [
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece', // Smartphone
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', // Laptop
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', // Headphones
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', // Camera
      'https://images.unsplash.com/photo-1484704849700-f032a568e944', // Smart watch
      'https://images.unsplash.com/photo-1498049794561-7780e7231661', // Desktop setup
    ],
    'Home & Kitchen': [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba', // Kitchen appliance
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a', // Cookware
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', // Modern furniture
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', // Home decor
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571', // Kitchen interior
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7', // Home appliances
    ],
    'Fashion': [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b', // Clothing
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2', // Fashion accessories
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d', // Sneakers
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', // Fashion items
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', // Fashion display
      'https://images.unsplash.com/photo-1511556820780-d912e42b4980', // Watch
    ],
    'Sports & Outdoors': [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', // Gym equipment
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4', // Camping gear
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d', // Bicycle
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256', // Sports equipment
      'https://images.unsplash.com/photo-1482424917728-d82d29662023', // Outdoor activity
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', // Sports gear
    ],
    'Beauty & Personal Care': [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348', // Skincare products
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', // Beauty products
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571', // Personal care
      'https://images.unsplash.com/photo-1571875257727-256c39da42af', // Cosmetics
      'https://images.unsplash.com/photo-1556228720-195a672e8a03', // Beauty items
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b', // Skincare
    ],
    'Toys & Games': [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4', // Toys
      'https://images.unsplash.com/photo-1566694271453-390536dd1f0d', // Board game
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b', // Puzzle
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7', // Building blocks
      'https://images.unsplash.com/photo-1596461396169-f3e6d5c7e1d3', // Educational toys
      'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0', // Game pieces
    ],
    'Books & Media': [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794', // Books
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d', // Book stack
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f', // Books on shelf
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', // Reading
      'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d', // Open book
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f', // Book collection
    ],
    'Office Supplies': [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', // Office desk
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b', // Stationery
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c', // Office workspace
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa', // Office supplies
      'https://images.unsplash.com/photo-1568667256549-094345857637', // Desk items
      'https://images.unsplash.com/photo-1590649062646-a3cf88f27f66', // Office equipment
    ],
    'Automotive': [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7', // Car
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3', // Car interior
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d', // Automotive
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537', // Car dashboard
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2', // Auto parts
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e', // Car accessories
    ],
    'Health & Wellness': [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528', // Wellness
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de', // Health products
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71', // Supplements
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', // Fitness
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', // Health items
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773', // Medical supplies
    ],
  };

  const categoryUrls = categoryImages[category] || [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30', // Generic product
  ];

  return getRandomElement(categoryUrls) + `?w=800&h=800&fit=crop&q=80`;
}

// Generate Reviews
function generateReviews(products: Product[]): Review[] {
  const reviews: Review[] = [];
  let reviewId = 1;

  products.forEach(product => {
    const numReviews = 2; // 2 reviews per product as requested

    for (let i = 0; i < numReviews; i++) {
      const rating = generateWeightedRating();
      const userName = getRandomElement(userNames);

      const review: Review = {
        id: `rev_${String(reviewId++).padStart(4, '0')}`,
        productId: product.id,
        userId: `user_${randomInt(1000, 9999)}`,
        userName,
        rating,
        title: getRandomElement(reviewTitles[rating as keyof typeof reviewTitles]),
        text: generateReviewText(rating, product.title, product.category),
        helpful: randomInt(0, 50),
        verified: Math.random() > 0.2, // 80% verified purchases
        createdAt: generatePastDate(90),
        updatedAt: generatePastDate(90)
      };

      reviews.push(review);
    }

    // Update product review count and rating
    product.reviewCount = numReviews;
  });

  return reviews;
}

function generateWeightedRating(): number {
  // Weight towards higher ratings (more realistic)
  const rand = Math.random();
  if (rand < 0.5) return 5;
  if (rand < 0.75) return 4;
  if (rand < 0.9) return 3;
  if (rand < 0.97) return 2;
  return 1;
}

function generateReviewText(rating: number, productName: string, category: string): string {
  const positiveTemplates = [
    `I've been using this ${productName} for a few weeks now and I'm extremely impressed. The quality is outstanding and it performs exactly as described. Highly recommend!`,
    `This is exactly what I was looking for! The ${category.toLowerCase()} product exceeded my expectations in every way. Great value for money.`,
    `Absolutely love this purchase! The build quality is excellent and it looks even better in person. Worth every penny.`,
    `Best ${category.toLowerCase()} product I've purchased in a long time. It's well-made, functional, and stylish. Very satisfied with my purchase.`,
    `I did a lot of research before buying and I'm so glad I chose this one. It's perfect for my needs and the quality is top-notch.`
  ];

  const neutralTemplates = [
    `The ${productName} is decent for the price. It does what it's supposed to do, though there are a few minor issues. Overall, it's acceptable.`,
    `It's an okay product. Nothing spectacular but gets the job done. Would recommend if you're on a budget.`,
    `Mixed feelings about this one. Some features are great, others could use improvement. It's good enough for everyday use.`,
    `The product is functional and serves its purpose. Build quality is average. For the price, it's a fair deal.`
  ];

  const negativeTemplates = [
    `Unfortunately, this didn't meet my expectations. The quality isn't as good as advertised and I've had some issues with it.`,
    `Disappointed with this purchase. It looks good but the performance is lacking. Expected more for the price.`,
    `Not impressed. The ${productName} feels cheaply made and doesn't work as well as I hoped. Would not buy again.`,
    `Had high hopes but this product fell short. Several quality issues and it stopped working properly after a short time.`
  ];

  if (rating >= 4) return getRandomElement(positiveTemplates);
  if (rating === 3) return getRandomElement(neutralTemplates);
  return getRandomElement(negativeTemplates);
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

// Generate Policies
function generatePolicies(count: number): Policy[] {
  const policies: Policy[] = [];

  const policyCategories = [
    'Privacy & Data', 'Terms of Service', 'Shipping & Delivery',
    'Returns & Refunds', 'Payment', 'Security', 'Compliance',
    'User Conduct', 'Intellectual Property', 'Dispute Resolution'
  ];

  const policyTitles: Record<string, string[]> = {
    'Privacy & Data': [
      'Data Collection and Usage Policy',
      'Cookie and Tracking Technology Policy',
      'Personal Information Protection Policy',
      'Third-Party Data Sharing Policy'
    ],
    'Terms of Service': [
      'General Terms and Conditions',
      'User Account Terms of Service',
      'Service Level Agreement',
      'Platform Usage Guidelines'
    ],
    'Shipping & Delivery': [
      'Standard Shipping Policy',
      'International Shipping Guidelines',
      'Express Delivery Terms',
      'Shipping Insurance Policy'
    ],
    'Returns & Refunds': [
      'Return and Exchange Policy',
      'Refund Processing Guidelines',
      'Damaged Goods Return Policy',
      'Money-Back Guarantee Terms'
    ],
    'Payment': [
      'Payment Methods and Processing Policy',
      'Subscription Billing Policy',
      'Payment Security Standards',
      'Currency and Exchange Rate Policy'
    ],
    'Security': [
      'Account Security Policy',
      'Data Encryption Standards',
      'Security Incident Response Policy',
      'Two-Factor Authentication Policy'
    ],
    'Compliance': [
      'GDPR Compliance Policy',
      'CCPA Compliance Guidelines',
      'Accessibility Standards Policy',
      'Age Verification Policy'
    ],
    'User Conduct': [
      'Acceptable Use Policy',
      'Community Guidelines',
      'Content Moderation Policy',
      'Anti-Harassment Policy'
    ],
    'Intellectual Property': [
      'Copyright and Trademark Policy',
      'User-Generated Content Rights',
      'DMCA Takedown Policy',
      'Brand Usage Guidelines'
    ],
    'Dispute Resolution': [
      'Complaint Handling Procedure',
      'Arbitration Agreement',
      'Chargeback Policy',
      'Legal Dispute Resolution Process'
    ]
  };

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(policyCategories);
    const availableTitles = policyTitles[category];
    const title = getRandomElement(availableTitles);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const version = `${randomInt(1, 5)}.${randomInt(0, 9)}.${randomInt(0, 20)}`;

    const description = generatePolicyDescription(category, title);
    const content = generatePolicyContent(category, title);

    const policy: Policy = {
      id: `policy_${String(i + 1).padStart(4, '0')}`,
      title,
      slug,
      category,
      description,
      content,
      effectiveDate: generatePastDate(730), // Up to 2 years ago
      lastUpdated: generatePastDate(90),
      version,
      isActive: Math.random() > 0.1, // 90% are active
      applicableRegions: getRandomElements(['US', 'EU', 'UK', 'Canada', 'Australia', 'Global'], randomInt(2, 4)),
      relatedPolicies: [], // Will be populated later
      tags: [
        category.toLowerCase().replace(/\s+/g, '-'),
        getRandomElement(['legal', 'mandatory', 'important', 'customer-rights', 'compliance']),
        getRandomElement(['updated', 'new', 'revised', 'standard'])
      ],
      createdAt: generatePastDate(730),
      updatedAt: generatePastDate(90)
    };

    policies.push(policy);
  }

  return policies;
}

function generatePolicyDescription(category: string, title: string): string {
  const descriptions: Record<string, string> = {
    'Privacy & Data': `This comprehensive policy outlines how we collect, process, store, and protect your personal information in accordance with international data protection regulations. We are committed to transparency and security in all our data handling practices. This policy explains your rights regarding your personal data, including access, rectification, erasure, and portability. We detail the specific types of information we collect, the legal basis for processing, retention periods, and how we share data with trusted third parties. Understanding your privacy rights is essential, and we've made every effort to present this information in clear, accessible language.`,
    'Terms of Service': `These terms govern your use of our platform and services, establishing the legal relationship between you and our company. By accessing or using our services, you agree to be bound by these terms and conditions. This agreement covers user responsibilities, account management, acceptable use guidelines, service availability, limitation of liability, and termination procedures. We've structured these terms to be fair and transparent while protecting the interests of all parties involved. Please read these terms carefully as they contain important information about your rights and obligations.`,
    'Shipping & Delivery': `Our shipping policy provides detailed information about delivery options, timeframes, costs, and procedures for domestic and international orders. We work with trusted carrier partners to ensure reliable and timely delivery of your purchases. This policy covers shipping methods, estimated delivery times, tracking information, shipping restrictions, address requirements, and procedures for handling delivery issues. We are committed to getting your order to you safely and efficiently, and this policy explains exactly what you can expect throughout the shipping process.`,
    'Returns & Refunds': `This policy establishes the terms and procedures for returning products and obtaining refunds or exchanges. We stand behind the quality of our products and want you to be completely satisfied with your purchase. Learn about eligibility requirements, return windows, condition requirements, refund processing times, and special considerations for different product categories. We've designed this policy to be customer-friendly while maintaining necessary safeguards against abuse. Understanding these terms helps ensure a smooth return experience if you're not completely satisfied.`,
    'Payment': `This comprehensive payment policy explains the methods we accept, security measures we employ, and procedures we follow for processing transactions. Your financial security is our top priority, and we use industry-leading encryption and security protocols to protect your payment information. This policy covers accepted payment methods, authorization procedures, billing cycles, currency handling, failed payment resolution, and dispute procedures. We are committed to transparent, secure, and efficient payment processing for all transactions.`,
    'Security': `Our security policy demonstrates our commitment to protecting your account, data, and privacy through comprehensive technical and organizational measures. We employ state-of-the-art security technologies and best practices to safeguard against unauthorized access, data breaches, and other security threats. This policy details our security infrastructure, incident response procedures, user security responsibilities, authentication requirements, and continuous monitoring practices. We believe security is a shared responsibility and provide clear guidance on how you can help protect your account.`,
    'Compliance': `This policy outlines our commitment to maintaining compliance with relevant laws, regulations, and industry standards across all jurisdictions where we operate. Regulatory compliance is fundamental to our business operations, and we take our legal obligations seriously. This document explains how we ensure adherence to data protection laws, consumer protection regulations, accessibility standards, and other applicable legal requirements. We regularly review and update our compliance measures to reflect evolving legal landscapes and maintain the highest standards of business conduct.`,
    'User Conduct': `Our user conduct policy establishes expectations for behavior and interactions within our platform community. Creating a safe, respectful, and productive environment for all users is a shared responsibility. This policy defines prohibited activities, content standards, enforcement procedures, and consequences for violations. We believe in fostering a positive community where everyone can participate freely while respecting the rights and dignity of others. These guidelines help ensure that our platform remains a welcoming space for legitimate use while preventing abuse and harmful behavior.`,
    'Intellectual Property': `This policy protects intellectual property rights while establishing clear guidelines for content usage and ownership. We respect the intellectual property rights of others and expect our users to do the same. This document covers copyright protection, trademark usage, licensing arrangements, user-generated content rights, and procedures for reporting infringement. Understanding these principles helps prevent legal disputes and ensures that creators receive proper recognition and protection for their work. We are committed to maintaining a platform that respects intellectual property while enabling creative expression.`,
    'Dispute Resolution': `Our dispute resolution policy provides a clear, structured framework for addressing conflicts and resolving disagreements that may arise from your use of our services. We believe in fair, efficient, and accessible dispute resolution mechanisms that protect the rights of all parties. This policy explains complaint procedures, mediation options, arbitration agreements, and escalation paths for unresolved issues. We are committed to addressing concerns promptly and professionally, seeking mutually satisfactory resolutions whenever possible. Understanding these procedures helps ensure that any disputes can be resolved quickly and fairly.`
  };

  return descriptions[category] || `This policy provides comprehensive information about ${title.toLowerCase()} and establishes clear guidelines and procedures. We are committed to transparency, fairness, and protecting the interests of all parties involved. This document has been carefully crafted to ensure you understand your rights and responsibilities. Our policies reflect industry best practices and comply with all applicable legal requirements. We regularly review and update our policies to reflect changes in law, technology, and business practices. Your understanding and compliance with this policy helps create a better experience for everyone in our community.`;
}

function generatePolicyContent(category: string, title: string): string {
  return `
# ${title}

**Effective Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

## 1. Introduction and Purpose

This policy has been developed to provide clear, comprehensive guidance regarding ${title.toLowerCase()}. Our organization is committed to maintaining the highest standards of transparency, compliance, and ethical conduct in all our operations. This document outlines the specific principles, procedures, and requirements that govern this aspect of our business relationship with you.

We recognize that policies must be both comprehensive and accessible. Therefore, we have structured this document to provide detailed information while remaining easy to understand. Should you have any questions about the content or application of this policy, our customer service team is available to provide clarification and assistance.

## 2. Scope and Applicability

This policy applies to all users, customers, partners, and stakeholders who interact with our platform, services, or products. The provisions outlined herein are binding and enforceable, subject to applicable laws and regulations. By continuing to use our services, you acknowledge that you have read, understood, and agree to be bound by the terms set forth in this policy.

Certain provisions may have limited applicability based on geographic location, service tier, account type, or other factors. Where such limitations exist, they are clearly indicated within the relevant sections. Our goal is to ensure fair and consistent treatment while acknowledging that different circumstances may require different approaches.

## 3. Key Principles and Standards

Our approach to ${category.toLowerCase()} is guided by several core principles that inform all our decisions and actions:

**Transparency and Clarity:** We believe in open, honest communication about our practices, procedures, and expectations. We strive to make information readily accessible and understandable to all stakeholders.

**Fairness and Equity:** We are committed to treating all individuals and entities fairly, without discrimination or bias. Our policies and procedures are designed to ensure equitable treatment regardless of background, location, or circumstances.

**Accountability and Responsibility:** We hold ourselves accountable for maintaining compliance with this policy and take responsibility for any failures or shortcomings. We expect all parties to similarly acknowledge their obligations and commitments.

**Security and Protection:** We prioritize the security and protection of data, assets, rights, and interests. Appropriate safeguards and controls are implemented to prevent unauthorized access, misuse, or harm.

**Continuous Improvement:** We regularly review and update our policies to reflect evolving best practices, technological advances, regulatory changes, and stakeholder feedback. Our commitment is to ongoing enhancement of our standards and procedures.

## 4. Detailed Requirements and Procedures

${generateDetailedPolicySection(category)}

## 5. Rights and Responsibilities

**Your Rights:**
You have the right to understand how this policy affects you, to receive clear information about procedures and requirements, to raise concerns or complaints, to request clarification or assistance, and to be treated fairly and respectfully throughout all interactions.

**Your Responsibilities:**
You are responsible for reading and understanding this policy, complying with all applicable requirements, providing accurate and complete information, maintaining the security and confidentiality of sensitive data, reporting violations or concerns promptly, and cooperating with enforcement and compliance efforts.

**Our Responsibilities:**
We are responsible for maintaining and enforcing this policy consistently, providing necessary support and resources, responding to inquiries and concerns promptly, protecting your rights and interests, maintaining compliance with applicable laws, and updating this policy as circumstances require.

## 6. Compliance and Enforcement

We take compliance with this policy seriously and have implemented comprehensive monitoring and enforcement mechanisms. Violations may result in various consequences depending on the nature and severity of the breach, including warnings, service restrictions, account suspension, contract termination, and legal action where appropriate.

We employ automated systems and manual reviews to detect potential violations. When issues are identified, we investigate thoroughly and take appropriate action based on the circumstances. Our enforcement approach balances the need for accountability with fairness and proportionality.

## 7. Updates and Modifications

This policy may be updated periodically to reflect changes in law, technology, business practices, or other relevant factors. Material changes will be communicated through appropriate channels, including email notifications, platform announcements, or prominently displayed notices.

Continued use of our services following policy updates constitutes acceptance of the modified terms. However, we encourage you to review changes carefully and contact us with any questions or concerns. In some cases, we may require explicit acknowledgment of significant policy changes.

## 8. Contact Information and Support

If you have questions, concerns, or require assistance regarding this policy, please contact our dedicated support team:

- **Email:** policy-support@company.com
- **Phone:** 1-800-SUPPORT (available Monday-Friday, 9 AM - 6 PM EST)
- **Online Portal:** Visit our Help Center for comprehensive resources and self-service options
- **Mail:** Policy Department, [Company Address]

We aim to respond to all inquiries within 48 business hours and resolve issues as quickly as possible while ensuring thorough, appropriate handling.

## 9. Legal Framework and Jurisdiction

This policy is governed by applicable laws and regulations. In the event of conflicts between this policy and mandatory legal requirements, the legal requirements shall prevail. Any disputes arising from or relating to this policy shall be resolved according to the dispute resolution procedures outlined in our Terms of Service.

We operate in multiple jurisdictions and comply with various legal frameworks. Where regional variations exist, they are noted within specific policy sections or supplementary regional addendums.

## 10. Acknowledgment

By using our services, you acknowledge that you have read this policy, understand its contents, agree to be bound by its terms, and recognize that failure to comply may result in consequences as outlined herein. This policy represents an integral part of our overall agreement with you and should be read in conjunction with other applicable terms, conditions, and policies.

---

**Document Information:**
- **Version:** ${randomInt(1, 5)}.${randomInt(0, 9)}
- **Last Updated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
- **Review Schedule:** Annually or as needed
- **Owner:** Legal and Compliance Department
- **Approval Authority:** Chief Legal Officer

**Related Policies:**
Please review our other policies for complete information about your rights and responsibilities.
  `.trim();
}

function generateDetailedPolicySection(category: string): string {
  const sections: Record<string, string> = {
    'Privacy & Data': 'We collect various types of personal information including identification data, contact information, transaction history, device information, and usage analytics. All data collection serves specific, legitimate purposes such as service delivery, fraud prevention, personalization, and compliance with legal obligations. You have comprehensive rights regarding your data including access, rectification, erasure, portability, and the right to object to certain processing activities. We implement robust security measures including encryption, access controls, regular security audits, and staff training to protect your information. Data retention periods vary based on legal requirements and business needs, but we do not retain data longer than necessary.',
    'Terms of Service': 'Service access requires account creation with accurate information and secure credential management. You are responsible for all activities under your account and must promptly notify us of unauthorized access. Acceptable use requires compliance with all applicable laws and prohibits activities including harassment, infringement, system interference, data scraping, impersonation, and other harmful behaviors. We reserve the right to modify, suspend, or terminate services with appropriate notice, though immediate action may be taken for serious violations. Limitation of liability provisions protect both parties while ensuring accountability for negligence or misconduct.',
    'Shipping & Delivery': 'We offer multiple shipping options including standard delivery (5-7 business days), expedited shipping (2-3 business days), express overnight service, and international shipping to select countries. Shipping costs are calculated based on package weight, dimensions, destination, and selected service level. Orders are typically processed within 1-2 business days, with tracking information provided once shipped. Delivery times are estimates and may be affected by weather, customs clearance, carrier delays, or other factors beyond our control. Special handling is available for fragile items at an additional cost.',
    'Returns & Refunds': 'Most items can be returned within 30 days of delivery for a full refund or exchange. Items must be unused, in original condition, with tags and packaging intact. Some product categories have different return windows or may be non-returnable for hygiene or safety reasons. Return shipping costs may be your responsibility unless the return is due to our error or product defect. Refunds are processed to the original payment method within 5-10 business days after we receive and inspect the returned item. Exchanges are processed immediately upon receipt.',
    'Payment': 'We accept major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and select other payment methods depending on your location. All transactions are processed through secure, PCI-DSS compliant payment gateways with industry-standard encryption. Payment authorization occurs at checkout, with charges processed upon order fulfillment. For subscription services, automatic billing occurs according to your chosen billing cycle. Failed payments will be retried, and services may be suspended if payment cannot be processed. Refunds follow standard processing timelines based on your payment method.',
    'Security': 'Account security requires strong passwords meeting complexity requirements, with two-factor authentication strongly recommended and required for certain sensitive operations. We monitor for suspicious activity including unusual login patterns, rapid-fire requests, and unauthorized access attempts. Security incidents trigger our incident response protocol including investigation, containment, remediation, and notification to affected parties as required by law. You must promptly report suspected security issues or unauthorized access. Regular security audits and penetration testing help identify and address vulnerabilities.',
    'Compliance': 'We maintain compliance programs covering data protection (GDPR, CCPA), consumer protection, accessibility (WCAG 2.1), payment card industry standards, and other applicable regulations. Regular compliance audits verify adherence to requirements, with corrective actions implemented when gaps are identified. Staff receive ongoing training on compliance obligations and best practices. We maintain detailed records to demonstrate compliance and cooperate fully with regulatory inquiries and investigations. Our compliance framework is regularly reviewed and updated to reflect changing regulatory landscapes.',
    'User Conduct': 'Prohibited activities include posting illegal content, harassing other users, impersonating individuals or entities, transmitting malware or harmful code, attempting unauthorized access, engaging in spam or phishing, manipulating systems or metrics, infringing intellectual property rights, and other activities that harm users or platform integrity. Content must comply with community standards prohibiting hate speech, violence, adult content, misinformation, and other harmful material. Enforcement actions may include content removal, warnings, temporary restrictions, account suspension, or permanent termination depending on violation severity and frequency.',
    'Intellectual Property': 'All platform content, features, functionality, trademarks, logos, and other intellectual property are owned by us or our licensors and protected by copyright, trademark, and other laws. Limited licenses granted to users permit personal, non-commercial use only. User-generated content remains your property, but you grant us necessary licenses to display, transmit, and use content for platform operations and promotional purposes. Infringement complaints should be submitted through our DMCA process with required information including identification of copyrighted work, location of infringing material, and good-faith statement of authorization.',
    'Dispute Resolution': 'Complaints should first be submitted through our customer service channels, where most issues can be resolved quickly and informally. If initial resolution attempts fail, formal dispute resolution procedures include mediation by neutral third parties, binding arbitration under established arbitration rules, or litigation in designated jurisdictions as a last resort. Time limits apply to dispute filing, so concerns should be raised promptly. We commit to good-faith participation in all dispute resolution procedures and encourage mutually beneficial outcomes whenever possible.'
  };

  return sections[category] || 'Detailed procedures, requirements, and guidelines specific to this policy area are implemented to ensure consistent, fair, and effective application across all situations. These procedures are regularly reviewed and updated to maintain alignment with best practices, regulatory requirements, and stakeholder needs. Training and support resources are available to help ensure understanding and compliance. Monitoring and enforcement mechanisms provide accountability while respecting rights and maintaining proportionate responses to violations.';
}

// Generate Coupons
function generateCoupons(count: number): Coupon[] {
  const coupons: Coupon[] = [];

  const couponTypes = [
    { type: 'percentage' as const, value: [10, 15, 20, 25, 30, 40, 50] },
    { type: 'fixed_amount' as const, value: [5, 10, 15, 20, 25, 50, 100] },
    { type: 'free_shipping' as const, value: [0] },
    { type: 'buy_x_get_y' as const, value: [1] }
  ];

  for (let i = 0; i < count; i++) {
    const couponType = getRandomElement(couponTypes);
    const discountValue = getRandomElement(couponType.value);
    const code = generateCouponCode(couponType.type);
    const isActive = Math.random() > 0.2; // 80% active
    const usageLimit = randomInt(100, 10000);
    const usageCount = isActive ? randomInt(0, usageLimit * 0.8) : usageLimit;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - randomInt(1, 90));

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + randomInt(30, 180));

    const title = generateCouponTitle(couponType.type, discountValue);
    const description = generateCouponDescription(couponType.type, discountValue);
    const requirements = generateCouponRequirements(couponType.type);
    const terms = generateCouponTerms(couponType.type, discountValue);

    const coupon: Coupon = {
      id: `coupon_${String(i + 1).padStart(4, '0')}`,
      code,
      title,
      description,
      discountType: couponType.type,
      discountValue,
      minPurchaseAmount: couponType.type !== 'free_shipping' ? randomFloat(25, 100) : undefined,
      maxDiscountAmount: couponType.type === 'percentage' ? randomFloat(50, 500) : undefined,
      applicableCategories: getRandomElements(categories.map(c => c.name), randomInt(2, 5)),
      applicableProducts: [], // Could be populated with specific product IDs
      excludedProducts: [],
      usageLimit,
      usageCount,
      perUserLimit: randomInt(1, 5),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive,
      isPublic: Math.random() > 0.3, // 70% are public
      requirements,
      terms,
      createdAt: startDate.toISOString(),
      updatedAt: generatePastDate(30)
    };

    coupons.push(coupon);
  }

  return coupons;
}

function generateCouponCode(type: string): string {
  const prefixes = {
    'percentage': ['SAVE', 'OFF', 'DEAL', 'PERCENT'],
    'fixed_amount': ['DISCOUNT', 'CASH', 'DEAL', 'SAVE'],
    'free_shipping': ['SHIP', 'FREE', 'DELIVER', 'SHIPFREE'],
    'buy_x_get_y': ['BOGO', 'BUY', 'DEAL', 'SPECIAL']
  };

  const prefix = getRandomElement(prefixes[type as keyof typeof prefixes] || ['PROMO']);
  const suffix = randomInt(10, 999);
  const year = new Date().getFullYear().toString().slice(-2);

  return `${prefix}${suffix}${Math.random() > 0.5 ? year : ''}`.toUpperCase();
}

function generateCouponTitle(type: string, value: number): string {
  const titles: Record<string, string> = {
    'percentage': `${value}% Off Your Purchase - Limited Time Offer!`,
    'fixed_amount': `$${value} Off Your Order - Exclusive Discount!`,
    'free_shipping': 'Free Shipping on All Orders - No Minimum!',
    'buy_x_get_y': 'Buy One Get One Free - Special Promotion!'
  };

  return titles[type] || 'Special Promotional Offer - Save Today!';
}

function generateCouponDescription(type: string, value: number): string {
  const descriptions: Record<string, string> = {
    'percentage': `Take advantage of this incredible opportunity to save ${value}% on your entire purchase! This exceptional discount applies to a wide selection of products across multiple categories, allowing you to enjoy significant savings on items you love. Whether you're shopping for yourself or finding the perfect gift, this promotion makes it easier than ever to get premium quality at an outstanding value. Don't miss out on this limited-time offer to stretch your budget further and discover amazing products at prices you'll absolutely love. Shop now and experience the satisfaction of smart savings!`,
    'fixed_amount': `Enjoy an instant $${value} discount on your order with this exclusive promotional code! This substantial savings opportunity allows you to purchase more of what you want while spending less. Perfect for customers looking to maximize value, this promotion delivers real cash savings that make a meaningful difference in your shopping budget. Whether you're stocking up on essentials or treating yourself to something special, this discount helps make it more affordable. The redemption process is quick and easy - simply enter the code at checkout and watch your total decrease. Limited time availability makes this an offer you don't want to miss!`,
    'free_shipping': `Say goodbye to shipping fees with this fantastic free shipping promotion! We're covering all delivery costs so you can shop with confidence knowing exactly what you'll pay. This offer eliminates one of the biggest pain points of online shopping - unexpected shipping charges at checkout. Whether you're ordering a single item or filling your cart with multiple products, shipping is completely free with no hidden fees or surprises. Fast, reliable delivery ensures your order arrives safely and on time, all without adding to your costs. Take advantage of this generous offer to shop freely and save substantially on every order you place during this promotional period!`,
    'buy_x_get_y': `Our popular Buy One Get One Free promotion is back! This incredible offer gives you double the value, allowing you to enjoy two items for the price of one. Perfect for stocking up on favorites, trying new products risk-free, or sharing with friends and family. This promotion makes it easier than ever to discover our product range while maximizing your purchasing power. The additional item is of equal or lesser value, ensuring you receive genuine value with every redemption. Whether you're a new customer or loyal fan, this offer rewards your business with exceptional savings and twice the satisfaction. Limited quantities available, so act quickly to secure this amazing deal!`
  };

  return descriptions[type] || `This special promotional offer provides exceptional value and savings on your purchase! Carefully designed to reward our valued customers, this coupon delivers meaningful benefits that make shopping more affordable and enjoyable. Whether you're a frequent shopper or occasional buyer, this promotion offers genuine value that enhances your experience. The redemption process is simple and straightforward, with immediate savings applied at checkout. Terms and conditions apply to ensure fair use while maximizing benefits for as many customers as possible. Don't let this opportunity pass - use this coupon today and discover the difference that smart savings can make in your shopping journey!`;
}

function generateCouponRequirements(type: string): string[] {
  const baseRequirements = [
    'Must have a valid account to redeem this coupon',
    'Coupon code must be entered at checkout before payment',
    'Offer valid for online purchases only',
    'Cannot be combined with other promotional codes or offers'
  ];

  const typeSpecificRequirements: Record<string, string[]> = {
    'percentage': [
      'Discount applies to eligible items only',
      'Sale and clearance items may be excluded',
      'Maximum discount cap may apply',
      'Some brand restrictions may apply'
    ],
    'fixed_amount': [
      'Minimum purchase amount required',
      'Discount applied before taxes and shipping',
      'Valid on regular-priced merchandise only',
      'One-time use per customer during promotional period'
    ],
    'free_shipping': [
      'Offer applies to standard shipping only',
      'Expedited shipping upgrades available at regular rates',
      'Some destinations may have restrictions',
      'Oversized items may require additional handling fees'
    ],
    'buy_x_get_y': [
      'Free item must be of equal or lesser value',
      'Qualifying items must be in stock',
      'Limited to specific product categories',
      'Discount automatically applied to lower-priced item'
    ]
  };

  return [
    ...baseRequirements,
    ...getRandomElements(typeSpecificRequirements[type] || baseRequirements, 2)
  ];
}

function generateCouponTerms(type: string, value: number): string {
  return `
**Promotional Terms and Conditions**

This coupon code represents a promotional offer extended by our company to eligible customers during the specified promotional period. By using this coupon, you acknowledge and agree to these complete terms and conditions:

**Eligibility and Usage:**
This promotion is available to customers who meet all eligibility requirements during the promotional period. Each customer account is subject to usage limitations as specified in the coupon details. Attempts to circumvent usage limits through multiple accounts or other means may result in order cancellation and account suspension.

**Discount Application:**
${type === 'percentage' ? `The ${value}% discount is calculated based on the pre-tax subtotal of eligible items in your cart. The discount percentage applies after all other eligible discounts but before taxes and shipping charges. A maximum discount cap may limit total savings on large orders.` : ''}
${type === 'fixed_amount' ? `The $${value} discount is deducted from your order total after calculating item prices but before taxes and shipping. Orders must meet the specified minimum purchase amount before the discount is applied. If order modifications reduce the total below the minimum threshold, the coupon will be invalidated.` : ''}
${type === 'free_shipping' ? 'Free shipping applies to standard delivery service only. Upgraded shipping methods remain available at their regular rates minus the standard shipping cost. Delivery timeframes reflect the selected shipping method and destination location. Free shipping does not guarantee expedited delivery unless explicitly stated.' : ''}
${type === 'buy_x_get_y' ? 'The free item must be added to your cart alongside the purchased item. The discount automatically applies to the lower-priced of the two items, effectively making it free. Both items must be from eligible product categories as specified in the promotion details. If the qualifying item is returned, the free item must also be returned or will be charged at full price.' : ''}

**Restrictions and Limitations:**
Certain products, brands, or categories may be excluded from this promotion as determined by manufacturer restrictions, licensing agreements, or business policies. Excluded items are clearly marked and will not accept coupon codes at checkout. The promotion cannot be applied retroactively to previous purchases or combined with other offers, coupons, or promotions unless explicitly stated. Rain checks, substitutions, or cash alternatives are not available for promotional items that become unavailable.

**Validity Period:**
This promotion is valid only during the specified start and end dates and times. Coupon codes entered outside the validity window will be rejected at checkout. We reserve the right to extend, modify, or terminate this promotion at any time with or without notice. Time zones are based on our server time (Eastern Standard Time) for determining promotion start and end times.

**Account and Payment:**
A valid account in good standing is required to redeem promotional offers. Accounts flagged for fraudulent activity, policy violations, or abuse may be restricted from using promotional codes. Payment must be processed successfully for the coupon to be applied. Failed or declined payments will invalidate the coupon, requiring re-entry if the payment issue is resolved during the promotional period.

**Modifications and Cancellations:**
We reserve the right to cancel orders that we believe were placed fraudulently or in violation of these terms. Price errors, system glitches, or technical issues that result in incorrect discount applications may be corrected, with affected customers notified promptly. Order modifications after checkout may invalidate promotional discounts if the modified order no longer meets all requirements.

**Legal and Compliance:**
This promotion is void where prohibited by law. Participation in this promotion indicates acceptance of these terms and our general Terms of Service. Disputes related to this promotion shall be resolved according to our standard dispute resolution procedures. We comply with all applicable consumer protection laws and regulations in jurisdictions where we operate.

**Contact and Support:**
Questions about this promotion, technical issues with coupon redemption, or disputes regarding discount applications should be directed to our customer service team. We strive to resolve all promotional inquiries quickly and fairly. Documentation may be required to verify eligibility or resolve disputes.

By using this coupon code, you confirm that you have read, understood, and agree to be bound by these complete terms and conditions. Enjoy your savings and thank you for being a valued customer!
  `.trim();
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
const outputDir = path.join(process.cwd(), 'scripts', 'generated-data');
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
      percentage: coupons.filter(c => c.discountType === 'percentage').length,
      fixedAmount: coupons.filter(c => c.discountType === 'fixed_amount').length,
      freeShipping: coupons.filter(c => c.discountType === 'free_shipping').length,
      buyXGetY: coupons.filter(c => c.discountType === 'buy_x_get_y').length
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
console.log(`\nAverage Product Price: $${summary.stats.averageProductPrice}`);
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
console.log('\nPolicies & Coupons:');
console.log(`  - Active Policies: ${summary.stats.activePolicies}/${summary.counts.policies}`);
console.log(`  - Active Coupons: ${summary.stats.activeCoupons}/${summary.counts.coupons}`);
console.log('\nCoupons by Type:');
console.log(`  - Percentage Off: ${summary.stats.couponsByType.percentage}`);
console.log(`  - Fixed Amount: ${summary.stats.couponsByType.fixedAmount}`);
console.log(`  - Free Shipping: ${summary.stats.couponsByType.freeShipping}`);
console.log(`  - Buy X Get Y: ${summary.stats.couponsByType.buyXGetY}`);
console.log('\n✨ Data generation complete!');
console.log(`📁 Files saved to: ${outputDir}`);
