# 👨‍💻 The Developer's Deep Dive: Mastering AI Annotations in 15 Minutes

*Everything you need to know to implement semantic search—code examples, gotchas, and the patterns that actually work*

🚧 **Under active development | Q1 2026 release | Built by developers, for developers**

---

## TL;DR for Impatient Developers

```java
@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AISearchable   // Users can FIND by this (embedded, searchable)
    private String name;
    
    @AISearchable   // Rich text? AI finds by meaning
    private String description;
    
    @AIContext      // AI KNOWS this (metadata, not embedded)
    private BigDecimal price;
}

@AIProcess(entityType = "product", processType = "create")
public Product create(Product p) {
    return repo.save(p);
    // Done. Framework handles embedding, vector DB, retries.
}
```

**That's the whole API.** Now let's go deep.

---

## The 4 Annotations (Complete Reference)

### 1. `@AICapable` — Class Level

**Purpose:** "This entity is AI-enabled. Scan it for field annotations."

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AICapable {
    
    String entityType();                              // REQUIRED: Unique identifier
    
    IndexingStrategy indexingStrategy() 
        default IndexingStrategy.ASYNC;               // Default: background processing
    
    IndexingStrategy onCreateStrategy() 
        default IndexingStrategy.AUTO;                // Override for creates
    
    IndexingStrategy onUpdateStrategy() 
        default IndexingStrategy.AUTO;                // Override for updates
    
    IndexingStrategy onDeleteStrategy() 
        default IndexingStrategy.AUTO;                // Override for deletes
}
```

**Usage patterns:**

```java
// Minimal (recommended for most cases)
@AICapable(entityType = "product")
public class Product { }

// Full control
@AICapable(
    entityType = "product",
    indexingStrategy = IndexingStrategy.ASYNC,    // Default for all ops
    onCreateStrategy = IndexingStrategy.SYNC,     // New products searchable immediately
    onDeleteStrategy = IndexingStrategy.SYNC      // Deletes reflected immediately
)
public class Product { }

// High-frequency updates (don't reindex every save)
@AICapable(
    entityType = "sensor-reading",
    indexingStrategy = IndexingStrategy.BATCH     // Batch index hourly
)
public class SensorReading { }
```

---

### 2. `@AISearchable` — Field Level

**Purpose:** "Users can FIND this entity by searching for content similar to this field."

**What happens:**
- ✅ Field value included in embedding vector (for similarity search)
- ✅ Field value stored in `AISearchableEntity.searchableContent`
- ✅ Field value included in LLM context during RAG

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AISearchable { }
```

**When to use:**

```java
@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AISearchable   // "bluetooth speakers" finds "wireless audio device"
    private String name;
    
    @AISearchable   // "eco-friendly" finds "sustainable, biodegradable"
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @AISearchable   // "electronics" helps filter results
    private String category;
    
    @AISearchable   // User reviews contain rich semantic content
    private String topReviews;
}
```

**Mental model:**

> "Can a user FIND this product by searching for words *similar to* this field's content?"
> 
> If yes → `@AISearchable`

---

### 3. `@AIContext` — Field Level

**Purpose:** "The AI needs to KNOW this value when generating responses, but users shouldn't find entities by searching for it."

**What happens:**
- ❌ NOT included in embedding vector (no semantic search)
- ✅ Stored in `AISearchableEntity.metadata` as JSON
- ✅ Included in LLM context during RAG

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AIContext { }
```

**When to use:**

```java
@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AIContext      // LLM can answer: "How much does it cost?"
    private BigDecimal price;
    
    @AIContext      // LLM can answer: "Is it in stock?"
    private Boolean inStock;
    
    @AIContext      // LLM can answer: "Is it highly rated?"
    private Double rating;
    
    @AIContext      // LLM can answer: "What brand is it?"
    private String brand;
    
    @AIContext      // Enables filtering: "Show only free shipping"
    private Boolean freeShipping;
}
```

**Mental model:**

> "Does the AI need to KNOW this value when answering questions about this entity?"
> 
> If yes → `@AIContext`

**Note:** Searching for "29.99" won't find products priced at $29.99. But if a user finds a product and asks "How much is it?", the AI knows.

---

### 4. `@AIProcess` — Method Level

**Purpose:** "When this method executes, trigger AI processing on the returned entity."

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AIProcess {
    
    String entityType() default "";           // Can infer from return type
    
    String processType() default "create";    // "create", "update", "delete"
    
    boolean generateEmbedding() default true; // Generate embedding?
    
    boolean indexForSearch() default true;    // Index in vector DB?
    
    IndexingStrategy indexingStrategy() 
        default IndexingStrategy.AUTO;        // Override strategy
}
```

**Usage patterns:**

```java
@Service
public class ProductService {
    
    // Create — full processing
    @AIProcess(entityType = "product", processType = "create")
    @Transactional
    public Product create(Product product) {
        return repository.save(product);
    }
    
    // Update — full processing (re-embed)
    @AIProcess(entityType = "product", processType = "update")
    @Transactional
    public Product update(Product product) {
        return repository.save(product);
    }
    
    // Delete — no embedding needed, just remove from index
    @AIProcess(
        entityType = "product", 
        processType = "delete",
        generateEmbedding = false,
        indexForSearch = false
    )
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    // Bulk import — batch for performance
    @AIProcess(
        entityType = "product",
        processType = "create",
        indexingStrategy = IndexingStrategy.BATCH
    )
    @Transactional
    public List<Product> bulkImport(List<Product> products) {
        return repository.saveAll(products);
    }
    
    // Price-only update — don't regenerate embedding
    @AIProcess(
        entityType = "product",
        processType = "update",
        generateEmbedding = false  // Price is @AIContext, not @AISearchable
    )
    @Transactional
    public Product updatePrice(Long id, BigDecimal newPrice) {
        Product product = repository.findById(id).orElseThrow();
        product.setPrice(newPrice);
        return repository.save(product);
    }
}
```

---

## Indexing Strategies (When Things Happen)

```java
public enum IndexingStrategy {
    AUTO,   // Inherit from parent (@AICapable or framework default)
    SYNC,   // Immediate, blocking (request waits for indexing)
    ASYNC,  // Background, non-blocking (request returns immediately)
    BATCH   // Scheduled batch processing (high volume)
}
```

### Resolution Order

```
@AIProcess.indexingStrategy
    ↓ if AUTO
@AICapable.onCreateStrategy (or onUpdate/onDelete based on processType)
    ↓ if AUTO
@AICapable.indexingStrategy
    ↓ if not set
Framework Default (ASYNC)
```

### When to Use Each

| Strategy | Use When | Latency Impact | Consistency |
|----------|----------|----------------|-------------|
| `SYNC` | Critical data must be searchable immediately | +200-500ms | Strong |
| `ASYNC` | Normal operations, good UX | +10ms | Eventual (1-5s) |
| `BATCH` | Bulk imports, high-frequency updates | +0ms | Eventual (batch window) |

**Example: E-commerce product launch**

```java
@AICapable(
    entityType = "product",
    indexingStrategy = IndexingStrategy.ASYNC,      // Default: background
    onCreateStrategy = IndexingStrategy.SYNC        // BUT: new products immediate
)
public class Product {
    // New products must be searchable for launch day
    // Updates can be eventually consistent
}
```

---

## The Data Model (What Gets Stored)

When you save an entity, the framework creates an `AISearchableEntity`:

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR ENTITY                                                     │
├─────────────────────────────────────────────────────────────────┤
│  @Entity                                                        │
│  @AICapable(entityType = "product")                             │
│  public class Product {                                         │
│      @Id Long id = 123;                                         │
│      @AISearchable String name = "Bamboo Toothbrush";           │
│      @AISearchable String description = "Eco-friendly...";      │
│      @AIContext BigDecimal price = 29.99;                       │
│      @AIContext String brand = "EcoLife";                       │
│      String sku = "SKU-123";  // not annotated                  │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AISearchableEntity (framework entity)                           │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    id: <generated>,                                             │
│    entityType: "product",                                       │
│    entityId: "123",                                             │
│    searchableContent: "Bamboo Toothbrush Eco-friendly...",      │
│    metadata: {                                                  │
│      "price": 29.99,                                            │
│      "brand": "EcoLife"                                         │
│    },                                                           │
│    vectorId: "vec-abc-123",                                     │
│    createdAt: <timestamp>,                                      │
│    updatedAt: <timestamp>                                       │
│  }                                                              │
│                                                                  │
│  Note: "sku" is NOT stored (not annotated)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vector Database (Qdrant, Pinecone, etc.)                        │
├─────────────────────────────────────────────────────────────────┤
│  {                                                              │
│    id: "vec-abc-123",                                           │
│    vector: [0.023, -0.156, 0.891, 0.234, ...],  // 384 dims    │
│    payload: {                                                   │
│      entityType: "product",                                     │
│      entityId: "123"                                            │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Common Patterns

### Pattern 1: Rich Text Entity

```java
@Entity
@AICapable(entityType = "article")
public class Article {
    
    @Id
    private Long id;
    
    @AISearchable
    private String title;
    
    @AISearchable
    @Column(columnDefinition = "TEXT")  // Long content
    private String content;
    
    @AISearchable
    private String summary;
    
    @AISearchable
    private String tags;  // "ai, machine-learning, tutorial"
    
    @AIContext
    private LocalDateTime publishedAt;
    
    @AIContext
    private String author;
    
    @AIContext
    private Integer viewCount;
}
```

### Pattern 2: E-Commerce Product

```java
@Entity
@AICapable(entityType = "product")
public class Product {
    
    @Id
    private Long id;
    
    // Searchable content (embedded)
    @AISearchable private String name;
    @AISearchable private String description;
    @AISearchable private String category;
    @AISearchable private String features;  // "waterproof, portable, 10hr battery"
    
    // Contextual metadata (not embedded)
    @AIContext private BigDecimal price;
    @AIContext private Double rating;
    @AIContext private Integer reviewCount;
    @AIContext private Boolean inStock;
    @AIContext private String brand;
    @AIContext private String color;
    
    // Internal (not in AI system)
    private String sku;
    private BigDecimal costPrice;  // Sensitive!
}
```

### Pattern 3: Support Ticket

```java
@Entity
@AICapable(entityType = "support-ticket")
public class SupportTicket {
    
    @Id
    private Long id;
    
    // Searchable (find similar issues)
    @AISearchable private String subject;
    @AISearchable private String issueDescription;
    @AISearchable private String resolution;  // GOLD: solutions are searchable
    @AISearchable private String errorMessages;
    
    // Context (AI knows for recommendations)
    @AIContext private String status;
    @AIContext private String priority;
    @AIContext private Duration resolutionTime;
    @AIContext private String resolutionType;  // "bug_fix", "config", "docs"
    
    // NEVER in AI (privacy)
    private String customerId;
    private String customerEmail;
}
```

### Pattern 4: Multi-Language Content

```java
@Entity
@AICapable(entityType = "product")
public class Product {
    
    @Id
    private Long id;
    
    // All languages searchable (embeddings work cross-language!)
    @AISearchable private String nameEn;
    @AISearchable private String nameFr;
    @AISearchable private String nameEs;
    
    @AISearchable private String descriptionEn;
    @AISearchable private String descriptionFr;
    @AISearchable private String descriptionEs;
    
    @AIContext private String primaryLanguage;
    @AIContext private BigDecimal price;
}
```

---

## Testing Your Implementation

### Unit Test: Annotation Scanning

```java
@Test
void shouldDetectAnnotations() {
    // Use reflection to verify your annotations
    Class<Product> clazz = Product.class;
    
    // Entity is AI-capable
    assertTrue(clazz.isAnnotationPresent(AICapable.class));
    assertEquals("product", 
        clazz.getAnnotation(AICapable.class).entityType());
    
    // Fields are correctly annotated
    Field nameField = clazz.getDeclaredField("name");
    assertTrue(nameField.isAnnotationPresent(AISearchable.class));
    
    Field priceField = clazz.getDeclaredField("price");
    assertTrue(priceField.isAnnotationPresent(AIContext.class));
    
    Field skuField = clazz.getDeclaredField("sku");
    assertFalse(skuField.isAnnotationPresent(AISearchable.class));
    assertFalse(skuField.isAnnotationPresent(AIContext.class));
}
```

### Integration Test: Search Works

```java
@SpringBootTest
class ProductSearchIntegrationTest {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private SemanticSearchService searchService;
    
    @Test
    void shouldFindProductByMeaning() {
        // Create product
        Product product = new Product();
        product.setName("ErgoPro Executive Chair");
        product.setDescription("Premium lumbar support for all-day comfort");
        product.setPrice(new BigDecimal("299.99"));
        
        productService.create(product);
        
        // Wait for async indexing
        await().atMost(5, TimeUnit.SECONDS).until(() -> {
            List<Product> results = searchService.semanticSearch(
                "comfortable office chair",  // Different words!
                "product",
                10
            );
            return !results.isEmpty();
        });
        
        // Search by meaning (not keywords)
        List<Product> results = searchService.semanticSearch(
            "comfortable office chair",
            "product",
            10
        );
        
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getName()).contains("ErgoPro");
    }
}
```

---

## Gotchas & Best Practices

### ✅ DO

```java
// 1. Always specify entityType
@AICapable(entityType = "product")  // Unique identifier

// 2. Use @AISearchable for text with semantic meaning
@AISearchable
private String description;  // Rich text, natural language

// 3. Use @AIContext for structured data the AI needs
@AIContext
private BigDecimal price;  // Numbers, dates, booleans

// 4. Disable unnecessary processing on delete
@AIProcess(processType = "delete", generateEmbedding = false)

// 5. Use BATCH for bulk operations
@AIProcess(indexingStrategy = IndexingStrategy.BATCH)
public List<Product> bulkImport(List<Product> products)

// 6. Keep sensitive data OUT of AI system
private String internalNotes;  // Not annotated = not indexed
```

### ❌ DON'T

```java
// 1. Don't forget entityType
@AICapable  // ❌ Missing entityType!

// 2. Don't use @AISearchable for non-semantic data
@AISearchable
private BigDecimal price;  // ❌ Numbers aren't "searchable by meaning"

// 3. Don't over-annotate
@AISearchable  // Every field?
@AIContext     // Both on everything?
private String name;  // ❌ Pick one based on purpose

// 4. Don't use SYNC everywhere
@AICapable(indexingStrategy = IndexingStrategy.SYNC)  // ❌ +500ms per request

// 5. Don't put @AIProcess on classes
@AIProcess  // ❌ This goes on METHODS!
public class Product { }

// 6. Don't index sensitive data
@AISearchable
private String customerId;  // ❌ PII! Don't annotate
```

---

## Advanced: YAML Override (Optional)

**When you need fine-tuned control without code changes:**

```yaml
# ai-entity-config.yml
ai-entities:
  product:
    searchable-fields:
      - name: "name"
        weight: 2.0           # Title 2x more important
      - name: "description"
        weight: 1.0
        include-in-rag: true
      - name: "category"
        weight: 0.5           # Less important
        
    metadata-fields:
      - name: "price"
        type: "NUMERIC"
        include-in-search: true  # Enable price range filtering
      - name: "brand"
        type: "TEXT"
        include-in-search: true  # Enable brand filtering
```

**When to use YAML vs annotations:**

| Scenario | Use |
|----------|-----|
| Field is searchable | `@AISearchable` annotation |
| Field is context | `@AIContext` annotation |
| Need custom weight | YAML override |
| Need to change per environment | YAML override |
| Need to exclude from RAG | YAML override |

---

## Debugging Tips

### 1. Check what's being indexed

```java
@Autowired
private AISearchableEntityRepository repo;

// Find what was indexed for a product
Optional<AISearchableEntity> indexed = repo
    .findByEntityTypeAndEntityId("product", productId.toString());

if (indexed.isPresent()) {
    System.out.println("Searchable: " + indexed.get().getSearchableContent());
    System.out.println("Metadata: " + indexed.get().getMetadata());
    System.out.println("Vector ID: " + indexed.get().getVectorId());
}
```

### 2. Test embedding similarity

```java
@Autowired
private EmbeddingService embeddingService;

float[] queryEmbedding = embeddingService.embed("comfortable chair");
float[] productEmbedding = embeddingService.embed("ergonomic lumbar support");

double similarity = cosineSimilarity(queryEmbedding, productEmbedding);
System.out.println("Similarity: " + similarity);  // Should be > 0.8
```

### 3. Verify annotations at runtime

```java
@PostConstruct
public void verifyAnnotations() {
    for (Class<?> entityClass : getAICapableEntities()) {
        AICapable aiCapable = entityClass.getAnnotation(AICapable.class);
        log.info("Entity: {} -> type: {}", 
            entityClass.getSimpleName(), 
            aiCapable.entityType());
        
        for (Field field : entityClass.getDeclaredFields()) {
            if (field.isAnnotationPresent(AISearchable.class)) {
                log.info("  @AISearchable: {}", field.getName());
            }
            if (field.isAnnotationPresent(AIContext.class)) {
                log.info("  @AIContext: {}", field.getName());
            }
        }
    }
}
```

---

## The Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│  ANNOTATION QUICK REFERENCE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  @AICapable(entityType = "...")                                 │
│  └── Class: "This entity is AI-enabled"                         │
│                                                                  │
│  @AISearchable                                                  │
│  └── Field: "Users can FIND by this" (embedded + searchable)    │
│      Use for: name, description, content, tags, features        │
│                                                                  │
│  @AIContext                                                     │
│  └── Field: "AI needs to KNOW this" (metadata, not embedded)    │
│      Use for: price, rating, date, status, brand, boolean       │
│                                                                  │
│  @AIProcess(entityType, processType)                            │
│  └── Method: "Trigger AI processing on execution"               │
│      processType: "create", "update", "delete"                  │
│                                                                  │
│  IndexingStrategy                                               │
│  └── SYNC:  Immediate, blocking (+200-500ms)                    │
│  └── ASYNC: Background, non-blocking (+10ms, default)           │
│  └── BATCH: Scheduled batch processing                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

DECISION TREE:
═════════════════════════════════════════════════════════════════

Should this field be in the AI system?
├── NO  → Don't annotate (internal, sensitive, irrelevant)
└── YES → Continue...

Can users FIND this entity by searching for similar words?
├── YES → @AISearchable (text with meaning: name, description)
└── NO  → Continue...

Does AI need to KNOW this value when responding?
├── YES → @AIContext (structured data: price, rating, date)
└── NO  → Don't annotate
```

---

## Learn More

🚧 **Status:** Under active development | Q1 2026 release

Part of AI Fabric Framework—production-ready AI infrastructure for Spring Boot.

🎁 **Early Access:** First 500 stars get 50% lifetime Pro discount  
⭐ **GitHub:** [AI Fabric Framework](link)  
📖 **Docs:** [Complete API Reference](link)  
💬 **Community:** [Discord](link)

---

*Built by developers, for developers who want to ship AI features without becoming ML engineers.*

*© 2025 AI Fabric Framework | MIT License | Free Forever*

---

**Stop writing embedding pipelines. Start annotating entities.** 👨‍💻

