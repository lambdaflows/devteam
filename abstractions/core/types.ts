/**
 * Core type definitions for the multi-agent abstraction layer
 */

/**
 * Supported agent types
 */
export type AgentType = 'claude-code' | 'cursor' | 'codex' | 'gemini';

/**
 * Permission modes for agent operations
 */
export type PermissionMode =
  | 'default'           // Use agent's default permission strategy
  | 'acceptEdits'       // Auto-accept file edits, ask for other operations
  | 'bypassPermissions' // Auto-approve all operations
  | 'plan'              // Require plan approval before execution
  | 'ask'               // Ask for every operation
  | 'auto'              // Full autonomous mode
  | 'on-failure'        // Ask only when operations fail
  | 'allow-all';        // Allow everything without prompts

/**
 * Session status
 */
export type SessionStatus = 'idle' | 'running' | 'completed' | 'failed';

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Agent type identifier */
  type: AgentType;

  /** Default permission mode */
  defaultPermissionMode?: PermissionMode;

  /** Agent-specific capabilities */
  capabilities?: AgentCapabilities;

  /** Custom configuration for this agent */
  config?: Record<string, unknown>;
}

/**
 * Agent capabilities
 */
export interface AgentCapabilities {
  /** Can read files */
  canRead?: boolean;

  /** Can write/edit files */
  canWrite?: boolean;

  /** Can execute bash commands */
  canExecute?: boolean;

  /** Can make web requests */
  canFetch?: boolean;

  /** Can use MCP tools */
  canUseMCP?: boolean;

  /** Supports planning mode */
  supportsPlanning?: boolean;

  /** Custom capabilities */
  custom?: Record<string, boolean>;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  /** Unique session identifier */
  id: string;

  /** Agent type for this session */
  agentType: AgentType;

  /** Permission mode */
  permissionMode: PermissionMode;

  /** Session title */
  title?: string;

  /** Session description */
  description?: string;

  /** Context files to load */
  contextFiles?: string[];

  /** MCP server IDs to attach */
  mcpServerIds?: string[];

  /** Parent session ID (for genealogy) */
  parentSessionId?: string;

  /** Worktree ID (for isolation) */
  worktreeId?: string;

  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Session state
 */
export interface SessionState {
  /** Session configuration */
  config: SessionConfig;

  /** Current status */
  status: SessionStatus;

  /** Created timestamp */
  createdAt: Date;

  /** Last updated timestamp */
  updatedAt: Date;

  /** Task history */
  taskIds?: string[];

  /** Current working directory */
  workingDirectory?: string;

  /** Environment variables */
  env?: Record<string, string>;
}

/**
 * Task (user prompt) in a session
 */
export interface Task {
  /** Unique task identifier */
  id: string;

  /** Session this task belongs to */
  sessionId: string;

  /** User prompt */
  prompt: string;

  /** Task status */
  status: SessionStatus;

  /** Created timestamp */
  createdAt: Date;

  /** Completed timestamp */
  completedAt?: Date;

  /** Parent task ID (for sub-tasks) */
  parentTaskId?: string;

  /** Result/output */
  result?: unknown;

  /** Error if failed */
  error?: Error;
}

/**
 * Worktree configuration
 */
export interface WorktreeConfig {
  /** Unique worktree identifier */
  id: string;

  /** Repository ID */
  repoId: string;

  /** Worktree name (directory name) */
  name: string;

  /** Git ref (branch/commit) */
  ref: string;

  /** Base branch (when creating new branch) */
  sourceBranch?: string;

  /** Create new branch */
  createBranch?: boolean;

  /** Pull latest before creating */
  pullLatest?: boolean;

  /** Associated issue URL */
  issueUrl?: string;

  /** Associated PR URL */
  pullRequestUrl?: string;

  /** Board placement */
  boardId?: string;

  /** Custom context */
  customContext?: Record<string, unknown>;
}

/**
 * Worktree state
 */
export interface WorktreeState {
  /** Worktree configuration */
  config: WorktreeConfig;

  /** Physical path on disk */
  path: string;

  /** Current git branch */
  currentBranch: string;

  /** Current git commit SHA */
  currentCommit: string;

  /** Git status (dirty/clean) */
  isDirty: boolean;

  /** Created timestamp */
  createdAt: Date;

  /** Active sessions in this worktree */
  sessionIds?: string[];
}

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  /** Authentication type */
  type: 'api-key' | 'oauth' | 'session-token' | 'claude-code-login';

  /** Credential data (type-specific) */
  credentials: Record<string, unknown>;

  /** Expiration timestamp */
  expiresAt?: Date;

  /** Refresh token/mechanism */
  refreshToken?: string;
}

/**
 * Agent response
 */
export interface AgentResponse {
  /** Response content */
  content: string;

  /** Tool calls made */
  toolCalls?: ToolCall[];

  /** Files modified */
  filesModified?: string[];

  /** Exit status */
  status: 'success' | 'error' | 'partial';

  /** Error details if status is error */
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };

  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Tool call
 */
export interface ToolCall {
  /** Tool name */
  tool: string;

  /** Tool parameters */
  params: Record<string, unknown>;

  /** Tool result */
  result?: unknown;

  /** Execution time (ms) */
  executionTime?: number;

  /** Success status */
  success: boolean;
}

/**
 * Session spawn options
 */
export interface SpawnOptions {
  /** Initial prompt for the new session */
  prompt: string;

  /** Agent type (defaults to parent agent) */
  agentType?: AgentType;

  /** Session title */
  title?: string;

  /** Permission mode */
  permissionMode?: PermissionMode;

  /** Context files */
  contextFiles?: string[];

  /** MCP servers */
  mcpServerIds?: string[];

  /** Link to task */
  taskId?: string;
}

/**
 * Session prompt options
 */
export interface PromptOptions {
  /** The prompt/task */
  prompt: string;

  /** Routing mode */
  mode: 'continue' | 'fork' | 'subsession';

  /** Override agent type (fork/subsession only) */
  agentType?: AgentType;

  /** Override permission mode (fork/subsession only) */
  permissionMode?: PermissionMode;

  /** Session title (fork/subsession only) */
  title?: string;

  /** Fork/spawn point task ID */
  taskId?: string;
}
