# Can My Landlord...?

A day-project exploring what happens when you point an LLM agent at a specialized domain — in this case, tenant rights law. The idea: tenants shouldn't need a lawyer to know whether their landlord is breaking the law. Upload a lease, tell the app where you live, and ask plain-language questions grounded in your actual contract and local/state statutes.

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts    # Streaming chat endpoint (Gemini)
│   │   └── upload/route.ts  # PDF upload + text extraction
│   ├── page.tsx             # Single-page app shell
│   └── globals.css
├── components/              # Hero, ChatInterface, LeaseUploader, etc.
├── lib/
│   ├── gemini.ts            # Gemini client init
│   ├── prompts.ts           # System prompt + lease context builder
│   ├── pdf.ts               # pdf-parse wrapper
│   └── storage.ts           # GCS upload/retrieval for leases
└── types/index.ts
```

Next.js 15 / React 19 / Tailwind 4, deployed via Docker to Cloud Run.

## How it works

1. User uploads a lease PDF — the server extracts text with `pdf-parse` and stores both the original and extracted text in GCS.
2. User provides their city/state so the model can reference the right jurisdiction.
3. Chat messages stream back from Gemini (`gemini-2.5-flash`) with the full lease injected into the system prompt as context.

## Design tradeoffs

**Lease-in-prompt vs. RAG.** The entire lease (up to 100k chars) is stuffed into the system prompt rather than chunked into a vector store. This is simpler, avoids retrieval drift on a single well-scoped document, and works fine within Gemini's context window. It wouldn't scale to multi-document legal research, but for one lease it's the right call.

**No law corpus — model knowledge only.** The agent doesn't query a database of statutes. It relies on the model's training data for legal knowledge, which means it can be stale or wrong on niche local ordinances. A production version would need a retrieval layer over actual statute text, but for a day-project the model's baseline knowledge is surprisingly useful.

**GCS for document storage.** Lease PDFs land in a GCS bucket keyed by UUID. No database, no user accounts. This keeps the infra minimal but means there's no way to list or manage past uploads — it's stateless by design.

**Streaming over plain text.** The chat endpoint streams raw text chunks rather than structured SSE or JSON frames. Simpler to implement, simpler to consume on the client, but means no metadata (token counts, citations) in the stream.
