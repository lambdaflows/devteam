# Pluely "Paint Wall" Features: Research & Implementation Plan

## Background

**Cluely** is a paid ($19-99/mo) real-time AI assistant that operates as an invisible overlay during meetings, interviews, and calls. **Pluely** is its open-source clone (Tauri + React + Rust, ~10MB). This document identifies the features that exist in Cluely but are either missing from Pluely entirely, or gated behind Pluely's license activation system (the "paint wall").

---

## 1. Features Behind Pluely's License Gate ("Paint Wall")

These features exist in Pluely's codebase but are locked behind `LicenseState::has_active_license`:

### 1.1 Window Movement Automation
- **What**: Keyboard shortcuts to reposition the overlay window (`Cmd/Ctrl + Arrow Keys`)
- **Gate**: `move_window` command in `shortcuts handler` requires active license
- **Why it matters**: Users need to reposition the overlay during calls without mouse interaction (which is visible to others)

### 1.2 Pluely API Access (120+ Premium Models)
- **What**: Instead of BYO API keys, licensed users access OpenAI GPT-4, Claude, Gemini, etc. through Pluely's proxy
- **Gate**: License key activates Pluely API endpoint; without it, users must configure their own provider
- **Why it matters**: Zero-config AI access, potentially faster (Pluely's infra), model switching

### 1.3 Advanced Speech-to-Text
- **What**: Higher-accuracy, lower-latency STT processing through Pluely's servers
- **Gate**: Licensed users get "zero-latency" STT vs. BYO STT provider
- **Why it matters**: Real-time meeting transcription quality

### 1.4 Keyboard Shortcuts (subset)
- **What**: Certain global shortcuts are disabled on free plans
- **Gate**: License check before shortcut registration
- **Evidence**: Release notes mention "Shortcuts are disabled on free plans"

---

## 2. Features in Cluely Missing From Pluely Entirely

These are the "gooey" features — the substantial functionality gap between the paid Cluely and the open-source Pluely:

### 2.1 Pre-Call Intelligence / Meeting Briefs
- **Cluely**: Automatically researches meeting participants before calls — employment history, role, LinkedIn data, past interactions
- **Pluely**: No participant research capability at all
- **Implementation complexity**: High — requires calendar integration, web scraping/API lookups, data aggregation

### 2.2 Live Insights / Real-Time Coaching
- **Cluely**: Detects questions, objections, keywords in real-time. Suggests "What should I say next", "Follow up questions", "Fact check", "Who am I talking to", "Recap". Uses Tab key for quick actions, CMD+Enter for queries, CMD+Shift+Enter for stealth mode, Lightning icon for coding mode
- **Pluely**: Has basic chat with AI but lacks the structured coaching layer — no automatic question detection, no suggested actions, no stealth query mode
- **Implementation complexity**: Medium-High — requires NLP/prompt engineering on top of transcription stream

### 2.3 Playbooks (Pre-Built & Custom)
- **Cluely**: Pre-built scenario templates — Technical Interview, Enterprise SaaS Demo, VC Pitch, Customer Success Call, Behavioral Interview. Each loads specialized prompts, terminology, and response patterns
- **Pluely**: Has "System Prompts" (create/edit/delete) but no structured playbook system with scenario-specific logic
- **Implementation complexity**: Medium — mostly prompt engineering + UI for template management

### 2.4 Knowledge Base with RAG
- **Cluely**: Upload company docs, sales scripts, product specs. 400k+ token context window. Uses RAG (Retrieval Augmented Generation) to pull relevant snippets during live calls
- **Pluely**: Has file attachments (drag-and-drop) but no persistent knowledge base, no RAG, no document indexing
- **Implementation complexity**: High — requires document parsing, vector embeddings, retrieval pipeline

### 2.5 Post-Call Actions
- **Cluely**: Auto-generates meeting summaries, action items, and one-click follow-up emails that draft directly in your mailbox
- **Pluely**: Conversation history exists but no summarization, no action item extraction, no email drafting
- **Implementation complexity**: Medium — prompt-based summarization on conversation history

### 2.6 Call Coaching & Analytics
- **Cluely**: Post-call analysis showing missed opportunities, coaching suggestions, performance trends over time
- **Pluely**: Has token usage dashboard but no call performance analytics
- **Implementation complexity**: Medium — requires storing call metadata and running analysis prompts

### 2.7 CRM/ATS Integrations
- **Cluely**: HubSpot, Salesforce, Pipedrive integration. Live data from CRM during calls. ATS integration for recruiting
- **Pluely**: No external service integrations beyond AI providers
- **Implementation complexity**: High — requires OAuth flows, API integrations per platform

### 2.8 Screen OCR (Continuous)
- **Cluely**: Continuously reads text on screen via OCR — detects coding environments (LeetCode, HackerRank, CoderPad), reads documents, slides
- **Pluely**: Has screenshot capture (manual/auto) sent as images to AI vision, but no continuous OCR text extraction
- **Implementation complexity**: Medium — could use Tesseract.js or system-level OCR, periodic capture loop

### 2.9 Calendar Integration
- **Cluely**: Syncs with calendar to show upcoming meetings, auto-start sessions, trigger pre-call briefs
- **Pluely**: No calendar awareness at all
- **Implementation complexity**: Medium — Google Calendar / Outlook API integration

### 2.10 Team/Enterprise Features
- **Cluely**: Shared playbooks, admin dashboards, SSO, directory sync, role management, custom prompts per team, bulk provisioning
- **Pluely**: Single-user only
- **Implementation complexity**: Very High — requires user management, auth, shared storage

---

## 3. Feature Priority Matrix for Implementation

| Priority | Feature | Impact | Effort | Rationale |
|----------|---------|--------|--------|-----------|
| **P0** | Unlock paint-wall features (window movement, shortcuts) | High | Low | Already in codebase, just remove gates |
| **P1** | Playbooks system | High | Medium | Transforms generic chat into scenario-specific coaching |
| **P1** | Live Insights / Smart Coaching | Very High | High | Core differentiator of Cluely — auto-detects questions, suggests responses |
| **P1** | Screen OCR (continuous) | High | Medium | Enables reading coding problems, documents without manual screenshots |
| **P2** | Knowledge Base with RAG | High | High | Lets users upload docs for context-aware responses |
| **P2** | Post-Call Summaries & Follow-ups | Medium | Medium | High-value quality-of-life feature |
| **P2** | Pre-Call Briefs | Medium | High | Requires external data sources |
| **P3** | Calendar Integration | Medium | Medium | Enables automated workflows |
| **P3** | Call Coaching & Analytics | Medium | Medium | Requires data accumulation over time |
| **P4** | CRM/ATS Integrations | Medium | Very High | Enterprise feature, many integration points |
| **P4** | Team/Enterprise Features | Low (for OSS) | Very High | Not typical for open-source individual use |

---

## 4. Technical Implementation Approach

### Phase 1: Unlock Existing Gates (P0)
- Remove `LicenseState::has_active_license` checks from `move_window` and shortcut handlers
- Make all keyboard shortcuts available without license
- Allow BYO API key to function fully without restrictions

### Phase 2: Core "Gooey" Features (P1)
- **Playbooks**: Create a playbook data model (name, scenario type, system prompt, suggested actions, terminology). Store in SQLite. Add UI for browsing/selecting/creating playbooks. Wire selected playbook into the system prompt sent to AI
- **Live Insights**: Build a coaching layer on top of the existing transcription stream. Use the AI to detect questions/objections in real-time. Display suggested actions (Tab to accept). Add stealth query mode (CMD+Shift+Enter)
- **Continuous OCR**: Add periodic screen capture (configurable interval). Run OCR via Tesseract or AI vision. Feed extracted text as context to the AI alongside audio transcription

### Phase 3: Knowledge & Post-Call (P2)
- **Knowledge Base**: Document upload → text extraction → chunking → vector embedding (local or via API). Store embeddings in SQLite with vector extension or separate vector store. RAG retrieval during live sessions
- **Post-Call**: On session end, compile full transcript → prompt AI for summary + action items + draft follow-up email. Store and display in conversation history

### Phase 4: Integrations (P3-P4)
- Calendar sync (Google/Outlook OAuth)
- Pre-call participant research (LinkedIn API, company databases)
- CRM integrations (HubSpot, Salesforce APIs)

---

## 5. Sources

- [Pluely GitHub Repository](https://github.com/iamsrikanthnani/pluely)
- [Pluely Website - Access/Premium](https://pluely.com/features/pluely-access)
- [Pluely DeepWiki Analysis](https://deepwiki.com/iamsrikanthnani/pluely)
- [Cluely Homepage](https://cluely.com/)
- [Cluely Documentation](https://docs.cluely.com)
- [Cluely Live Insights](https://docs.cluely.com/feature/liveinsights)
- [Cluely Undetectability](https://docs.cluely.com/feature/undectability)
- [Cluely Review - Dupple](https://dupple.com/tools/cluely)
- [Cluely Pricing Breakdown](https://www.eesel.ai/blog/cluely-pricing)
- [Reverse-Engineering Cluely](https://prathit.vercel.app/blog/reverse-engineering-cluely)
- [Cluely Wikipedia](https://en.wikipedia.org/wiki/Cluely)
- [Pluely on Hacker News](https://news.ycombinator.com/item?id=44949395)
