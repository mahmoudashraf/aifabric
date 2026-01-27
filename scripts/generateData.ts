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
    const productId = `prod_${String(i + 1).padStart(4, '0')}`;

    const product: Product = {
      id: productId,
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
      imageUrl: `https://picsum.photos/seed/${productId}/800/600`,
      images: Array(randomInt(3, 6)).fill(0).map((_, idx) =>
        `https://picsum.photos/seed/${productId}-${idx}/800/600`
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
    `Experience the ${adjective.toLowerCase()} quality of this exceptional ${subcategory.toLowerCase()} that has been meticulously crafted to deliver outstanding performance in every aspect. Perfect for everyday use, this product combines cutting-edge innovation with practical functionality, making it an indispensable addition to your ${category.toLowerCase()} collection. Whether you're a professional seeking reliable equipment or an enthusiast who appreciates superior craftsmanship, this ${subcategory.toLowerCase()} will exceed your expectations with its remarkable durability, elegant design, and user-friendly features that make it stand out from the competition.`,
    `Discover our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}, expertly designed with meticulous precision and built to withstand the test of time. This remarkable product represents the perfect fusion of form and function, offering unparalleled performance that adapts seamlessly to your needs. A must-have for your ${category.toLowerCase()} collection, it features innovative technologies and thoughtful design elements that enhance usability while maintaining aesthetic appeal. From its robust construction to its intuitive interface, every detail has been carefully considered to provide you with an exceptional experience that delivers consistent, reliable results day after day.`,
    `Elevate your lifestyle with this ${adjective.toLowerCase()} ${subcategory.toLowerCase()} that masterfully combines sophisticated style, practical functionality, and unwavering reliability in one impressive package. Designed for discerning customers who refuse to compromise on quality, this product showcases superior engineering and attention to detail that sets it apart from ordinary alternatives. Its versatile design adapts to various applications while maintaining peak performance, making it the ideal choice for both professional and personal use. Experience the difference that premium materials and expert craftsmanship can make in transforming your daily routine into something truly extraordinary.`,
    `This ${adjective.toLowerCase()} ${subcategory.toLowerCase()} sets an entirely new standard in the ${category.toLowerCase()} industry, redefining what customers can expect from premium products. Meticulously crafted for those who demand nothing but the best, it delivers exceptional performance through innovative features and cutting-edge technology. The thoughtful design addresses real-world challenges while maintaining an elegant aesthetic that complements any environment. Built with premium materials and subjected to rigorous quality control testing, this product represents a long-term investment in excellence that will continue to deliver outstanding results for years to come.`,
    `Transform your experience with our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}, expertly engineered for excellence and thoughtfully designed with your unique needs in mind. This outstanding product showcases the perfect balance between advanced functionality and intuitive usability, making complex tasks simple and everyday activities more efficient. Backed by years of research and development, it incorporates the latest innovations to deliver performance that consistently exceeds industry standards. From its durable construction to its sleek appearance, every aspect reflects our commitment to creating products that enhance your life while providing exceptional value and lasting satisfaction.`
  ];
  return getRandomElement(templates);
}

function generateLongDescription(category: string, subcategory: string, adjective: string, brand: string): string {
  return `
Introducing the ${adjective} ${subcategory} by ${brand}, a truly revolutionary product that completely redefines what you can expect from ${category.toLowerCase()} products in today's competitive marketplace. This exceptional offering represents years of dedicated research, development, and refinement to create something that not only meets but dramatically exceeds the expectations of even the most discerning customers.

**Superior Design & Construction**
Meticulously crafted with unwavering attention to every single detail, this premium ${subcategory.toLowerCase()} seamlessly combines cutting-edge technology with timeless design principles that have proven effective across generations. The result is a remarkable product that not only performs exceptionally well in all conditions but also looks absolutely stunning in any environment, whether that's a professional office setting, a modern home, or an active outdoor location. Every curve, every button, every surface has been thoughtfully designed to provide both aesthetic pleasure and functional excellence.

**Advanced Features & Capabilities**
Packed with innovative features and capabilities that genuinely make your life easier and more productive, this product represents the absolute pinnacle of modern engineering excellence. From intuitive controls that require no learning curve to smart connectivity options that seamlessly integrate with your existing ecosystem, every aspect has been carefully optimized for the ultimate user experience. Advanced sensors, intelligent automation, and responsive interfaces work together harmoniously to anticipate your needs and deliver consistent, reliable performance that you can depend on day after day.

**Uncompromising Quality & Durability**
We use only the finest premium materials and state-of-the-art manufacturing processes to ensure that each and every unit meets our exacting quality standards without exception. Rigorous quality control testing at multiple stages of production guarantees that you're getting a product genuinely built to last for years of dependable service. Every component is carefully inspected, every connection is verified, and every unit undergoes comprehensive testing before it earns the ${brand} seal of approval and ships to your door.

**Perfect For Every Need**
Whether you're a seasoned professional seeking reliable, high-performance tools that won't let you down during critical moments, or someone who simply appreciates quality and craftsmanship in everyday items, this ${subcategory.toLowerCase()} is specifically designed to exceed your expectations in every possible way. It's the ideal choice for both demanding professional applications and personal use, adapting effortlessly to whatever challenges you present while maintaining peak performance throughout.

**Customer Satisfaction Guaranteed**
Join thousands of satisfied customers worldwide who have made this their go-to choice for ${category.toLowerCase()} needs and have experienced the difference that true quality makes. Backed by our comprehensive warranty program and world-class customer support team that's available whenever you need assistance, you can purchase with complete confidence knowing that we stand behind every product we sell and are committed to your total satisfaction.

**Environmental Responsibility**
${brand} is deeply committed to environmental responsibility and sustainable business practices. This product is manufactured using carefully selected sustainable practices and eco-friendly materials wherever possible, without compromising on quality or performance. We believe that exceptional products and environmental stewardship can and should go hand in hand.

**Innovation & Technology**
Incorporating the latest technological innovations and breakthrough features, this ${subcategory.toLowerCase()} represents the cutting edge of what's possible in ${category.toLowerCase()} today. From energy-efficient operation that reduces your environmental footprint to smart features that enhance usability and convenience, every innovation serves a practical purpose.

Order today and experience the remarkable ${brand} difference for yourself! Transform the way you work, play, and live with a product that truly understands and exceeds your needs.
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
