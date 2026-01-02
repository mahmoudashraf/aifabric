# AI Core Module - Complete Technical Guide

> **The engine that powers semantic intelligence across your entire application.**

---

## 🎯 Overview

The AI Core module is the foundational layer of the AI Fabric Framework. It provides a unified interface for AI capabilities including embeddings, semantic search, RAG (Retrieval-Augmented Generation), and intelligent indexing—all accessible through simple annotations.

### What You'll Learn

- Complete configuration reference for all AI Core services
- Step-by-step integration patterns
- Performance optimization strategies
- Production-ready code examples
- Troubleshooting common issues

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Core Module                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ AICoreService│  │AIEmbedding │  │   AISearchService   │  │
│  │             │  │  Service    │  │                     │  │
│  │ • Lifecycle │  │ • Vector    │  │ • Semantic Query    │  │
│  │ • Config    │  │   Gen       │  │ • Faceted Search    │  │
│  │ • Providers │  │ • Batch     │  │ • Hybrid Mode       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │                    RAGService                            │
│  │  • Context Assembly  • Token Management  • LLM Bridge   │
│  └─────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┤
│  │              Provider Abstraction Layer                  │
│  │  OpenAI │ Azure │ ONNX (Local) │ Custom Providers       │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### Prerequisites

- .NET 8.0 or later
- Entity Framework Core (for auto-indexing)
- SQL Server, PostgreSQL, or compatible database

### Package Installation

```bash
# Core package
dotnet add package AIFabric.Core

# Optional: ONNX provider for local embeddings
dotnet add package AIFabric.Providers.ONNX

# Optional: Azure OpenAI provider
dotnet add package AIFabric.Providers.Azure
```

### Basic Configuration

```csharp
// Program.cs
builder.Services.AddAICore(options =>
{
    options.DefaultProvider = "openai";
    options.EnableAutoIndexing = true;
    options.IndexingMode = IndexingMode.RealTime;
});

// Configure providers
builder.Services.AddOpenAIProvider(options =>
{
    options.ApiKey = builder.Configuration["OpenAI:ApiKey"];
    options.EmbeddingModel = "text-embedding-3-small";
    options.CompletionModel = "gpt-4-turbo";
});
```

---

## 🔧 Core Services Reference

### AICoreService

The central orchestrator for all AI operations.

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DefaultProvider` | string | "openai" | Default AI provider |
| `EnableAutoIndexing` | bool | true | Auto-index entities |
| `IndexingMode` | enum | RealTime | Sync, RealTime, or Batch |
| `MaxConcurrency` | int | 10 | Max parallel operations |
| `CacheEnabled` | bool | true | Enable embedding cache |
| `CacheDuration` | TimeSpan | 1 hour | Cache TTL |

#### Full Configuration Example

```csharp
builder.Services.AddAICore(options =>
{
    // Provider settings
    options.DefaultProvider = "openai";
    options.FallbackProvider = "onnx"; // Local fallback
    
    // Indexing behavior
    options.EnableAutoIndexing = true;
    options.IndexingMode = IndexingMode.RealTime;
    options.BatchSize = 100;
    options.MaxRetries = 3;
    
    // Performance tuning
    options.MaxConcurrency = 10;
    options.RequestTimeout = TimeSpan.FromSeconds(30);
    
    // Caching
    options.CacheEnabled = true;
    options.CacheDuration = TimeSpan.FromHours(1);
    options.CacheProvider = CacheProvider.Redis;
    
    // Security
    options.EnablePIIDetection = true;
    options.PIIHandling = PIIHandling.Mask;
    options.AuditLogging = true;
});
```

---

### AIEmbeddingService

Generates vector embeddings for text content.

#### Methods

```csharp
public interface IAIEmbeddingService
{
    // Single text embedding
    Task<float[]> GenerateEmbeddingAsync(string text);
    
    // Batch embeddings (more efficient)
    Task<List<float[]>> GenerateBatchEmbeddingsAsync(IEnumerable<string> texts);
    
    // Embedding with metadata
    Task<EmbeddingResult> GenerateWithMetadataAsync(string text, EmbeddingOptions options);
}
```

#### Usage Examples

```csharp
// Inject the service
public class ProductService
{
    private readonly IAIEmbeddingService _embeddingService;
    
    public ProductService(IAIEmbeddingService embeddingService)
    {
        _embeddingService = embeddingService;
    }
    
    // Generate single embedding
    public async Task<float[]> GetProductEmbedding(string description)
    {
        return await _embeddingService.GenerateEmbeddingAsync(description);
    }
    
    // Batch processing for efficiency
    public async Task IndexProducts(List<Product> products)
    {
        var descriptions = products.Select(p => p.Description).ToList();
        var embeddings = await _embeddingService.GenerateBatchEmbeddingsAsync(descriptions);
        
        for (int i = 0; i < products.Count; i++)
        {
            products[i].Embedding = embeddings[i];
        }
    }
}
```

#### Embedding Options

```csharp
var options = new EmbeddingOptions
{
    Model = "text-embedding-3-large",  // Override default model
    Dimensions = 1536,                  // Vector dimensions
    EncodingFormat = "float",           // float or base64
    Normalize = true,                   // L2 normalize vectors
    TruncateInput = true,               // Handle long texts
    MaxTokens = 8191                    // Max input tokens
};

var result = await _embeddingService.GenerateWithMetadataAsync(text, options);
// result.Embedding - the vector
// result.TokensUsed - input token count
// result.Model - model used
// result.ProcessingTime - generation time
```

---

### AISearchService

Performs semantic and hybrid search operations.

#### Search Methods

```csharp
public interface IAISearchService
{
    // Basic semantic search
    Task<List<T>> SemanticSearchAsync<T>(string query, int limit = 10);
    
    // Advanced search with options
    Task<SearchResult<T>> SearchAsync<T>(SearchRequest request);
    
    // Hybrid search (semantic + keyword)
    Task<List<T>> HybridSearchAsync<T>(string query, HybridOptions options);
    
    // Faceted search
    Task<FacetedResult<T>> FacetedSearchAsync<T>(FacetedSearchRequest request);
}
```

#### Search Request Configuration

```csharp
var request = new SearchRequest
{
    Query = "comfortable running shoes for marathon",
    
    // Result control
    Limit = 20,
    Offset = 0,
    
    // Similarity settings
    MinScore = 0.7f,           // Minimum similarity threshold
    ScoreBoost = true,         // Apply relevance boosting
    
    // Filtering
    Filters = new Dictionary<string, object>
    {
        ["Category"] = "Footwear",
        ["InStock"] = true,
        ["Price"] = new { Min = 50, Max = 200 }
    },
    
    // Hybrid mode
    EnableHybrid = true,
    SemanticWeight = 0.7f,     // 70% semantic, 30% keyword
    
    // Include metadata
    IncludeVectors = false,
    IncludeScores = true,
    IncludeHighlights = true
};

var result = await _searchService.SearchAsync<Product>(request);

foreach (var item in result.Items)
{
    Console.WriteLine($"{item.Name} - Score: {item.Score:F2}");
    Console.WriteLine($"  Highlights: {string.Join(", ", item.Highlights)}");
}
```

#### Faceted Search Example

```csharp
var facetedRequest = new FacetedSearchRequest
{
    Query = "laptop",
    Facets = new[] { "Brand", "RAM", "Storage", "PriceRange" },
    FacetLimit = 10
};

var result = await _searchService.FacetedSearchAsync<Product>(facetedRequest);

// Access facet counts
foreach (var facet in result.Facets)
{
    Console.WriteLine($"\n{facet.Field}:");
    foreach (var value in facet.Values)
    {
        Console.WriteLine($"  {value.Name}: {value.Count}");
    }
}
```

---

### RAGService

Retrieval-Augmented Generation for context-aware AI responses.

#### RAG Methods

```csharp
public interface IRAGService
{
    // Simple RAG query
    Task<string> QueryAsync(string question);
    
    // RAG with options
    Task<RAGResponse> QueryAsync(RAGRequest request);
    
    // Streaming response
    IAsyncEnumerable<string> StreamQueryAsync(string question);
    
    // Multi-turn conversation
    Task<RAGResponse> ConversationAsync(ConversationContext context);
}
```

#### RAG Configuration

```csharp
builder.Services.AddRAGService(options =>
{
    // Retrieval settings
    options.MaxContextDocuments = 5;
    options.MinRelevanceScore = 0.75f;
    options.ContextWindowSize = 4000;  // tokens
    
    // Generation settings
    options.Model = "gpt-4-turbo";
    options.Temperature = 0.7f;
    options.MaxTokens = 1000;
    
    // System prompt
    options.SystemPrompt = @"
        You are a helpful assistant. Answer questions based on the 
        provided context. If you don't know, say so.
    ";
    
    // Citation handling
    options.IncludeCitations = true;
    options.CitationFormat = CitationFormat.Inline;
});
```

#### RAG Usage Examples

```csharp
// Simple query
var answer = await _ragService.QueryAsync("What is our return policy?");

// Advanced query with context control
var request = new RAGRequest
{
    Question = "How do I upgrade my subscription?",
    
    // Context sources
    Collections = new[] { "documentation", "faqs" },
    
    // Retrieval tuning
    MaxDocuments = 8,
    MinScore = 0.8f,
    
    // Generation options
    Temperature = 0.5f,
    MaxTokens = 500,
    
    // Metadata
    UserId = currentUser.Id,
    SessionId = session.Id
};

var response = await _ragService.QueryAsync(request);

Console.WriteLine(response.Answer);
Console.WriteLine("\nSources:");
foreach (var source in response.Sources)
{
    Console.WriteLine($"  - {source.Title} (Score: {source.Score:F2})");
}
```

#### Streaming RAG

```csharp
// Stream response for better UX
await foreach (var chunk in _ragService.StreamQueryAsync(question))
{
    Console.Write(chunk);
    await Response.WriteAsync(chunk);
    await Response.Body.FlushAsync();
}
```

---

## 🏷️ Entity Annotations

### [Searchable] Attribute

Mark entities for automatic indexing.

```csharp
[Searchable]
public class Product
{
    public int Id { get; set; }
    
    [SearchField(Boost = 2.0f)]      // Higher relevance weight
    public string Name { get; set; }
    
    [SearchField(Analyzer = "english")]
    public string Description { get; set; }
    
    [SearchField(Filterable = true)]  // Enable filtering
    public string Category { get; set; }
    
    [SearchField(Sortable = true)]
    public decimal Price { get; set; }
    
    [SearchIgnore]                    // Exclude from indexing
    public string InternalNotes { get; set; }
}
```

### Attribute Options

| Attribute | Property | Description |
|-----------|----------|-------------|
| `[Searchable]` | - | Marks entity for indexing |
| `[SearchField]` | `Boost` | Relevance multiplier (default: 1.0) |
| `[SearchField]` | `Analyzer` | Text analyzer (english, standard, etc.) |
| `[SearchField]` | `Filterable` | Enable filter queries |
| `[SearchField]` | `Sortable` | Enable sorting |
| `[SearchField]` | `Facetable` | Enable faceting |
| `[SearchIgnore]` | - | Exclude from indexing |
| `[PIISensitive]` | - | Mark as PII for special handling |

---

## 🔄 Provider Configuration

### OpenAI Provider

```csharp
builder.Services.AddOpenAIProvider(options =>
{
    options.ApiKey = config["OpenAI:ApiKey"];
    options.Organization = config["OpenAI:OrgId"];  // Optional
    
    // Model selection
    options.EmbeddingModel = "text-embedding-3-small";
    options.CompletionModel = "gpt-4-turbo";
    
    // Rate limiting
    options.MaxRequestsPerMinute = 60;
    options.MaxTokensPerMinute = 150000;
    
    // Retry policy
    options.MaxRetries = 3;
    options.RetryDelay = TimeSpan.FromSeconds(1);
});
```

### Azure OpenAI Provider

```csharp
builder.Services.AddAzureOpenAIProvider(options =>
{
    options.Endpoint = config["Azure:OpenAI:Endpoint"];
    options.ApiKey = config["Azure:OpenAI:ApiKey"];
    options.DeploymentName = "my-gpt4-deployment";
    options.EmbeddingDeployment = "my-embedding-deployment";
    
    // Azure-specific
    options.ApiVersion = "2024-02-15-preview";
});
```

### ONNX Local Provider

Run embeddings locally without API calls.

```csharp
builder.Services.AddONNXProvider(options =>
{
    // Model configuration
    options.ModelPath = "./models/all-MiniLM-L6-v2.onnx";
    options.TokenizerPath = "./models/tokenizer.json";
    options.MaxSequenceLength = 512;
    
    // Performance
    options.UseGPU = true;
    options.GPUDeviceId = 0;
    options.IntraOpNumThreads = 4;
    
    // Batching
    options.MaxBatchSize = 32;
    options.BatchTimeout = TimeSpan.FromMilliseconds(50);
});
```

### Multi-Provider Setup

```csharp
builder.Services.AddAICore(options =>
{
    options.DefaultProvider = "openai";
    options.FallbackChain = new[] { "azure", "onnx" };
});

builder.Services.AddOpenAIProvider("openai", options => { ... });
builder.Services.AddAzureOpenAIProvider("azure", options => { ... });
builder.Services.AddONNXProvider("onnx", options => { ... });
```

---

## 📊 Performance Optimization

### Batch Processing

```csharp
// Configure batch indexing
builder.Services.AddAICore(options =>
{
    options.IndexingMode = IndexingMode.Batch;
    options.BatchSize = 100;
    options.BatchInterval = TimeSpan.FromSeconds(5);
});

// Manual batch control
await _aiCore.FlushBatchAsync();  // Force process pending items
await _aiCore.WaitForBatchCompletionAsync();  // Wait for all batches
```

### Caching Strategies

```csharp
// Redis caching for distributed scenarios
builder.Services.AddAICore(options =>
{
    options.CacheEnabled = true;
    options.CacheProvider = CacheProvider.Redis;
    options.CacheConnection = config.GetConnectionString("Redis");
    options.CacheDuration = TimeSpan.FromHours(24);
    
    // Selective caching
    options.CacheEmbeddings = true;
    options.CacheSearchResults = true;
    options.CacheRAGResponses = false;  // Don't cache dynamic content
});
```

### Connection Pooling

```csharp
builder.Services.AddAICore(options =>
{
    // HTTP client pooling
    options.MaxConnectionsPerProvider = 20;
    options.ConnectionIdleTimeout = TimeSpan.FromMinutes(2);
    
    // Request optimization
    options.EnableCompression = true;
    options.RequestTimeout = TimeSpan.FromSeconds(30);
});
```

---

## 🔒 Security Features

### PII Detection & Handling

```csharp
builder.Services.AddAICore(options =>
{
    options.EnablePIIDetection = true;
    options.PIIHandling = PIIHandling.Mask;  // Mask, Remove, or Encrypt
    
    // Custom PII patterns
    options.PIIPatterns = new[]
    {
        new PIIPattern("SSN", @"\d{3}-\d{2}-\d{4}"),
        new PIIPattern("CreditCard", @"\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}")
    };
});
```

### Audit Logging

```csharp
builder.Services.AddAICore(options =>
{
    options.AuditLogging = true;
    options.AuditLogLevel = AuditLevel.Detailed;
    
    // Custom audit handler
    options.OnAuditEvent = async (event) =>
    {
        await _auditService.LogAsync(new AuditEntry
        {
            Action = event.Action,
            UserId = event.UserId,
            EntityType = event.EntityType,
            Timestamp = event.Timestamp,
            Details = event.Details
        });
    };
});
```

---

## 🧪 Testing

### Unit Testing

```csharp
public class ProductSearchTests
{
    private readonly Mock<IAISearchService> _mockSearch;
    
    [Fact]
    public async Task SemanticSearch_ReturnsRelevantProducts()
    {
        // Arrange
        var expectedProducts = new List<Product>
        {
            new Product { Id = 1, Name = "Running Shoes" },
            new Product { Id = 2, Name = "Marathon Trainers" }
        };
        
        _mockSearch.Setup(s => s.SemanticSearchAsync<Product>(
            It.IsAny<string>(), 
            It.IsAny<int>()))
            .ReturnsAsync(expectedProducts);
        
        // Act
        var results = await _service.SearchProducts("running shoes");
        
        // Assert
        Assert.Equal(2, results.Count);
        _mockSearch.Verify(s => s.SemanticSearchAsync<Product>(
            "running shoes", 10), Times.Once);
    }
}
```

### Integration Testing

```csharp
public class AIIntegrationTests : IClassFixture<AITestFixture>
{
    private readonly IAIEmbeddingService _embeddingService;
    
    public AIIntegrationTests(AITestFixture fixture)
    {
        _embeddingService = fixture.Services.GetRequiredService<IAIEmbeddingService>();
    }
    
    [Fact]
    public async Task Embeddings_AreSemanticallyMeaningful()
    {
        // Generate embeddings
        var catEmbedding = await _embeddingService.GenerateEmbeddingAsync("cat");
        var kittenEmbedding = await _embeddingService.GenerateEmbeddingAsync("kitten");
        var carEmbedding = await _embeddingService.GenerateEmbeddingAsync("car");
        
        // Calculate similarities
        var catKittenSimilarity = CosineSimilarity(catEmbedding, kittenEmbedding);
        var catCarSimilarity = CosineSimilarity(catEmbedding, carEmbedding);
        
        // Cat-kitten should be more similar than cat-car
        Assert.True(catKittenSimilarity > catCarSimilarity);
    }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Embedding generation failed"

```csharp
// Check provider health
var health = await _aiCore.CheckProviderHealthAsync("openai");
if (!health.IsHealthy)
{
    Console.WriteLine($"Provider issue: {health.Message}");
}

// Enable detailed logging
builder.Services.AddAICore(options =>
{
    options.LogLevel = LogLevel.Debug;
    options.LogRequests = true;
    options.LogResponses = true;
});
```

#### 2. "Search returns no results"

```csharp
// Check if index exists
var indexStatus = await _aiCore.GetIndexStatusAsync<Product>();
Console.WriteLine($"Indexed documents: {indexStatus.DocumentCount}");

// Force reindex
await _aiCore.ReindexAsync<Product>();
```

#### 3. "Rate limit exceeded"

```csharp
// Configure rate limiting
builder.Services.AddOpenAIProvider(options =>
{
    options.MaxRequestsPerMinute = 30;  // Reduce rate
    options.RetryOnRateLimit = true;
    options.MaxRetries = 5;
    options.RetryBackoff = TimeSpan.FromSeconds(2);
});
```

### Diagnostic Commands

```csharp
// Get system diagnostics
var diagnostics = await _aiCore.GetDiagnosticsAsync();

Console.WriteLine($"Active providers: {string.Join(", ", diagnostics.ActiveProviders)}");
Console.WriteLine($"Pending operations: {diagnostics.PendingOperations}");
Console.WriteLine($"Cache hit rate: {diagnostics.CacheHitRate:P}");
Console.WriteLine($"Average latency: {diagnostics.AverageLatencyMs}ms");
```

---

## 📚 Additional Resources

- [API Reference](/docs/api/core)
- [Migration Guide](/docs/guides/migration)
- [Best Practices](/docs/guides/best-practices)
- [Example Projects](https://github.com/aifabric/examples)

---

*This guide is part of the AI Fabric Framework documentation. For questions or feedback, please open an issue on GitHub.*
