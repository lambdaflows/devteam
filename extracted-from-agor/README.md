# Extracted Agor Multi-Agent Components

This directory contains the multi-agent orchestration code extracted from [Agor](https://github.com/preset-io/agor) for integration into the Freely project.

## What Was Extracted

### Directory Structure

```
extracted-from-agor/
├── base/                  # Core ITool interface and types
│   ├── tool.interface.ts  # Main ITool interface
│   ├── types.ts           # Shared types (StreamingCallbacks, etc.)
│   ├── mcp-scoping.ts     # MCP server configuration
│   └── normalizer.interface.ts
├── claude/                # Claude Code handler implementation
│   ├── claude-tool.ts     # Main ClaudeTool class
│   ├── query-builder.ts   # Session setup and configuration
│   ├── prompt-service.ts  # Execution service
│   ├── message-processor.ts
│   ├── message-builder.ts
│   └── permissions/
├── codex/                 # Codex handler implementation
│   ├── codex-tool.ts
│   ├── prompt-service.ts
│   └── ...
├── gemini/                # Gemini handler implementation
│   ├── gemini-tool.ts
│   ├── prompt-service.ts
│   └── ...
└── core/                  # Core SDK re-exports and types
    ├── sdk.ts             # Re-exports of official SDKs
    └── agentic-tool-types.ts
```

## Key Components

### 1. ITool Interface (`base/tool.interface.ts`)

The universal interface that all agent implementations must follow:

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

### 2. Agent Handlers

Each handler (`ClaudeTool`, `CodexTool`, `GeminiTool`) implements `ITool` and wraps the official SDK:

- **Claude Code**: Uses `@anthropic-ai/claude-agent-sdk`
- **Codex**: Uses `@openai/codex-sdk`
- **Gemini**: Uses `@google/gemini-cli-core`

### 3. Streaming Support

Real-time streaming via `StreamingCallbacks`:

```typescript
interface StreamingCallbacks {
  onStreamStart(messageId: string, metadata): Promise<void>;
  onStreamChunk(messageId: string, chunk: string): Promise<void>;
  onStreamEnd(messageId: string): Promise<void>;
  onStreamError(messageId: string, error: Error): Promise<void>;
}
```

## What Needs to Be Removed/Adapted

### Agor-Specific Dependencies

The extracted code has dependencies on Agor's infrastructure that must be removed:

1. **FeathersJS Services** (`MessagesService`, `TasksService`, `SessionsService`)
   - Replace with Freely's data layer
   - Remove WebSocket broadcasting

2. **Drizzle ORM Repositories** (`MessagesRepository`, `SessionRepository`, etc.)
   - Replace with Freely's ORM/database layer

3. **Agor Core Utilities**
   - `@agor/core/db` - Replace with Freely's ID generation
   - `@agor/core/types` - Copy needed types or recreate
   - `@agor/core/templates` - Adapt system prompts

4. **Worktree Management**
   - Agor uses Git worktrees for isolation
   - Freely may use a different isolation strategy

### Example Adaptation

**Before (Agor)**:
```typescript
import { MessagesRepository } from '../../db/feathers-repositories';
import type { MessagesService } from './claude-tool';

class ClaudeTool {
  constructor(
    private messagesRepo: MessagesRepository,
    private messagesService: MessagesService
  ) {}

  async executeTask(sessionId, prompt) {
    // Use FeathersJS service
    await this.messagesService.create({ ... });
  }
}
```

**After (Freely)**:
```typescript
import { FreelyMessageStore } from './freely-message-store';

class ClaudeTool {
  constructor(
    private messageStore: FreelyMessageStore
  ) {}

  async executeTask(sessionId, prompt) {
    // Use Freely's storage
    await this.messageStore.save({ ... });
  }
}
```

## Integration Steps for Freely

### Step 1: Install Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.55",
    "@openai/codex-sdk": "latest",
    "@google/gemini-cli-core": "latest"
  }
}
```

### Step 2: Create Storage Adapters

Create interfaces that match Agor's patterns but use Freely's storage:

```typescript
// freely-storage-adapter.ts
export interface FreelyStorageAdapter {
  saveMessage(message: Message): Promise<void>;
  loadMessages(sessionId: string): Promise<Message[]>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<void>;
}
```

### Step 3: Adapt Handler Classes

Modify each handler to use Freely's storage:

```typescript
// freely-claude-tool.ts
import { ClaudeTool } from './extracted-from-agor/claude/claude-tool';
import { FreelyStorageAdapter } from './freely-storage-adapter';

export class FreelyClaudeTool extends ClaudeTool {
  constructor(storage: FreelyStorageAdapter) {
    // Adapt storage to Agor's expected interface
    super(
      adaptToMessagesRepo(storage),
      adaptToSessionsRepo(storage),
      // ... other adapted dependencies
    );
  }
}
```

### Step 4: Create Orchestrator

```typescript
// freely-agent-orchestrator.ts
export class FreelyAgentOrchestrator {
  private tools: Map<AgentType, ITool> = new Map();

  constructor(private storage: FreelyStorageAdapter) {
    // Register available agents
    this.tools.set('claude-code', new FreelyClaudeTool(storage));
    this.tools.set('codex', new FreelyCodexTool(storage));
    this.tools.set('gemini', new FreelyGeminiTool(storage));
  }

  async execute(
    sessionId: string,
    prompt: string,
    agentType: AgentType = 'claude-code'
  ): Promise<TaskResult> {
    const tool = this.tools.get(agentType);
    if (!tool) throw new Error(`Agent ${agentType} not available`);

    return tool.executeTask(sessionId, prompt);
  }
}
```

### Step 5: Use in Freely

```typescript
import { FreelyAgentOrchestrator } from './freely-agent-orchestrator';

const orchestrator = new FreelyAgentOrchestrator(storage);

// Execute with Claude Code
await orchestrator.execute(
  sessionId,
  "Fix the bug in src/app.ts",
  'claude-code'
);

// Execute with Codex
await orchestrator.execute(
  sessionId,
  "Add unit tests",
  'codex'
);
```

## Authentication Flows

### Claude Code (Recommended)

Uses `claude login` - no API keys needed!

```bash
# User runs once:
claude login

# SDK automatically uses stored credentials
```

In code:
```typescript
const tool = new ClaudeTool();
// No API key needed - SDK reads from ~/.claude/
await tool.executeTask(sessionId, prompt);
```

### Codex

Requires API key:

```typescript
const tool = new CodexTool({ apiKey: process.env.OPENAI_API_KEY });
```

### Gemini

Requires API key or OAuth:

```typescript
const tool = new GeminiTool({ apiKey: process.env.GOOGLE_API_KEY });
```

## Permission Mode Translation

Agor uses unified permission modes that get translated to agent-specific modes:

```typescript
// Unified Freely/Agor modes
type PermissionMode =
  | 'default'          // Prompt for each operation
  | 'acceptEdits'      // Auto-approve file edits
  | 'bypassPermissions' // Auto-approve all
  | 'plan'             // Require plan approval first
  | 'ask'              // Ask for every operation
  | 'auto';            // Full autonomous mode

// Agent-specific translation happens in each handler
```

## Testing the Integration

```typescript
// test-claude-integration.ts
import { FreelyClaudeTool } from './freely-claude-tool';
import { FreelyStorageAdapter } from './freely-storage-adapter';

async function testClaude() {
  const storage = new FreelyStorageAdapter(/* ... */);
  const tool = new FreelyClaudeTool(storage);

  // Check if Claude is installed
  const isInstalled = await tool.checkInstalled();
  if (!isInstalled) {
    console.error('Claude Code not installed');
    return;
  }

  // Execute a simple task
  const result = await tool.executeTask(
    'test-session-id',
    'Create a hello world function in TypeScript'
  );

  console.log('Task completed:', result);
}

testClaude().catch(console.error);
```

## Key Files to Review

1. **`base/tool.interface.ts`** - Understand the ITool contract
2. **`claude/claude-tool.ts`** - See how Claude SDK is wrapped
3. **`claude/query-builder.ts`** - Understand session setup
4. **`claude/message-processor.ts`** - See how streaming works
5. **`base/types.ts`** - All type definitions

## Next Steps

1. ✅ **Extracted code** from Agor
2. ⬜ **Create Freely storage adapters** - Map to Freely's data layer
3. ⬜ **Remove Agor dependencies** - Replace Feathers, Drizzle, etc.
4. ⬜ **Test each handler** independently
5. ⬜ **Create orchestrator** for Freely
6. ⬜ **Integrate with Freely** UI and workflows

## Questions to Resolve

1. **Session Management**: How does Freely handle sessions? Does it need `sdk_session_id` persistence?
2. **Isolation**: Does Freely use Git worktrees, containers, or another isolation method?
3. **Streaming**: Does Freely's UI support real-time streaming? Should we keep streaming callbacks?
4. **MCP Servers**: Does Freely need MCP (Model Context Protocol) server support?
5. **Permission System**: How should Freely handle permission prompts?

## Reference

- **Agor Repository**: https://github.com/preset-io/agor
- **Claude Agent SDK**: https://github.com/anthropics/claude-agent-sdk
- **Extraction Plan**: See `../EXTRACTION_PLAN.md`

## License

This code is extracted from Agor which is licensed under Apache 2.0.
Ensure Freely's usage complies with the license terms.
