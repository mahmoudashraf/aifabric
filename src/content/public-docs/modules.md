# Modules

Start with the smallest module set that proves the capability you need. Add more only when the application workflow requires it.

## Common Module Sets

| Goal | Main Modules |
| --- | --- |
| Semantic search | `ai-fabric-core`, `ai-fabric-indexing`, one embedding provider, one vector provider |
| RAG answers | Semantic search modules plus `ai-fabric-rag` |
| Governed actions | `ai-fabric-core`, action registry modules, optional chat-session |
| Chat memory | `ai-fabric-chat-session` |
| PII handling | `ai-fabric-pii` |
| Behavior analysis | `ai-fabric-behavior` |
| Tenant-safe retrieval | vector metadata filters plus application access policy |
| Real provider calls | `ai-fabric-provider-spring-ai` |
| Local embeddings | `ai-fabric-onnx-starter` |

## Provider And Vector Choices

AI Fabric supports Spring AI-backed LLM/embedding providers and vector providers for Lucene, memory, Pinecone, Qdrant, Weaviate, and Milvus.

Use Lucene for local durable demos and development. Use managed vector stores when production retrieval needs external scale, operational ownership, or provider-specific lifecycle behavior.

## Keep The App In Charge

The app owns domain state and side effects. AI Fabric should orchestrate, retrieve, validate, and execute through explicit app hooks.

## Useful Next Reads

- [Choose your path](/docs/choose-your-path)
- [First semantic search](/docs/first-semantic-search)
- [First RAG chat](/docs/first-rag-chat)
- [First governed action](/docs/first-governed-action)
