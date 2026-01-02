# Relationship Query Module - Complete Technical Guide

> **Transform natural language into database queries. Business users self-serve. Developers freed.**

---

## 🎯 Overview

The Relationship Query module bridges the gap between human language and database queries. Instead of writing complex SQL or JPQL, users simply ask questions in plain English—the module handles everything else.

### What You'll Learn

- Complete architecture and data flow
- All configuration options explained
- Query modes and optimization strategies
- Fallback chain mechanics
- Caching strategies for 64x speedup
- Production deployment patterns
- Troubleshooting guide

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RELATIONSHIP QUERY MODULE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    QUERY PLANNER (LLM-Powered)                  │ │
│  │  • Parses natural language                                      │ │
│  │  • Identifies entities, relationships, filters                  │ │
│  │  • Generates RelationshipQueryPlan with confidence score        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                   DYNAMIC JPQL BUILDER                          │ │
│  │  • Converts plan to executable JPQL                             │ │
│  │  • Handles JOINs, parameters, type safety                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │               4-LEVEL EXECUTION STRATEGY                        │ │
│  │  Level 1: JPA Traversal (85%)                                   │ │
│  │  Level 2: Metadata Traversal (10%)                              │ │
│  │  Level 3: Vector Search (4%)                                    │ │
│  │  Level 4: Simple Repository (1%)                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                   3-LEVEL CACHE HIERARCHY                       │ │
│  │  Plan Cache → Embedding Cache → Result Cache                    │ │
│  │  450ms cold → 7ms hot (64x speedup)                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### Prerequisites

- AI Fabric Framework core module
- JPA/Hibernate configured
- LLM provider (OpenAI, Azure, or local)

### Dependency

```xml
<dependency>
    <groupId>com.aifabric</groupId>
    <artifactId>ai-fabric-relationship-query</artifactId>
    <version>${aifabric.version}</version>
</dependency>
```

### Minimal Configuration

```yaml
# Zero config works! Smart defaults applied.
ai:
  infrastructure:
    relationship:
      enabled: true
```

---

## 🔧 Complete Configuration Reference

### Core Properties

```yaml
ai:
  infrastructure:
    relationship:
      # Master switch
      enabled: true
      
      # ═══════════════════════════════════════════════════════
      # QUERY MODES
      # ═══════════════════════════════════════════════════════
      
      # STANDALONE: Pure relational queries (faster, 90% of use cases)
      # ENHANCED: Relational + semantic search (complex queries)
      default-query-mode: STANDALONE
      
      # IDS: Return entity IDs only (fastest)
      # ENTITIES: Return full entities (convenient)
      # DOCUMENTS: Return as RAG documents (for chaining)
      default-return-mode: IDS
      
      # ═══════════════════════════════════════════════════════
      # FALLBACK CHAIN
      # ═══════════════════════════════════════════════════════
      
      # Level 2: Try metadata navigation if JPA fails
      fallback-to-metadata: true
      
      # Level 3: Try vector search if metadata fails
      fallback-to-vector-search: true
      
      # Level 4: Try simple findAll() as last resort
      fallback-to-simple-search: true
      
      # ═══════════════════════════════════════════════════════
      # PERFORMANCE
      # ═══════════════════════════════════════════════════════
      
      # Enable query result caching
      enable-query-caching: true
      
      # Maximum results per query
      default-limit: 100
      max-limit: 1000
      
      # Query timeout (prevents runaway queries)
      query-timeout-seconds: 30
      
      # ═══════════════════════════════════════════════════════
      # LLM QUERY PLANNER
      # ═══════════════════════════════════════════════════════
      
      planner:
        # Minimum confidence to proceed with query
        min-confidence: 0.7
        
        # Maximum relationships to traverse
        max-relationship-depth: 5
        
        # Include query explanation in response
        include-explanation: true
        
        # LLM temperature for planning (lower = more deterministic)
        temperature: 0.3
      
      # ═══════════════════════════════════════════════════════
      # CACHING (3-Level Hierarchy)
      # ═══════════════════════════════════════════════════════
      
      cache:
        # Level 1: Query plan cache
        plan:
          enabled: true
          ttl-seconds: 3600        # 1 hour
          max-entries: 10000
        
        # Level 2: Embedding cache
        embedding:
          enabled: true
          ttl-seconds: 86400       # 24 hours
          max-entries: 50000
        
        # Level 3: Result cache
        result:
          enabled: true
          ttl-seconds: 1800        # 30 minutes
          max-entries: 5000
          
        # Use Redis for distributed caching
        provider: caffeine         # caffeine (local) or redis (distributed)
        redis-uri: "redis://localhost:6379"
```

---

## 🚀 Core Service API

### ReliableRelationshipQueryService

The main service for executing natural language queries.

```java
@Service
public interface ReliableRelationshipQueryService {
    
    /**
     * Execute a natural language query.
     *
     * @param question     Natural language question
     * @param entityTypes  List of entity types to search
     * @param options      Query options (nullable for defaults)
     * @return RAGResponse containing results
     */
    RAGResponse execute(
        String question,
        List<String> entityTypes,
        QueryOptions options
    );
    
    /**
     * Execute with typed results.
     */
    <T> List<T> executeTyped(
        String question,
        Class<T> entityClass,
        QueryOptions options
    );
    
    /**
     * Stream results for large datasets.
     */
    <T> Stream<T> executeStream(
        String question,
        Class<T> entityClass,
        QueryOptions options
    );
    
    /**
     * Get query plan without executing.
     * Useful for validation and debugging.
     */
    RelationshipQueryPlan plan(
        String question,
        List<String> entityTypes
    );
}
```

### QueryOptions Builder

```java
QueryOptions options = QueryOptions.builder()
    // Result control
    .limit(50)
    .offset(0)
    
    // Query mode
    .forceMode(QueryMode.STANDALONE)  // or ENHANCED
    
    // Return mode
    .returnMode(ReturnMode.ENTITIES)  // IDS, ENTITIES, or DOCUMENTS
    
    // Filtering
    .additionalFilters(Map.of(
        "status", "ACTIVE",
        "region", "US"
    ))
    
    // Caching
    .bypassCache(false)
    .cacheTtl(Duration.ofMinutes(15))
    
    // Timeout
    .timeout(Duration.ofSeconds(10))
    
    // Include metadata in response
    .includeMetadata(true)
    .includeExplanation(true)
    
    .build();
```

---

## 📊 Query Modes Explained

### STANDALONE Mode (Default)

Pure relational queries. Fast and accurate.

```java
// Automatically uses STANDALONE
RAGResponse response = queryService.execute(
    "Premium customers who ordered last month",
    List.of("customer"),
    null  // defaults to STANDALONE
);
```

**When to use:**
- Structured queries with clear relationships
- Performance-critical paths
- 90% of typical queries

**Performance:**
- Uncached: 150-300ms
- Cached: 7ms

---

### ENHANCED Mode

Relational queries + semantic search reranking.

```java
QueryOptions enhanced = QueryOptions.builder()
    .forceMode(QueryMode.ENHANCED)
    .build();

RAGResponse response = queryService.execute(
    "Products similar to what our VIP customers usually buy",
    List.of("product"),
    enhanced
);
```

**When to use:**
- Ambiguous queries
- Semantic similarity needed
- "Find me something like..." queries

**Performance:**
- Uncached: 450-800ms
- Cached: 15ms

---

## 🛡️ 4-Level Fallback Chain

### Architecture

```
Query Execution
     │
     ▼
┌─────────────────────────┐
│ Level 1: JPA Traversal  │ ─── Success (85%) ──→ Return results
└───────────┬─────────────┘
            │ Failure
            ▼
┌─────────────────────────────┐
│ Level 2: Metadata Traversal │ ─── Success (10%) ──→ Return results
└───────────┬─────────────────┘
            │ Failure
            ▼
┌─────────────────────────┐
│ Level 3: Vector Search  │ ─── Success (4%) ──→ Return results
└───────────┬─────────────┘
            │ Failure
            ▼
┌───────────────────────────┐
│ Level 4: Simple Repository│ ─── Success (1%) ──→ Return results
└───────────┬───────────────┘
            │ All failed
            ▼
    FallbackExhaustedException
    (with context for debugging)
```

### Level 1: JPA Traversal Service

The primary execution path using JPA/JPQL.

```java
// What happens internally:
public class JpaRelationshipTraversalService {
    
    public <T> List<T> traverse(RelationshipQueryPlan plan, Class<T> type) {
        // 1. Build JPQL from plan
        String jpql = buildJpql(plan);
        
        // 2. Create typed query
        TypedQuery<T> query = entityManager.createQuery(jpql, type);
        
        // 3. Bind parameters
        bindParameters(query, plan.getParameters());
        
        // 4. Execute with timeout
        query.setHint("javax.persistence.query.timeout", timeoutMs);
        
        return query.getResultList();
    }
}
```

**Success rate:** 85%
**Performance:** 150-300ms
**Best for:** Well-mapped JPA entities

---

### Level 2: Metadata Traversal Service

Uses entity metadata when JPA mappings are incomplete.

```java
public class MetadataRelationshipTraversalService {
    
    public <T> List<T> traverse(RelationshipQueryPlan plan, Class<T> type) {
        // 1. Fetch primary entities
        List<T> entities = repository.findAll(type);
        
        // 2. Navigate relationships via reflection
        for (RelationshipStep step : plan.getRelationships()) {
            entities = navigateViaMetadata(entities, step);
        }
        
        // 3. Apply filters
        return applyFilters(entities, plan.getFilters());
    }
}
```

**Success rate:** 10%
**Performance:** 300-600ms
**Best for:** Legacy schemas, incomplete mappings

---

### Level 3: Vector Search Fallback

Semantic similarity when structural queries fail.

```java
public class VectorSearchFallbackService {
    
    public <T> List<T> search(String question, Class<T> type) {
        // 1. Generate embedding for question
        float[] embedding = embeddingService.generate(question);
        
        // 2. Search vector database
        List<VectorMatch> matches = vectorDb.search(
            embedding,
            type.getSimpleName(),
            limit
        );
        
        // 3. Materialize entities
        return materialize(matches, type);
    }
}
```

**Success rate:** 4%
**Performance:** 400-800ms
**Best for:** Ambiguous queries, semantic matching

---

### Level 4: Simple Repository

Last resort—returns all entities of the type.

```java
public class SimpleEntityLookup {
    
    public <T> List<T> lookup(Class<T> type, int limit) {
        // Just fetch all with limit
        return repository.findAll(type)
            .stream()
            .limit(limit)
            .collect(toList());
    }
}
```

**Success rate:** 1%
**Performance:** 50-200ms
**Best for:** Absolute fallback

---

## 📈 Caching Strategy

### 3-Level Cache Hierarchy

```
                    ┌─────────────────┐
     Query          │   PLAN CACHE    │
       │            │   TTL: 1 hour   │
       ▼            │   Hit: 85%      │
  Hash(query) ───→  │   Saves: 250ms  │
       │            └────────┬────────┘
       │                     │
       ▼                     ▼
  ┌─────────────────┐  ┌─────────────────┐
  │ EMBEDDING CACHE │  │  RESULT CACHE   │
  │ TTL: 24 hours   │  │  TTL: 30 min    │
  │ Hit: 70%        │  │  Hit: 60%       │
  │ Saves: 50ms     │  │  Saves: 150ms   │
  └─────────────────┘  └─────────────────┘
```

### Cache Performance

| Scenario | Time | Speedup |
|----------|------|---------|
| Cold (no cache) | 450ms | 1x |
| Plan cached | 200ms | 2.25x |
| Plan + embedding cached | 150ms | 3x |
| Fully cached | 7ms | **64x** |

### Cache Invalidation

```java
@Service
public class QueryCacheManager {
    
    // Invalidate specific query
    public void invalidate(String question, List<String> entityTypes) {
        String key = generateKey(question, entityTypes);
        cacheManager.evict("query-plan", key);
        cacheManager.evict("query-result", key);
    }
    
    // Invalidate by entity type (when data changes)
    public void invalidateByType(String entityType) {
        cacheManager.evictByPrefix("query-result", entityType);
    }
    
    // Clear all caches
    public void clearAll() {
        cacheManager.clear("query-plan");
        cacheManager.clear("query-embedding");
        cacheManager.clear("query-result");
    }
}
```

### Entity Change Listeners

```java
@Component
public class EntityChangeListener {
    
    @Autowired
    private QueryCacheManager cacheManager;
    
    @EventListener
    public void onEntityChange(EntityChangeEvent event) {
        // Invalidate cached queries for this entity type
        cacheManager.invalidateByType(event.getEntityType());
    }
}
```

---

## 🔌 REST API Integration

### Analytics Controller Example

```java
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private ReliableRelationshipQueryService queryService;
    
    /**
     * Natural language query endpoint.
     * 
     * Examples:
     * - GET /api/analytics/query?q=Premium customers who ordered last month
     * - GET /api/analytics/query?q=Products with high return rate&limit=20
     */
    @GetMapping("/query")
    public ResponseEntity<QueryResponse> query(
            @RequestParam("q") String question,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) List<String> entities) {
        
        QueryOptions options = QueryOptions.builder()
            .limit(limit)
            .includeMetadata(true)
            .build();
        
        // Default to common entity types if not specified
        List<String> entityTypes = entities != null ? entities 
            : List.of("customer", "order", "product");
        
        RAGResponse response = queryService.execute(
            question,
            entityTypes,
            options
        );
        
        return ResponseEntity.ok(toQueryResponse(response));
    }
    
    /**
     * Typed query for specific entity.
     */
    @GetMapping("/customers")
    public List<CustomerDTO> queryCustomers(
            @RequestParam("q") String question,
            @RequestParam(defaultValue = "50") int limit) {
        
        return queryService.executeTyped(
            question,
            Customer.class,
            QueryOptions.builder().limit(limit).build()
        ).stream()
            .map(CustomerDTO::from)
            .collect(toList());
    }
}
```

### Response Format

```json
{
  "query": "Premium customers who ordered last month",
  "results": [
    {
      "id": "customer-123",
      "type": "Customer",
      "data": {
        "name": "John Doe",
        "tier": "Premium",
        "email": "john@example.com"
      },
      "score": 0.95
    }
  ],
  "metadata": {
    "totalResults": 42,
    "processingTimeMs": 187,
    "executionLevel": "JPA_TRAVERSAL",
    "cacheHit": true,
    "confidence": 0.91,
    "explanation": "Found 42 customers with tier='Premium' who have orders with createdAt > 2024-12-01"
  }
}
```

---

## 🏢 Executive Dashboard Example

Build a complete analytics dashboard with ZERO SQL:

```java
@RestController
@RequestMapping("/api/executive")
public class ExecutiveDashboard {
    
    @Autowired
    private ReliableRelationshipQueryService queryService;
    
    @GetMapping("/revenue-leaders")
    public List<Customer> getTopCustomers(
            @RequestParam(defaultValue = "this quarter") String period) {
        return query("Top customers by revenue " + period, "customer");
    }
    
    @GetMapping("/problem-products")
    public List<Product> getProblemProducts() {
        return query("Products with high return rates", "product");
    }
    
    @GetMapping("/at-risk-accounts")
    public List<Customer> getAtRiskCustomers() {
        return query("Customers not contacted in 90 days", "customer");
    }
    
    @GetMapping("/trending-categories")
    public List<Category> getTrendingCategories() {
        return query("Product categories with growing sales", "category");
    }
    
    @GetMapping("/inactive-users")
    public List<User> getInactiveUsers() {
        return query("Users who haven't logged in for 30 days", "user");
    }
    
    private <T> List<T> query(String question, String entityType) {
        return queryService.executeTyped(
            question,
            getEntityClass(entityType),
            QueryOptions.builder().limit(50).build()
        );
    }
}
```

**Result:** 25 dashboard views, 0 lines of SQL!

---

## 🧪 Testing

### Unit Testing with Mocks

```java
@ExtendWith(MockitoExtension.class)
class CustomerQueryServiceTest {
    
    @Mock
    private ReliableRelationshipQueryService queryService;
    
    @InjectMocks
    private CustomerQueryService customerService;
    
    @Test
    void shouldFindPremiumCustomers() {
        // Arrange
        List<Customer> expected = List.of(
            new Customer("123", "John", "Premium"),
            new Customer("456", "Jane", "Premium")
        );
        
        when(queryService.executeTyped(
            eq("Premium customers"),
            eq(Customer.class),
            any(QueryOptions.class)
        )).thenReturn(expected);
        
        // Act
        List<Customer> result = customerService.findPremium();
        
        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting("tier").containsOnly("Premium");
    }
}
```

### Integration Testing

```java
@SpringBootTest
@Testcontainers
class RelationshipQueryIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
    
    @Autowired
    private ReliableRelationshipQueryService queryService;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @BeforeEach
    void setup() {
        // Create test data
        Customer customer = new Customer("John Doe", "Premium");
        Order order = new Order(customer, LocalDateTime.now().minusDays(5));
        entityManager.persist(customer);
        entityManager.persist(order);
    }
    
    @Test
    void shouldQueryWithNaturalLanguage() {
        // Act
        RAGResponse response = queryService.execute(
            "Premium customers who ordered recently",
            List.of("customer"),
            QueryOptions.defaults()
        );
        
        // Assert
        assertThat(response.getDocuments()).hasSize(1);
        assertThat(response.getMetadata().getExecutionLevel())
            .isEqualTo("JPA_TRAVERSAL");
    }
    
    @Test
    void shouldFallbackWhenJpaFails() {
        // Act with complex query that requires fallback
        RAGResponse response = queryService.execute(
            "Customers similar to our best performers",
            List.of("customer"),
            QueryOptions.builder()
                .forceMode(QueryMode.ENHANCED)
                .build()
        );
        
        // Assert
        assertThat(response.getMetadata().getFallbacksAttempted())
            .isGreaterThan(0);
    }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Query returns empty results"

```java
// Enable detailed logging
logging:
  level:
    com.aifabric.relationship: DEBUG

// Check query plan
RelationshipQueryPlan plan = queryService.plan(question, entityTypes);
log.info("Generated plan: {}", plan);
log.info("Confidence: {}", plan.getConfidence());

// If confidence is low, query is ambiguous
if (plan.getConfidence() < 0.7) {
    log.warn("Low confidence - consider rephrasing query");
}
```

#### 2. "Query too slow"

```java
// 1. Check if caching is enabled
QueryOptions options = QueryOptions.builder()
    .includeMetadata(true)
    .build();

RAGResponse response = queryService.execute(question, entities, options);
log.info("Cache hit: {}", response.getMetadata().isCacheHit());

// 2. Use STANDALONE mode for structured queries
QueryOptions fast = QueryOptions.builder()
    .forceMode(QueryMode.STANDALONE)
    .build();

// 3. Limit results
QueryOptions limited = QueryOptions.builder()
    .limit(20)
    .build();
```

#### 3. "Fallback chain exhausted"

```java
try {
    RAGResponse response = queryService.execute(question, entities, options);
} catch (FallbackExhaustedException e) {
    log.error("All fallbacks failed for query: {}", question);
    log.error("Last error: {}", e.getLastError());
    log.error("Attempts: {}", e.getAttempts());
    
    // Return graceful error to user
    return ResponseEntity.status(422)
        .body(new ErrorResponse(
            "Unable to process query",
            "Try rephrasing your question or being more specific"
        ));
}
```

### Debug Mode

```yaml
ai:
  infrastructure:
    relationship:
      debug:
        enabled: true
        log-plans: true
        log-jpql: true
        log-timings: true
        explain-fallbacks: true
```

### Health Check Endpoint

```java
@RestController
@RequestMapping("/api/health")
public class QueryHealthController {
    
    @Autowired
    private ReliableRelationshipQueryService queryService;
    
    @GetMapping("/query")
    public HealthStatus checkQueryService() {
        try {
            // Simple test query
            RAGResponse response = queryService.execute(
                "test query",
                List.of("customer"),
                QueryOptions.builder()
                    .limit(1)
                    .timeout(Duration.ofSeconds(5))
                    .build()
            );
            
            return HealthStatus.healthy()
                .withDetail("responseTimeMs", response.getMetadata().getProcessingTimeMs())
                .withDetail("cacheHitRate", getCacheHitRate());
                
        } catch (Exception e) {
            return HealthStatus.unhealthy()
                .withError(e.getMessage());
        }
    }
}
```

---

## 📚 Additional Resources

- [Relationship Query Story](/docs/features/query) - Quick introduction
- [AI Core Module Guide](/docs/guides/core) - Foundation concepts
- [RAG Module Guide](/docs/guides/rag) - Semantic search details
- [Performance Tuning](/docs/guides/performance) - Optimization tips

---

*This guide is part of the AI Fabric Framework documentation. For questions, open an issue on GitHub.*
