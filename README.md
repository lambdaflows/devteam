# Agor Multi-Agent Extraction for Freely

This repository contains the extracted multi-agent orchestration functionality from [Agor](https://github.com/preset-io/agor) for integration into the Freely project.

## Quick Start

1. **Read the summary**: [`SUMMARY.md`](./SUMMARY.md)
2. **Review extracted code**: [`extracted-from-agor/README.md`](./extracted-from-agor/README.md)
3. **Check file inventory**: [`extracted-from-agor/FILE_INVENTORY.md`](./extracted-from-agor/FILE_INVENTORY.md)
4. **See extraction plan**: [`abstractions/EXTRACTION_PLAN.md`](./abstractions/EXTRACTION_PLAN.md)

## What's Inside

### 📁 `extracted-from-agor/`
**51 TypeScript files** extracted from Agor, including:
- **Base abstraction layer** - ITool interface that all agents implement
- **Claude Code handler** - Full implementation using `@anthropic-ai/claude-agent-sdk`
- **Codex handler** - Implementation using `@openai/codex-sdk`
- **Gemini handler** - Implementation using `@google/gemini-cli-core`
- **Core SDK re-exports** - Centralized SDK management

### 📄 Documentation

- **`SUMMARY.md`** - Executive summary and next steps
- **`abstractions/EXTRACTION_PLAN.md`** - Detailed analysis of Agor's architecture
- **`extracted-from-agor/README.md`** - Integration guide for Freely
- **`extracted-from-agor/FILE_INVENTORY.md`** - Complete file listing with descriptions

## Key Insights

### ✅ Use Official SDKs, Not Custom Implementations

Agor doesn't reinvent the wheel. It wraps official SDKs:
- Claude Code: `@anthropic-ai/claude-agent-sdk`
- Codex: `@openai/codex-sdk`
- Gemini: `@google/gemini-cli-core`

### ✅ Claude Code Uses OAuth (No API Keys!)

```bash
# User runs once:
claude login

# SDK automatically uses stored credentials
# No API key management needed!
```

This is a major advantage - Agor (and Freely) can use Claude Code without managing API keys.

### ✅ The Value is the Abstraction Layer

The `ITool` interface provides:
- Unified API across all agents
- Permission mode translation
- Streaming support
- Response normalization
- Session management

## Integration Path

### Phase 1: Adapt Storage (1-2 days)
Create adapters mapping Agor's interfaces to Freely's data layer

### Phase 2: Remove Dependencies (2-3 days)
Remove FeathersJS, Drizzle ORM, and other Agor-specific code

### Phase 3: Create Orchestrator (1 day)
Build unified agent orchestrator for Freely

### Phase 4: Test Integration (2-3 days)
Test each agent independently

**Total Estimate**: 1-2 weeks

## Quick Example

```typescript
import { ClaudeTool } from './extracted-from-agor/claude/claude-tool';

// Create tool instance
const tool = new ClaudeTool(storage);

// Check if Claude is installed
const isInstalled = await tool.checkInstalled();

// Execute a task
const result = await tool.executeTask(
  sessionId,
  'Fix the bug in src/app.ts'
);
```

## Dependencies to Install

```bash
npm install @anthropic-ai/claude-agent-sdk
npm install @openai/codex-sdk
npm install @google/gemini-cli-core
```

## File Structure

```
freely-upbring/
├── README.md                        # This file
├── SUMMARY.md                       # Executive summary
├── abstractions/                    # Design docs
│   ├── DESIGN.md                    # Original design (pre-Agor)
│   └── EXTRACTION_PLAN.md           # Detailed extraction plan
└── extracted-from-agor/             # Actual Agor code
    ├── README.md                    # Integration guide
    ├── FILE_INVENTORY.md            # All files listed
    ├── base/                        # ITool interface
    ├── claude/                      # Claude Code handler
    ├── codex/                       # Codex handler
    ├── gemini/                      # Gemini handler
    └── core/                        # SDK re-exports
```

## Next Steps

1. ✅ Extraction complete
2. ⬜ Review with Freely team
3. ⬜ Create Freely storage adapters
4. ⬜ Remove Agor dependencies
5. ⬜ Test Claude Code integration
6. ⬜ Expand to Codex and Gemini
7. ⬜ Integrate into Freely UI

## Questions to Answer

Before integration, the Freely team should decide:

1. **Storage**: What persistence layer does Freely use?
2. **Sessions**: How does Freely track agent sessions?
3. **Isolation**: Git worktrees, containers, or another method?
4. **Streaming**: Does Freely's UI support real-time streaming?
5. **MCP**: Does Freely need Model Context Protocol servers?
6. **Permissions**: How should permission prompts work in Freely's UX?

## Resources

- **Agor Repository**: https://github.com/preset-io/agor
- **Claude Agent SDK**: https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk
- **Agor Documentation**: https://agor.live
- **License**: Apache 2.0 (same as Agor)

---

**Status**: ✅ Extraction Complete | ⬜ Integration Pending
