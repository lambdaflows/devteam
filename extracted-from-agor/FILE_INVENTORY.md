# Extracted Files Inventory

## Overview

51 TypeScript files extracted from Agor's multi-agent system.

## Base Abstraction Layer (5 files)

Core interfaces that all agents implement:

- **`base/index.ts`** - Barrel export for base modules
- **`base/tool.interface.ts`** - Main `ITool` interface (CRITICAL)
- **`base/types.ts`** - Shared types (StreamingCallbacks, ToolCapabilities, etc.)
- **`base/mcp-scoping.ts`** - MCP server configuration and scoping logic
- **`base/normalizer.interface.ts`** - Response normalization interface

## Claude Code Handler (21 files)

Implementation for Claude Code using `@anthropic-ai/claude-agent-sdk`:

### Core Files
- **`claude/claude-tool.ts`** - Main ClaudeTool class implementing ITool (CRITICAL)
- **`claude/query-builder.ts`** - Session setup, auth, MCP config (CRITICAL)
- **`claude/prompt-service.ts`** - Execution service using Claude Agent SDK (CRITICAL)
- **`claude/message-processor.ts`** - Stream processing and message handling
- **`claude/message-builder.ts`** - Message construction utilities
- **`claude/normalizer.ts`** - Response normalization for Claude
- **`claude/models.ts`** - Model configurations

### Import/Session Loading
- **`claude/import/load-session.ts`** - Load sessions from Claude's storage
- **`claude/import/message-converter.ts`** - Convert transcripts to messages
- **`claude/import/task-extractor.ts`** - Extract tasks from transcripts
- **`claude/import/transcript-parser.ts`** - Parse Claude transcript files
- **`claude/import/transcript-parser.test.ts`** - Tests

### Permissions
- **`claude/permissions/permission-hooks.ts`** - Permission handling logic

### Thinking Support
- **`claude/thinking-detector.ts`** - Detect and handle thinking blocks
- **`claude/thinking-detector.test.ts`** - Tests

### Session Management
- **`claude/session-context.ts`** - Session context utilities
- **`claude/session-context.test.ts`** - Tests
- **`claude/safe-message-service.ts`** - Safe message creation wrapper

### Tests
- **`claude/message-builder.test.ts`** - Message builder tests
- **`claude/query-builder.test.ts`** - Query builder tests

### Other
- **`claude/index.ts`** - Barrel export

## Codex Handler (10 files)

Implementation for Codex using `@openai/codex-sdk`:

### Core Files
- **`codex/codex-tool.ts`** - Main CodexTool class implementing ITool
- **`codex/prompt-service.ts`** - Execution service for Codex
- **`codex/normalizer.ts`** - Response normalization for Codex
- **`codex/models.ts`** - Model configurations
- **`codex/usage.ts`** - Token usage tracking

### Tests
- **`codex/prompt-service.test.ts`**
- **`codex/normalizer.test.ts`**
- **`codex/models.test.ts`**
- **`codex/usage.test.ts`**

### Other
- **`codex/index.ts`** - Barrel export

## Gemini Handler (13 files)

Implementation for Gemini using `@google/gemini-cli-core`:

### Core Files
- **`gemini/gemini-tool.ts`** - Main GeminiTool class implementing ITool
- **`gemini/prompt-service.ts`** - Execution service for Gemini
- **`gemini/normalizer.ts`** - Response normalization for Gemini
- **`gemini/models.ts`** - Model configurations
- **`gemini/usage.ts`** - Token usage tracking
- **`gemini/permission-mapper.ts`** - Map unified permissions to Gemini modes
- **`gemini/conversation-converter.ts`** - Convert to Gemini conversation format

### Tests
- **`gemini/prompt-service.test.ts`**
- **`gemini/normalizer.test.ts`**
- **`gemini/models.test.ts`**
- **`gemini/usage.test.ts`**
- **`gemini/permission-mapper.test.ts`**
- **`gemini/conversation-converter.test.ts`**

### Other
- **`gemini/index.ts`** - Barrel export

## Core SDK Re-exports (2 files)

Centralized SDK management:

- **`core/sdk.ts`** - Re-exports all official SDKs
- **`core/agentic-tool-types.ts`** - Unified agent type definitions

## File Statistics

- **Total Files**: 51 TypeScript files
- **Test Files**: 14 (27% test coverage)
- **Core Implementation**: 37 files
- **Lines of Code**: ~8,000+ (estimated)

## Critical Files for Integration

Start with these files to understand the architecture:

1. **`base/tool.interface.ts`** - The contract all agents follow
2. **`base/types.ts`** - Core type definitions
3. **`claude/claude-tool.ts`** - Reference implementation
4. **`claude/query-builder.ts`** - How sessions are set up
5. **`claude/prompt-service.ts`** - How prompts are executed
6. **`core/sdk.ts`** - SDK dependencies

## Dependency Graph

```
ITool (base/tool.interface.ts)
  ↓
ClaudeTool (claude/claude-tool.ts)
  ↓
ClaudePromptService (claude/prompt-service.ts)
  ↓
setupQuery (claude/query-builder.ts)
  ↓
@anthropic-ai/claude-agent-sdk
```

Similar pattern for Codex and Gemini handlers.

## Size Estimates

- **base/**: ~1,500 lines
- **claude/**: ~3,500 lines (largest handler)
- **codex/**: ~1,500 lines
- **gemini/**: ~1,500 lines
- **core/**: ~200 lines

## Maintenance Notes

### Files That May Need Updates
- SDK version changes → `core/sdk.ts`
- New agent types → `base/tool.interface.ts`
- Permission modes → Each handler's permission logic

### Files Safe to Modify
- Test files (*.test.ts)
- Normalizers (agent-specific response formatting)
- Models (configuration values)

### Files to Keep in Sync with Agor
- `base/tool.interface.ts` - Core contract
- `base/types.ts` - Shared types
- SDK re-exports in `core/sdk.ts`

## Next Actions

1. **Review Critical Files** - Start with the 6 critical files listed above
2. **Identify Dependencies** - Map Agor dependencies to Freely equivalents
3. **Create Adapters** - Build storage adapters for Freely
4. **Test Integration** - Start with Claude Code (simplest auth)
5. **Expand** - Add Codex and Gemini after Claude works

## Questions to Answer

For each file, determine:
- [ ] Does it have Agor-specific dependencies?
- [ ] Can it be used as-is in Freely?
- [ ] What needs to be adapted?
- [ ] What can be deleted (Freely doesn't need)?

Use this inventory as a checklist when integrating into Freely.
