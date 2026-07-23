# Architecture

AI Fabric is an AI enablement framework for Java and Spring Boot applications. It adds governed AI capabilities without moving business logic out of the app.

## Request Flow

1. The application receives a normal product request or chat request.
2. AI Fabric builds an orchestration context with user, tenant, mode, attachments, and chat session state.
3. Retrieval and action candidates are resolved from app-owned configuration, annotated entities, and registered actions.
4. Access policy and governance checks run before evidence is exposed or side effects are executed.
5. The selected provider handles LLM or embedding calls.
6. The application receives structured evidence, generated text, action proposals, confirmation state, or action execution results.

## Core Architecture Pieces

| Area | What Owns It |
| --- | --- |
| Domain data | Your Spring Boot app and database |
| AI evidence | AI Fabric indexing, RAG, vector providers, and metadata |
| LLM calls | AI Fabric provider abstraction, currently Spring AI-backed for cloud providers |
| Actions | Your app services exposed through AI Fabric action registration |
| Authorization | Your app policy plus AI Fabric fail-closed access hooks |
| Conversation state | AI Fabric chat-session module |
| Public demos | Real Spring Boot apps under `examples/real-apps` |

## Design Principle

AI Fabric should make existing Java systems AI-enabled. It should not hide where data came from, fake intelligence in the UI, or replace application policy with prompt text.

## Useful Next Reads

- [Modules](/docs/modules)
- [Security](/docs/security)
- [Live demos](/docs/live-demos)
- [LLM context pack](/docs/llm-context)
