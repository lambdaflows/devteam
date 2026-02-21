# Agor Multi-Agent Abstraction Layer

## Overview

This abstraction layer extracts Agor's core multi-agent orchestration capabilities into a portable, framework-agnostic module that can be integrated into the Freely project.

## Core Components

### 1. Agent Abstraction (`/core`)
- **Purpose**: Provide a unified interface for different AI agents (Claude Code, Codex, Gemini)
- **Key Concepts**:
  - Agent capabilities and tool sets
  - Permission modes (auto, ask, plan, etc.)
  - Context management (files, MCP servers)
  - Agent-specific configurations

### 2. Agent Translation (`/agents`)
- **Purpose**: Translate between different agent protocols and interfaces
- **Key Concepts**:
  - Protocol adapters for each agent type
  - Tool/capability mapping
  - Response normalization
  - Agent-specific authentication

### 3. Session Isolation (`/isolation`)
- **Purpose**: Isolate agent work in separate execution contexts
- **Key Concepts**:
  - Worktree management (git-based isolation)
  - Session lifecycle (spawn, fork, continue, subsession)
  - Genealogy tracking (parent-child relationships)
  - State management

### 4. Authentication Abstraction (`/auth`)
- **Purpose**: Handle authentication for different agent backends
- **Key Concepts**:
  - Claude Code login mechanism (local credential storage)
  - API key management
  - Token refresh and validation
  - Multi-provider authentication

## Architecture Principles

1. **Portability**: Zero dependencies on Agor-specific infrastructure
2. **Extensibility**: Easy to add new agent types
3. **Type Safety**: Full TypeScript typing for all interfaces
4. **Testability**: All components mockable and testable
5. **Framework Agnostic**: Can integrate with any Node.js/TypeScript project

## Integration Points

### For Agor (Current)
```typescript
import { AgentOrchestrator } from '@abstractions/core';
import { ClaudeCodeAdapter, CodexAdapter, GeminiAdapter } from '@abstractions/agents';
import { WorktreeIsolationProvider } from '@abstractions/isolation';
import { ClaudeCodeAuthProvider } from '@abstractions/auth';

const orchestrator = new AgentOrchestrator({
  agents: [
    new ClaudeCodeAdapter({ auth: new ClaudeCodeAuthProvider() }),
    new CodexAdapter({ auth: new ApiKeyAuthProvider() }),
    new GeminiAdapter({ auth: new ApiKeyAuthProvider() })
  ],
  isolation: new WorktreeIsolationProvider(),
  storage: new AgorStorageAdapter()
});
```

### For Freely (Future)
```typescript
import { AgentOrchestrator } from '@freely/agent-core';
import { ClaudeCodeAdapter } from '@freely/agent-core/adapters';

const orchestrator = new AgentOrchestrator({
  agents: [new ClaudeCodeAdapter()],
  isolation: new FreelyIsolationProvider(),
  storage: new FreelyStorageAdapter()
});
```

## Data Flow

```
User Request
    ↓
AgentOrchestrator
    ↓
[Select Agent Based on Capability]
    ↓
AgentAdapter (Claude/Codex/Gemini)
    ↓
AuthProvider (Get Credentials)
    ↓
IsolationProvider (Create/Manage Context)
    ↓
Agent Execution
    ↓
Response Normalization
    ↓
Result Storage
```

## Key Features to Abstract

### 1. Claude Code Login Integration
- Local credential storage (avoiding API keys)
- Session token management
- Cookie-based authentication
- Automatic token refresh

### 2. Agent Translation
- Unified tool interface
- Permission mode translation
- Context serialization
- Error normalization

### 3. Session Isolation
- Git worktree creation/management
- Environment variable isolation
- File system isolation
- Process isolation

### 4. Genealogy & Orchestration
- Parent-child session tracking
- Fork points and decision trees
- Session state management
- Task coordination

## Migration Path

1. **Phase 1**: Extract core interfaces (this phase)
2. **Phase 2**: Implement adapters with Agor integration
3. **Phase 3**: Test in parallel with existing Agor code
4. **Phase 4**: Migrate Agor to use abstractions
5. **Phase 5**: Package for Freely integration

## Non-Goals

- UI components (Agor-specific)
- Database schema (storage abstracted)
- Billing/pricing logic
- Multiplayer canvas features
