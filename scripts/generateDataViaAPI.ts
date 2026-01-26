import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Configuration
const API_BASE_URL = 'https://ai-fabric-framework-production.up.railway.app/api';
const BATCH_SIZE = 10; // Process in batches to avoid overwhelming the API
const DELAY_MS = 500; // Delay between batches

// Interfaces
interface Account {
  userId: string;
  name: string;
  email: string;
}

interface ProductCreate {
  sku: string;
  name: string;
  description: string;
  price: number;
}

interface ReviewCreate {
  userId: string;
  productId?: string;
  sku?: string;
  rating?: number;
  text: string;
}

interface TicketCreate {
  userId: string;
  issueType: string;
  description: string;
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Data pools
const categories = [
  { name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Wearables', 'Accessories'] },
  { name: 'Home & Kitchen', subcategories: ['Appliances', 'Cookware', 'Furniture', 'Bedding', 'Storage', 'Decor', 'Lighting'] },
  { name: 'Fashion', subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Watches', 'Bags'] },
  { name: 'Sports & Outdoors', subcategories: ['Fitness', 'Camping', 'Cycling', 'Water Sports', 'Team Sports', 'Outdoor Gear', 'Athletic Wear'] },
  { name: 'Beauty & Personal Care', subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Tools', 'Men\'s Grooming', 'Bath & Body'] },
];

const brands = [
  'TechPro', 'HomeEssentials', 'StyleCraft', 'ActiveLife', 'BeautyFirst',
  'SmartChoice', 'PremiumPlus', 'EcoLiving', 'UrbanStyle', 'NatureBest'
];

const adjectives = [
  'Premium', 'Professional', 'Deluxe', 'Ultra', 'Advanced', 'Smart', 'Eco-Friendly',
  'Portable', 'Wireless', 'Compact', 'Durable', 'Lightweight', 'Stylish', 'Modern'
];

const userNames = [
  'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Williams',
  'James Brown', 'Amanda Lee', 'Christopher Davis', 'Ashley Martinez', 'Matthew Wilson',
  'Jennifer Taylor', 'Daniel Anderson', 'Lisa Thomas', 'Robert Jackson', 'Michelle White',
  'Kevin Harris', 'Laura Martin', 'Brian Thompson', 'Nicole Garcia', 'Steven Martinez'
];

const ticketIssueTypes = [
  'Order Issue', 'Shipping', 'Product Quality', 'Returns & Refunds', 'Account',
  'Payment', 'Technical Support', 'Product Information', 'Website Issue', 'Other'
];

// API functions using curl
async function curlPost(endpoint: string, data: any): Promise<any> {
  const jsonData = JSON.stringify(data).replace(/'/g, "'\\''");
  const command = `curl -s -X POST "${API_BASE_URL}${endpoint}" \\
    -H "Content-Type: application/json" \\
    -d '${jsonData}'`;

  const { stdout, stderr } = await execPromise(command);

  if (stderr) {
    throw new Error(`curl error: ${stderr}`);
  }

  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Failed to parse response: ${stdout}`);
  }
}

async function createAccount(account: Account): Promise<any> {
  return await curlPost('/accounts', account);
}

async function createProduct(product: ProductCreate): Promise<any> {
  return await curlPost('/products', product);
}

async function createReview(review: ReviewCreate): Promise<any> {
  return await curlPost('/reviews', review);
}

async function createTicket(ticket: TicketCreate): Promise<any> {
  return await curlPost('/tickets', ticket);
}

// Data generation functions
function generateAccounts(count: number): Account[] {
  const accounts: Account[] = [];

  for (let i = 0; i < count; i++) {
    const userName = userNames[i % userNames.length];
    const emailName = userName.toLowerCase().replace(/\s+/g, '.');

    accounts.push({
      userId: `user_${String(i + 1).padStart(4, '0')}`,
      name: userName,
      email: `${emailName}${i > userNames.length - 1 ? i : ''}@example.com`
    });
  }

  return accounts;
}

function generateProductsData(count: number): ProductCreate[] {
  const products: ProductCreate[] = [];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const subcategory = getRandomElement(category.subcategories);
    const brand = getRandomElement(brands);
    const adjective = getRandomElement(adjectives);

    const product: ProductCreate = {
      sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${randomInt(10000, 99999)}`,
      name: `${adjective} ${subcategory.replace(/'/g, '')} - ${brand}`,
      description: `Experience the ${adjective.toLowerCase()} quality of this ${subcategory.toLowerCase()}. Perfect for everyday use with exceptional performance. Combining style, functionality, and reliability in one outstanding product.`,
      price: randomFloat(9.99, 999.99)
    };

    products.push(product);
  }

  return products;
}

function generateReviewText(rating: number, productName: string): string {
  const positiveTemplates = [
    `I've been using this ${productName} for a few weeks now and I'm extremely impressed. The quality is outstanding and it performs exactly as described. Highly recommend!`,
    `This is exactly what I was looking for! The product exceeded my expectations in every way. Great value for money.`,
    `Absolutely love this purchase! The build quality is excellent and it looks even better in person. Worth every penny.`,
    `Best product I've purchased in a long time. It's well-made, functional, and stylish. Very satisfied with my purchase.`,
  ];

  const neutralTemplates = [
    `The ${productName} is decent for the price. It does what it's supposed to do, though there are a few minor issues. Overall, it's acceptable.`,
    `It's an okay product. Nothing spectacular but gets the job done. Would recommend if you're on a budget.`,
    `Mixed feelings about this one. Some features are great, others could use improvement. It's good enough for everyday use.`,
  ];

  const negativeTemplates = [
    `Unfortunately, this didn't meet my expectations. The quality isn't as good as advertised and I've had some issues with it.`,
    `Disappointed with this purchase. It looks good but the performance is lacking. Expected more for the price.`,
    `Not impressed. The ${productName} feels cheaply made and doesn't work as well as I hoped. Would not buy again.`,
  ];

  if (rating >= 4) return getRandomElement(positiveTemplates);
  if (rating === 3) return getRandomElement(neutralTemplates);
  return getRandomElement(negativeTemplates);
}

function generateTicketDescription(issueType: string): string {
  const descriptions: Record<string, string[]> = {
    'Order Issue': [
      'I placed an order over a week ago and still have not received it. The tracking shows it was delivered but I never got the package. Can you please help me locate it or send a replacement?',
      'I ordered the blue version but received the red one instead. I need to exchange it for the correct color as soon as possible.',
      'The product seems to be missing some essential parts mentioned in the manual. Could you send the missing components?'
    ],
    'Shipping': [
      'My tracking number has not updated in 5 days. Can you check the status of my shipment?',
      'My order was supposed to arrive yesterday but there has been a delay. When can I expect delivery?',
      'Do you ship to my country? The checkout will not let me select my shipping address.'
    ],
    'Product Quality': [
      'The product arrived damaged. The box was in good condition but the item inside has visible scratches and dents. I would like to return it for a refund or exchange.',
      'The product quality is not as expected. It feels cheap and flimsy. Very disappointed.',
      'I received my order but the product does not work as described. I have tried troubleshooting but no luck. Please advise on next steps.'
    ],
    'Returns & Refunds': [
      'I would like to return this item as it does not meet my needs. What is the return process and will I get a full refund?',
      'The color in person is completely different from the website photos. I want to return this.',
      'I ordered the large size but it fits like a medium. I need to return this for the correct size.'
    ],
    'Payment': [
      'I was charged twice for my order. Please refund the duplicate payment immediately.',
      'I tried using the discount code from your email but it says it is invalid. Can you help?',
      'My payment was declined but I was still charged. Please investigate.'
    ],
    'Technical Support': [
      'I need to file a warranty claim. The product stopped working after just 2 months of use.',
      'Can you provide detailed installation instructions? The manual that came with it is unclear.',
      'Will this product work with my existing setup? I need compatibility information before installing.'
    ],
    'Account': [
      'I cannot log into my account. Password reset is not working either. Need urgent help.',
      'I need to update my email address but the system will not let me.',
      'My account has been locked and I do not know why. Please help me regain access.'
    ],
    'Other': [
      'I have a general question about your products and services.',
      'The website keeps giving me an error when I try to checkout.',
      'I need to order 50 units for my business. Do you offer bulk discounts?'
    ]
  };

  const typeDescriptions = descriptions[issueType] || descriptions['Other'];
  return getRandomElement(typeDescriptions);
}

// Batch processing function
async function processBatch<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize: number,
  delayMs: number,
  label: string
): Promise<R[]> {
  const results: R[] = [];
  const batches = Math.ceil(items.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, items.length);
    const batch = items.slice(start, end);

    console.log(`  Processing ${label} batch ${i + 1}/${batches} (${start + 1}-${end} of ${items.length})...`);

    const batchResults = await Promise.allSettled(
      batch.map(item => processFn(item))
    );

    let successCount = 0;
    let failCount = 0;

    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
        successCount++;
      } else {
        failCount++;
        const errorMsg = result.reason?.message || String(result.reason);
        console.error(`    ❌ Failed to create ${label} ${start + idx + 1}: ${errorMsg.substring(0, 100)}`);
      }
    });

    console.log(`    ✅ Success: ${successCount}, ❌ Failed: ${failCount}`);

    if (i < batches - 1) {
      await sleep(delayMs);
    }
  }

  return results;
}

// Main execution
async function main() {
  console.log('🚀 Starting API-based data generation...\n');
  console.log(`📡 API Base URL: ${API_BASE_URL}\n`);

  try {
    // Step 1: Create Accounts
    console.log('👥 Step 1: Creating user accounts...');
    const accountsToCreate = generateAccounts(20);
    const createdAccounts = await processBatch(
      accountsToCreate,
      createAccount,
      BATCH_SIZE,
      DELAY_MS,
      'account'
    );
    console.log(`✅ Created ${createdAccounts.length}/${accountsToCreate.length} accounts\n`);

    // Step 2: Create Products
    console.log('📦 Step 2: Creating products...');
    const productsToCreate = generateProductsData(100);
    const createdProducts = await processBatch(
      productsToCreate,
      createProduct,
      BATCH_SIZE,
      DELAY_MS,
      'product'
    );
    console.log(`✅ Created ${createdProducts.length}/${productsToCreate.length} products\n`);

    // Step 3: Create Reviews
    console.log('⭐ Step 3: Creating reviews...');
    const reviewsToCreate: ReviewCreate[] = [];

    // Create 2 reviews per product
    createdProducts.forEach((product: any) => {
      for (let i = 0; i < 2; i++) {
        const userId = createdAccounts[randomInt(0, createdAccounts.length - 1)]?.userId || `user_${randomInt(1, 20)}`;
        const rating = Math.random() < 0.7 ? (Math.random() < 0.6 ? 5 : 4) : randomInt(1, 5);

        reviewsToCreate.push({
          userId,
          sku: product.sku,
          rating,
          text: generateReviewText(rating, product.name)
        });
      }
    });

    const createdReviews = await processBatch(
      reviewsToCreate,
      createReview,
      BATCH_SIZE,
      DELAY_MS,
      'review'
    );
    console.log(`✅ Created ${createdReviews.length}/${reviewsToCreate.length} reviews\n`);

    // Step 4: Create Support Tickets
    console.log('🎫 Step 4: Creating support tickets...');
    const ticketsToCreate: TicketCreate[] = [];

    for (let i = 0; i < 50; i++) {
      const userId = createdAccounts[randomInt(0, createdAccounts.length - 1)]?.userId || `user_${randomInt(1, 20)}`;
      const issueType = getRandomElement(ticketIssueTypes);

      ticketsToCreate.push({
        userId,
        issueType,
        description: generateTicketDescription(issueType)
      });
    }

    const createdTickets = await processBatch(
      ticketsToCreate,
      createTicket,
      BATCH_SIZE,
      DELAY_MS,
      'ticket'
    );
    console.log(`✅ Created ${createdTickets.length}/${ticketsToCreate.length} tickets\n`);

    // Summary
    console.log('📊 Summary:');
    console.log('─'.repeat(50));
    console.log(`Total Accounts Created: ${createdAccounts.length}/${accountsToCreate.length}`);
    console.log(`Total Products Created: ${createdProducts.length}/${productsToCreate.length}`);
    console.log(`Total Reviews Created: ${createdReviews.length}/${reviewsToCreate.length}`);
    console.log(`Total Tickets Created: ${createdTickets.length}/${ticketsToCreate.length}`);
    console.log('\n✨ Data generation complete!');

  } catch (error) {
    console.error('❌ Fatal error during data generation:', error);
    process.exit(1);
  }
}

// Run the script
main();
