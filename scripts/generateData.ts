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
      imageUrl: `https://images.unsplash.com/photo-${randomInt(1500000000000, 1700000000000)}`,
      images: Array(randomInt(3, 6)).fill(0).map((_, idx) =>
        `https://images.unsplash.com/photo-${randomInt(1500000000000, 1700000000000)}-${idx}`
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
    `Experience the ${adjective.toLowerCase()} quality of this ${subcategory.toLowerCase()}. Perfect for everyday use with exceptional performance.`,
    `Discover our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}, designed with precision and built to last. A must-have for your ${category.toLowerCase()} collection.`,
    `Elevate your lifestyle with this ${adjective.toLowerCase()} ${subcategory.toLowerCase()}. Combining style, functionality, and reliability.`,
    `This ${adjective.toLowerCase()} ${subcategory.toLowerCase()} sets a new standard in ${category.toLowerCase()}. Crafted for those who demand the best.`,
    `Transform your experience with our ${adjective.toLowerCase()} ${subcategory.toLowerCase()}. Engineered for excellence and designed for you.`
  ];
  return getRandomElement(templates);
}

function generateLongDescription(category: string, subcategory: string, adjective: string, brand: string): string {
  return `
Introducing the ${adjective} ${subcategory} by ${brand}, a revolutionary product that redefines what you can expect from ${category.toLowerCase()} products.

**Superior Design & Construction**
Meticulously crafted with attention to every detail, this ${subcategory.toLowerCase()} combines cutting-edge technology with timeless design principles. The result is a product that not only performs exceptionally but looks stunning in any environment.

**Advanced Features**
Packed with innovative features that make your life easier, this product represents the pinnacle of modern engineering. From intuitive controls to smart connectivity, every aspect has been optimized for the ultimate user experience.

**Uncompromising Quality**
We use only the finest materials and manufacturing processes to ensure that each unit meets our exacting standards. Rigorous quality control testing guarantees that you're getting a product built to last.

**Perfect For**
Whether you're a professional seeking reliable tools or someone who appreciates quality in everyday items, this ${subcategory.toLowerCase()} is designed to exceed your expectations. It's ideal for both personal and professional use.

**Customer Satisfaction**
Join thousands of satisfied customers who have made this their go-to choice. Backed by our comprehensive warranty and world-class customer support, you can purchase with confidence.

**Sustainability Commitment**
${brand} is committed to environmental responsibility. This product is manufactured using sustainable practices and eco-friendly materials wherever possible.

Order today and experience the ${brand} difference!
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

// Write summary
const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    products: products.length,
    reviews: reviews.length,
    tickets: tickets.length
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
console.log('\n✨ Data generation complete!');
console.log(`📁 Files saved to: ${outputDir}`);
