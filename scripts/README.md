# Data Generation Scripts

This directory contains scripts for generating realistic test data for the AI Fabric Framework application.

## Generated Data

The `generateData.ts` script creates comprehensive, realistic e-commerce data including:

### Products (100 items)
- **Categories**: 10 categories (Electronics, Fashion, Home & Kitchen, Sports & Outdoors, Beauty & Personal Care, Toys & Games, Books & Media, Office Supplies, Automotive, Health & Wellness)
- **Full Details**: SKU, title, descriptions, pricing, stock levels
- **Rich Content**: Long marketing descriptions, features, specifications
- **Media**: Multiple image URLs per product
- **Variants**: Colors, sizes (for applicable categories)
- **Metadata**: Weight, dimensions, materials, warranty information
- **Pricing**: Base price with optional compare-at pricing for discounts

### Reviews (200 items - 2 per product)
- **Weighted Ratings**: More realistic distribution favoring positive reviews
- **Rich Content**: Titles and detailed review text
- **User Data**: User IDs, names, verified purchase status
- **Engagement**: Helpful vote counts
- **Timestamps**: Created and updated dates

### Support Tickets (50 items)
- **Realistic Issues**: Order problems, shipping, returns, technical support
- **Ticket Management**: Ticket numbers, priorities, statuses, assignments
- **User Information**: Names, emails, user IDs
- **Categories**: 10 different support categories
- **Status Tracking**: Open, in-progress, waiting-customer, resolved, closed
- **Timestamps**: Created, updated, and resolved dates

## Running the Generator

### Option 1: Generate JSON Files (Local)

Generate data as JSON files for local testing:

```bash
npm run generate-data
```

Or run directly:

```bash
npx tsx scripts/generateData.ts
```

### Option 2: Generate Data via API Calls (Production)

**Recommended**: Create data directly in the production database using API endpoints:

```bash
npm run generate-data-api
```

Or run directly:

```bash
npx tsx scripts/generateDataViaAPI.ts
```

This script will:
1. Create 20 user accounts via `POST /api/accounts`
2. Create 100 products via `POST /api/products`
3. Create 200 reviews (2 per product) via `POST /api/reviews`
4. Create 50 support tickets via `POST /api/tickets`

All data is created through the production API at `https://ai-fabric-framework-production.up.railway.app/api`

## Output Files

All generated data is saved to `scripts/generated-data/`:

- `products.json` - Complete product catalog (~316KB)
- `reviews.json` - Product reviews (~88KB)
- `tickets.json` - Support tickets (~31KB)
- `summary.json` - Statistics and breakdown

## Data Statistics

Based on the latest generation:

- **Total Products**: 100
- **Total Reviews**: 200
- **Total Tickets**: 50
- **Average Product Price**: $445.22
- **Average Review Rating**: 4.1/5.0

### Products by Category
- Electronics: 11 products
- Home & Kitchen: 15 products
- Fashion: 10 products
- Sports & Outdoors: 11 products
- Beauty & Personal Care: 15 products
- Toys & Games: 11 products
- Books & Media: 4 products
- Office Supplies: 6 products
- Automotive: 7 products
- Health & Wellness: 10 products

### Tickets by Status
- Open: 9 tickets
- In Progress: 10 tickets
- Waiting Customer: 9 tickets
- Resolved: 10 tickets
- Closed: 12 tickets

## Using the Generated Data

### Import into API

You can use these JSON files to seed your backend database or API. The data structure matches the interfaces used throughout the application.

### Sample Product Structure

```typescript
{
  id: "prod_0001",
  sku: "SKU-CRE-12366",
  title: "Durable Tools - CreativeMinds",
  description: "Short marketing description...",
  longDescription: "Full detailed description with features...",
  category: "Beauty & Personal Care",
  subcategory: "Tools",
  brand: "CreativeMinds",
  price: 96.14,
  compareAtPrice: 120.175,
  inStock: true,
  stockQuantity: 39,
  rating: 3.5,
  reviewCount: 2,
  features: [...],
  specifications: {...},
  // ... more fields
}
```

### Sample Review Structure

```typescript
{
  id: "rev_0001",
  productId: "prod_0001",
  userId: "user_2099",
  userName: "Jessica Williams",
  rating: 5,
  title: "Best Purchase Ever!",
  text: "Full review text...",
  helpful: 4,
  verified: true,
  createdAt: "2026-01-08T22:50:57.734Z",
  updatedAt: "2025-12-04T22:50:57.734Z"
}
```

### Sample Ticket Structure

```typescript
{
  id: "tick_0001",
  ticketNumber: "TKT-950180",
  userId: "user_6309",
  userName: "Emily Rodriguez",
  userEmail: "emily.rodriguez@email.com",
  subject: "Product not working as expected",
  description: "Detailed description of the issue...",
  category: "Shipping",
  priority: "high",
  status: "open",
  tags: ["urgent", "shipping", "payment"],
  createdAt: "2025-12-30T22:50:57.735Z",
  updatedAt: "2026-01-24T22:50:57.735Z"
}
```

## Customization

To customize the data generation:

1. Edit `generateData.ts`
2. Modify the data pools (categories, brands, adjectives, etc.)
3. Adjust the generation functions for different content
4. Change the counts in the main execution section
5. Run the script to regenerate data

## Notes

- All data is randomly generated and realistic for testing purposes
- Product IDs, SKUs, and other identifiers are unique
- Timestamps are varied across a realistic date range
- Reviews are linked to products via `productId`
- Image URLs are placeholder Unsplash URLs (random IDs)
