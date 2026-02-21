/**
 * Core interfaces for the multi-agent abstraction layer
 */

import type {
  AgentConfig,
  AgentResponse,
  AuthCredentials,
  PermissionMode,
  PromptOptions,
  SessionConfig,
  SessionState,
  SessionStatus,
  SpawnOptions,
  Task,
  WorktreeConfig,
  WorktreeState,
} from './types';

/**
 * Agent adapter interface
 * Each agent type (Claude Code, Codex, Gemini) implements this
 */
export interface IAgentAdapter {
  /** Get agent configuration */
  getConfig(): AgentConfig;

  /** Initialize the agent */
  initialize(): Promise<void>;

  /** Execute a prompt in a session */
  execute(sessionId: string, prompt: string): Promise<AgentResponse>;

  /** Get session state */
  getSessionState(sessionId: string): Promise<SessionState>;

  /** Update session configuration */
  updateSession(
    sessionId: string,
    updates: Partial<SessionConfig>
  ): Promise<void>;

  /** Terminate a session */
  terminateSession(sessionId: string): Promise<void>;

  /** Check if agent is available/healthy */
  healthCheck(): Promise<boolean>;

  /** Clean up resources */
  cleanup(): Promise<void>;
}

/**
 * Authentication provider interface
 */
export interface IAuthProvider {
  /** Get authentication credentials */
  getCredentials(): Promise<AuthCredentials>;

  /** Refresh credentials if needed */
  refreshCredentials(): Promise<AuthCredentials>;

  /** Validate current credentials */
  validateCredentials(credentials: AuthCredentials): Promise<boolean>;

  /** Clear/logout */
  clearCredentials(): Promise<void>;
}

/**
 * Isolation provider interface
 * Manages worktrees and execution contexts
 */
export interface IIsolationProvider {
  /** Create a new worktree */
  createWorktree(config: WorktreeConfig): Promise<WorktreeState>;

  /** Get worktree state */
  getWorktree(worktreeId: string): Promise<WorktreeState>;

  /** Update worktree metadata */
  updateWorktree(
    worktreeId: string,
    updates: Partial<WorktreeConfig>
  ): Promise<void>;

  /** Delete a worktree */
  deleteWorktree(worktreeId: string): Promise<void>;

  /** List all worktrees */
  listWorktrees(filters?: {
    repoId?: string;
    boardId?: string;
  }): Promise<WorktreeState[]>;

  /** Get worktree environment variables */
  getWorktreeEnv(worktreeId: string): Promise<Record<string, string>>;
}

/**
 * Session manager interface
 */
export interface ISessionManager {
  /** Create a new session */
  createSession(config: SessionConfig): Promise<SessionState>;

  /** Get session state */
  getSession(sessionId: string): Promise<SessionState>;

  /** Update session */
  updateSession(
    sessionId: string,
    updates: Partial<SessionConfig>
  ): Promise<void>;

  /** Spawn a child session (subsession) */
  spawnSession(
    parentSessionId: string,
    options: SpawnOptions
  ): Promise<SessionState>;

  /** Prompt an existing session */
  promptSession(
    sessionId: string,
    options: PromptOptions
  ): Promise<SessionState | Task>;

  /** List sessions */
  listSessions(filters?: {
    worktreeId?: string;
    status?: SessionStatus;
    parentSessionId?: string;
  }): Promise<SessionState[]>;

  /** Get session genealogy */
  getGenealogy(sessionId: string): Promise<{
    ancestors: SessionState[];
    descendants: SessionState[];
    siblings: SessionState[];
  }>;
}

/**
 * Task manager interface
 */
export interface ITaskManager {
  /** Create a new task */
  createTask(sessionId: string, prompt: string): Promise<Task>;

  /** Get task */
  getTask(taskId: string): Promise<Task>;

  /** Update task status */
  updateTaskStatus(
    taskId: string,
    status: SessionStatus,
    result?: unknown
  ): Promise<void>;

  /** List tasks for a session */
  listTasks(
    sessionId: string,
    filters?: {
      status?: SessionStatus;
      parentTaskId?: string;
    }
  ): Promise<Task[]>;

  /** Get task genealogy */
  getTaskGenealogy(taskId: string): Promise<{
    ancestors: Task[];
    descendants: Task[];
  }>;
}

/**
 * Storage adapter interface
 * Abstracts persistence layer
 */
export interface IStorageAdapter {
  /** Save session state */
  saveSession(session: SessionState): Promise<void>;

  /** Load session state */
  loadSession(sessionId: string): Promise<SessionState | null>;

  /** Delete session */
  deleteSession(sessionId: string): Promise<void>;

  /** Save task */
  saveTask(task: Task): Promise<void>;

  /** Load task */
  loadTask(taskId: string): Promise<Task | null>;

  /** Save worktree state */
  saveWorktree(worktree: WorktreeState): Promise<void>;

  /** Load worktree state */
  loadWorktree(worktreeId: string): Promise<WorktreeState | null>;

  /** Query sessions */
  querySessions(query: {
    worktreeId?: string;
    status?: SessionStatus;
    parentSessionId?: string;
  }): Promise<SessionState[]>;

  /** Query tasks */
  queryTasks(query: {
    sessionId?: string;
    status?: SessionStatus;
  }): Promise<Task[]>;
}

/**
 * Main orchestrator interface
 */
export interface IAgentOrchestrator {
  /** Register an agent adapter */
  registerAgent(adapter: IAgentAdapter): void;

  /** Get agent by type */
  getAgent(agentType: string): IAgentAdapter | undefined;

  /** Create a new session with specific agent */
  createSession(
    worktreeId: string,
    agentType: string,
    config: Partial<SessionConfig>
  ): Promise<SessionState>;

  /** Execute a prompt in a session */
  executePrompt(sessionId: string, prompt: string): Promise<AgentResponse>;

  /** Spawn a subsession */
  spawnSubsession(
    parentSessionId: string,
    options: SpawnOptions
  ): Promise<SessionState>;

  /** Get session with full context */
  getSessionContext(sessionId: string): Promise<{
    session: SessionState;
    worktree: WorktreeState;
    tasks: Task[];
    agent: IAgentAdapter;
  }>;

  /** Initialize orchestrator */
  initialize(): Promise<void>;

  /** Shutdown orchestrator */
  shutdown(): Promise<void>;
}

/**
 * Environment manager interface
 * Manages dev environment (start/stop services, health checks)
 */
export interface IEnvironmentManager {
  /** Start environment for a worktree */
  start(worktreeId: string): Promise<void>;

  /** Stop environment */
  stop(worktreeId: string): Promise<void>;

  /** Check health */
  healthCheck(worktreeId: string): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
  }>;

  /** Get logs */
  getLogs(worktreeId: string, tail?: number): Promise<string>;

  /** Open application URL */
  openApp(worktreeId: string): Promise<string>;
}
