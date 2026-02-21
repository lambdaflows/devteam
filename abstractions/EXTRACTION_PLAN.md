# Agor Multi-Agent Extraction Plan

## Overview

This document outlines what needs to be extracted from Agor (https://github.com/preset-io/agor) to enable multi-agent functionality in Freely.

## Key Insight: Official SDK Abstraction

Agor doesn't implement agent protocols from scratch. Instead, it:

1. Uses official SDKs for each agent:
   - **Claude Code**: `@anthropic-ai/claude-agent-sdk`
   - **Codex**: `@openai/codex-sdk`
   - **Gemini**: `@google/gemini-cli-core`
   - **OpenCode**: `@opencode-ai/sdk`

2. Provides a unified `ITool` interface that wraps these SDKs

3. Handles the differences in:
   - Permission modes
   - Authentication approaches
   - Streaming capabilities
   - Session management

## Authentication Approaches

Each SDK handles auth differently:

### Claude Code (`@anthropic-ai/claude-agent-sdk`)
- **Method**: `claude login` OAuth flow (no API key needed)
- **Storage**: SDK stores credentials locally in `~/.claude/`
- **Agor Integration**: Just passes optional `apiKey` parameter to SDK
- **Key Benefit**: Uses local credentials instead of API keys

### Codex (`@openai/codex-sdk`)
- **Method**: API key required
- **Storage**: Agor passes API key from user environment
- **Configuration**: Dual permission model (sandbox mode + approval policy)

### Gemini (`@google/gemini-cli-core`)
- **Method**: API key or OAuth
- **Storage**: SDK handles auth state
- **Configuration**: ApprovalMode (default/autoEdit/yolo)

## Files to Extract

### 1. Base Abstraction Layer

**Location**: `/packages/executor/src/sdk-handlers/base/`

Files:
- `tool.interface.ts` - Core `ITool` interface
- `types.ts` - Shared types (ToolCapabilities, StreamingCallbacks, etc.)
- `mcp-scoping.ts` - MCP server configuration logic
- `normalizer.interface.ts` - Response normalization

**Purpose**: Universal interface that all agents implement

### 2. Claude Code Handler

**Location**: `/packages/executor/src/sdk-handlers/claude/`

Key files:
- `claude-tool.ts` - Main `ClaudeTool` class implementing `ITool`
- `query-builder.ts` - Session setup, auth, MCP configuration
- `prompt-service.ts` - Execution service using Claude Agent SDK
- `message-processor.ts` - Stream processing and message handling
- `message-builder.ts` - Message construction utilities
- `normalizer.ts` - Response normalization
- `permissions/permission-hooks.ts` - Permission handling

**Critical Features**:
- Uses `@anthropic-ai/claude-agent-sdk` query() function
- Supports session resume via `sdk_session_id`
- Real-time streaming with chunk buffering
- MCP server integration
- Permission mode translation

### 3. Codex Handler

**Location**: `/packages/executor/src/sdk-handlers/codex/`

Files to check:
- `codex-tool.ts` (or similar main file)
- `prompt-service.ts`
- Permission handling
- Dual sandbox/approval model

### 4. Gemini Handler

**Location**: `/packages/executor/src/sdk-handlers/gemini/`

Files to check:
- `gemini-tool.ts` (or similar)
- `prompt-service.ts`
- Permission mode mapping
- Conversation conversion

### 5. Core SDK Re-exports

**Location**: `/packages/core/src/sdk/index.ts`

```typescript
export * as Claude from '@anthropic-ai/claude-agent-sdk';
export * as Codex from '@openai/codex-sdk';
export * as Gemini from '@google/gemini-cli-core';
export * as OpenCode from '@opencode-ai/sdk';
```

**Purpose**: Centralized SDK version management

### 6. Supporting Utilities

**Permission Mode Mapping**:
- Location: `/packages/core/src/utils/permission-mode-mapper.ts`
- Translates between Agor's unified permission modes and agent-specific modes

**MCP Configuration**:
- Location: `/packages/core/src/tools/mcp/`
- JWT auth, OAuth handling, transport configuration

## What NOT to Extract

**Agor-Specific Features** (keep in Agor):
- Spatial canvas UI
- Multiplayer collaboration
- Board/zone system
- Worktree management (Git-specific)
- Real-time cursors/facepiles
- FeathersJS integration
- Database schema (LibSQL/Drizzle)
- Daemon architecture
- Zellij integration

## Extraction Strategy

### Phase 1: Copy Base Interface
1. Copy `/packages/executor/src/sdk-handlers/base/`
2. Remove Agor-specific dependencies (repositories, FeathersJS)
3. Create generic storage abstraction

### Phase 2: Copy SDK Wrappers
For each handler (Claude, Codex, Gemini):
1. Copy handler directory
2. Remove Feathers/DB dependencies
3. Keep SDK integration logic
4. Adapt to Freely's storage layer

### Phase 3: Copy Core Utilities
1. SDK re-exports
2. Permission mode mapping
3. MCP authentication (if needed)

### Phase 4: Create Freely Integration Layer
1. Implement storage adapters for Freely's data layer
2. Create session management for Freely
3. Integrate with Freely's authentication system

## Dependencies to Add

```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "latest",
    "@openai/codex-sdk": "latest",
    "@google/gemini-cli-core": "latest",
    "@opencode-ai/sdk": "latest"
  }
}
```

## Key Design Patterns from Agor

### 1. ITool Interface Pattern
```typescript
interface ITool {
  readonly toolType: ToolType;
  readonly name: string;

  getCapabilities(): ToolCapabilities;
  checkInstalled(): Promise<boolean>;

  executeTask?(
    sessionId: string,
    prompt: string,
    taskId?: string,
    streamingCallbacks?: StreamingCallbacks
  ): Promise<TaskResult>;

  normalizedSdkResponse(rawResponse: RawSdkResponse): NormalizedSdkResponse;
}
```

### 2. Streaming Callbacks Pattern
```typescript
interface StreamingCallbacks {
  onStreamStart(messageId: string, metadata): Promise<void>;
  onStreamChunk(messageId: string, chunk: string): Promise<void>;
  onStreamEnd(messageId: string): Promise<void>;
  onStreamError(messageId: string, error: Error): Promise<void>;
}
```

### 3. Permission Mode Translation
```typescript
// Agor's unified modes
type PermissionMode =
  | 'default' | 'acceptEdits' | 'bypassPermissions'
  | 'plan' | 'ask' | 'auto';

// Translate to agent-specific modes
function mapToClaudeMode(mode: PermissionMode): Claude.PermissionMode;
function mapToCodexMode(mode: PermissionMode): { sandbox, approval };
function mapToGeminiMode(mode: PermissionMode): Gemini.ApprovalMode;
```

## Integration with Freely

### Minimal Integration
```typescript
import { ClaudeTool } from './extracted/claude/claude-tool';
import { FreelyStorage } from './freely-storage-adapter';

const storage = new FreelyStorage(/* Freely's DB */);
const claudeTool = new ClaudeTool(storage);

// Execute prompt
const result = await claudeTool.executeTask(
  sessionId,
  "Fix the bug in src/app.ts",
  taskId,
  streamingCallbacks
);
```

### Full Multi-Agent Orchestrator
```typescript
class FreelyAgentOrchestrator {
  private tools: Map<ToolType, ITool> = new Map();

  registerTool(tool: ITool) {
    this.tools.set(tool.toolType, tool);
  }

  async executeWithBestAgent(
    sessionId: string,
    prompt: string,
    preferredAgent?: ToolType
  ): Promise<TaskResult> {
    const agent = preferredAgent || this.selectBestAgent(prompt);
    const tool = this.tools.get(agent);
    return tool.executeTask(sessionId, prompt);
  }
}
```

## Authentication Flow (Claude Code Example)

1. **User runs `claude login`** (outside Freely)
   - Stores credentials in `~/.claude/`
   - SDK reads credentials automatically

2. **Freely creates session**
   ```typescript
   const tool = new ClaudeTool();
   await tool.checkInstalled(); // Verifies claude CLI exists
   ```

3. **Freely executes task**
   ```typescript
   await tool.executeTask(sessionId, prompt);
   // SDK automatically uses credentials from ~/.claude/
   ```

**No API key management needed!** The SDK handles authentication.

## Summary

To enable multi-agent in Freely:

1. **Install official SDKs** as dependencies
2. **Copy Agor's ITool abstraction layer** (base interface)
3. **Copy agent handlers** (Claude, Codex, Gemini) with modifications
4. **Remove Agor-specific dependencies** (Feathers, Drizzle, etc.)
5. **Adapt to Freely's storage** and session management
6. **Keep SDK integration logic** - this is the valuable part!

The key insight: Agor's value is the **abstraction layer over official SDKs**, not reimplementing agent protocols. Extract the wrapper, not the SDKs themselves.
