# Agor Multi-Agent Extraction - Summary

## Completed Work

Successfully extracted Agor's multi-agent orchestration functionality for integration into the Freely project.

## What Was Done

### 1. Architecture Analysis
- Analyzed Agor's codebase at https://github.com/preset-io/agor
- Identified core abstraction patterns
- Documented authentication approaches for each agent type

### 2. Key Findings

**Agor's Architecture**:
- Uses official SDKs (not custom implementations):
  - `@anthropic-ai/claude-agent-sdk` for Claude Code
  - `@openai/codex-sdk` for Codex
  - `@google/gemini-cli-core` for Gemini
- Provides unified `ITool` interface wrapping these SDKs
- Handles SDK differences (permissions, streaming, auth)

**Claude Code Authentication** (Key Feature):
- Uses `claude login` OAuth flow
- Stores credentials locally in `~/.claude/`
- **No API keys needed** - SDK reads local credentials
- This is a major advantage over API-based approaches

### 3. Files Extracted

```
extracted-from-agor/
├── base/                    # Core ITool interface
│   ├── tool.interface.ts
│   ├── types.ts
│   ├── mcp-scoping.ts
│   └── normalizer.interface.ts
├── claude/                  # Claude Code handler
│   ├── claude-tool.ts
│   ├── query-builder.ts
│   ├── prompt-service.ts
│   ├── message-processor.ts
│   └── ...
├── codex/                   # Codex handler
├── gemini/                  # Gemini handler
└── core/                    # SDK re-exports
    ├── sdk.ts
    └── agentic-tool-types.ts
```

### 4. Documentation Created

1. **`abstractions/DESIGN.md`**
   - Original design thinking (before discovering Agor)
   - Useful for understanding requirements

2. **`abstractions/EXTRACTION_PLAN.md`**
   - Detailed analysis of what to extract
   - Authentication flows for each agent
   - Integration strategy

3. **`extracted-from-agor/README.md`**
   - Comprehensive integration guide
   - Code examples
   - Adaptation steps for Freely
   - Next steps and questions to resolve

## Key Insights

### 1. Don't Reinvent the Wheel
Agor doesn't implement agent protocols from scratch. It wraps official SDKs with a unified interface. Freely should do the same.

### 2. Claude Code's Authentication is Superior
- Uses OAuth via `claude login`
- No API key management needed
- Credentials stored locally and managed by SDK
- More secure than passing API keys

### 3. The Value is in the Abstraction Layer
- `ITool` interface provides consistency
- Permission mode translation
- Streaming callbacks
- Session management
- Response normalization

### 4. Minimal Dependencies Needed
Only need to install official SDKs:
```json
{
  "@anthropic-ai/claude-agent-sdk": "^0.1.55",
  "@openai/codex-sdk": "latest",
  "@google/gemini-cli-core": "latest"
}
```

## Integration Path for Freely

### Phase 1: Adapt Storage Layer
Create adapters that map Agor's expected interfaces to Freely's data layer:
- `MessagesRepository` → Freely's message storage
- `SessionRepository` → Freely's session storage
- `TasksService` → Freely's task management

### Phase 2: Remove Agor Dependencies
- Replace FeathersJS services with Freely's equivalents
- Remove Drizzle ORM references
- Adapt MCP server configuration (if needed)
- Remove worktree-specific code (if Freely uses different isolation)

### Phase 3: Create Orchestrator
```typescript
class FreelyAgentOrchestrator {
  async execute(sessionId, prompt, agentType) {
    const tool = this.getTool(agentType);
    return tool.executeTask(sessionId, prompt);
  }
}
```

### Phase 4: Test Integration
- Test each agent independently
- Verify streaming works
- Test permission modes
- Validate authentication flows

## What NOT to Extract

Keep these in Agor (not relevant for Freely):
- Spatial canvas UI
- Multiplayer features (cursors, facepiles)
- Board/zone system
- Real-time WebSocket broadcasting
- Zellij terminal integration
- Daemon architecture
- LibSQL database schema

## Next Steps

1. ✅ Extraction complete
2. ⬜ Review extracted code with Freely team
3. ⬜ Create Freely storage adapters
4. ⬜ Remove Agor-specific dependencies
5. ⬜ Test Claude Code integration first (easiest)
6. ⬜ Expand to Codex and Gemini
7. ⬜ Integrate into Freely's UI

## Questions for Freely Team

1. **Storage Layer**: What does Freely use for persistence? (SQL, NoSQL, file-based?)
2. **Session Model**: How does Freely track sessions? Need `sdk_session_id` persistence?
3. **Isolation**: Does Freely use Git worktrees, containers, or another isolation method?
4. **Streaming**: Does Freely's UI support real-time streaming? Keep streaming callbacks?
5. **MCP Support**: Does Freely need Model Context Protocol server integration?
6. **Permission UX**: How should Freely handle agent permission prompts?

## Files Overview

```
/Users/safa/.agor/worktrees/safa0/devteam/freely-upbring/
├── abstractions/                    # Original design docs
│   ├── DESIGN.md
│   ├── EXTRACTION_PLAN.md
│   └── core/                        # Early attempts (can delete)
├── extracted-from-agor/             # ✅ Actual Agor code
│   ├── README.md                    # Integration guide
│   ├── base/                        # Core interfaces
│   ├── claude/                      # Claude handler
│   ├── codex/                       # Codex handler
│   ├── gemini/                      # Gemini handler
│   └── core/                        # SDK re-exports
└── SUMMARY.md                       # This file
```

## Success Criteria

✅ Extracted all relevant code from Agor
✅ Documented authentication flows
✅ Created integration guides
✅ Identified Agor-specific dependencies to remove
✅ Provided clear next steps for Freely team

## Time Estimate for Integration

- **Phase 1** (Storage adapters): 1-2 days
- **Phase 2** (Remove dependencies): 2-3 days
- **Phase 3** (Orchestrator): 1 day
- **Phase 4** (Testing): 2-3 days
- **Total**: ~1-2 weeks for basic integration

## References

- **Agor Repository**: https://github.com/preset-io/agor
- **Claude Agent SDK**: https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk
- **Codex SDK**: https://www.npmjs.com/package/@openai/codex-sdk
- **Gemini CLI Core**: https://www.npmjs.com/package/@google/gemini-cli-core

## License Note

Agor is licensed under Apache 2.0. Ensure Freely's usage complies with license terms:
- Must preserve copyright notices
- Must include license text
- Can modify and distribute
- Can use commercially
