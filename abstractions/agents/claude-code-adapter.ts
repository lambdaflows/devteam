/**
 * Claude Code adapter implementation
 * Translates generic agent operations to Claude Code specific protocol
 */

import type {
  IAgentAdapter,
  IAuthProvider,
} from '../core/interfaces';
import type {
  AgentCapabilities,
  AgentConfig,
  AgentResponse,
  SessionConfig,
  SessionState,
  SessionStatus,
} from '../core/types';

/**
 * Claude Code specific configuration
 */
export interface ClaudeCodeConfig {
  /** Authentication provider */
  authProvider: IAuthProvider;

  /** Claude Code binary path */
  binaryPath?: string;

  /** Default model */
  defaultModel?: 'opus' | 'sonnet' | 'haiku';

  /** Session timeout (ms) */
  sessionTimeout?: number;

  /** Custom environment variables */
  env?: Record<string, string>;
}

/**
 * Claude Code adapter
 */
export class ClaudeCodeAdapter implements IAgentAdapter {
  private config: ClaudeCodeConfig;
  private sessions: Map<string, SessionState> = new Map();
  private isInitialized = false;

  constructor(config: ClaudeCodeConfig) {
    this.config = config;
  }

  getConfig(): AgentConfig {
    return {
      type: 'claude-code',
      defaultPermissionMode: 'default',
      capabilities: this.getCapabilities(),
      config: {
        binaryPath: this.config.binaryPath,
        defaultModel: this.config.defaultModel,
      },
    };
  }

  private getCapabilities(): AgentCapabilities {
    return {
      canRead: true,
      canWrite: true,
      canExecute: true,
      canFetch: true,
      canUseMCP: true,
      supportsPlanning: true,
      custom: {
        supportsSkills: true,
        supportsWorktrees: true,
        supportsMemory: true,
      },
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Validate authentication
    const credentials = await this.config.authProvider.getCredentials();
    const isValid = await this.config.authProvider.validateCredentials(
      credentials
    );

    if (!isValid) {
      throw new Error('Invalid Claude Code credentials');
    }

    this.isInitialized = true;
  }

  async execute(sessionId: string, prompt: string): Promise<AgentResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      // Get authentication credentials
      const credentials = await this.config.authProvider.getCredentials();

      // Execute prompt using Claude Code protocol
      const response = await this.executeClaudeCodePrompt(
        session,
        prompt,
        credentials
      );

      // Update session state
      session.status = 'running';
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);

      return response;
    } catch (error) {
      // Update session to failed
      session.status = 'failed';
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);

      throw error;
    }
  }

  /**
   * Execute prompt using Claude Code protocol
   * This is where agent-specific translation happens
   */
  private async executeClaudeCodePrompt(
    session: SessionState,
    prompt: string,
    credentials: any
  ): Promise<AgentResponse> {
    // TODO: Implement actual Claude Code execution
    // This would use the Claude Code login mechanism and execute the prompt

    // For now, return a mock response
    return {
      content: 'Response from Claude Code',
      status: 'success',
      toolCalls: [],
      filesModified: [],
      metadata: {
        model: this.config.defaultModel || 'sonnet',
        sessionId: session.config.id,
      },
    };
  }

  async getSessionState(sessionId: string): Promise<SessionState> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return session;
  }

  async updateSession(
    sessionId: string,
    updates: Partial<SessionConfig>
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Merge updates
    session.config = { ...session.config, ...updates };
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
  }

  async terminateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // TODO: Implement actual session termination
    // This would clean up any Claude Code processes/resources

    session.status = 'completed';
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check if authentication is valid
      const credentials = await this.config.authProvider.getCredentials();
      return await this.config.authProvider.validateCredentials(credentials);
    } catch {
      return false;
    }
  }

  async cleanup(): Promise<void> {
    // Terminate all active sessions
    for (const [sessionId, session] of this.sessions) {
      if (session.status === 'running') {
        await this.terminateSession(sessionId);
      }
    }

    this.sessions.clear();
    this.isInitialized = false;
  }

  /**
   * Create a session (internal method)
   */
  createSession(config: SessionConfig): SessionState {
    const state: SessionState = {
      config,
      status: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIds: [],
      workingDirectory: undefined,
      env: this.config.env,
    };

    this.sessions.set(config.id, state);
    return state;
  }
}

/**
 * Helper function to translate permission mode to Claude Code flags
 */
export function translatePermissionMode(mode: string): {
  autoApprove?: boolean;
  requirePlan?: boolean;
  askForConfirmation?: boolean;
} {
  switch (mode) {
    case 'auto':
    case 'allow-all':
    case 'bypassPermissions':
      return { autoApprove: true };

    case 'plan':
      return { requirePlan: true };

    case 'ask':
      return { askForConfirmation: true };

    case 'acceptEdits':
      return { autoApprove: false, askForConfirmation: true };

    default:
      return {};
  }
}
