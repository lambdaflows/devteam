/**
 * Codex adapter implementation
 * Translates generic agent operations to Codex/Cursor specific protocol
 */

import type { IAgentAdapter, IAuthProvider } from '../core/interfaces';
import type {
  AgentCapabilities,
  AgentConfig,
  AgentResponse,
  SessionConfig,
  SessionState,
} from '../core/types';

/**
 * Codex specific configuration
 */
export interface CodexConfig {
  /** Authentication provider */
  authProvider: IAuthProvider;

  /** Codex API endpoint */
  apiEndpoint?: string;

  /** Default model */
  defaultModel?: string;

  /** Session timeout (ms) */
  sessionTimeout?: number;
}

/**
 * Codex/Cursor adapter
 */
export class CodexAdapter implements IAgentAdapter {
  private config: CodexConfig;
  private sessions: Map<string, SessionState> = new Map();
  private isInitialized = false;

  constructor(config: CodexConfig) {
    this.config = config;
  }

  getConfig(): AgentConfig {
    return {
      type: 'codex',
      defaultPermissionMode: 'default',
      capabilities: this.getCapabilities(),
      config: {
        apiEndpoint: this.config.apiEndpoint,
        defaultModel: this.config.defaultModel,
      },
    };
  }

  private getCapabilities(): AgentCapabilities {
    return {
      canRead: true,
      canWrite: true,
      canExecute: true,
      canFetch: false,
      canUseMCP: false,
      supportsPlanning: false,
      custom: {
        supportsMultiFile: true,
        supportsDiff: true,
      },
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const credentials = await this.config.authProvider.getCredentials();
    const isValid = await this.config.authProvider.validateCredentials(
      credentials
    );

    if (!isValid) {
      throw new Error('Invalid Codex credentials');
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
      const credentials = await this.config.authProvider.getCredentials();
      const response = await this.executeCodexPrompt(
        session,
        prompt,
        credentials
      );

      session.status = 'running';
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);

      return response;
    } catch (error) {
      session.status = 'failed';
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);
      throw error;
    }
  }

  private async executeCodexPrompt(
    session: SessionState,
    prompt: string,
    credentials: any
  ): Promise<AgentResponse> {
    // TODO: Implement Codex/Cursor execution protocol
    return {
      content: 'Response from Codex',
      status: 'success',
      toolCalls: [],
      filesModified: [],
      metadata: {
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

    session.config = { ...session.config, ...updates };
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
  }

  async terminateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.status = 'completed';
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const credentials = await this.config.authProvider.getCredentials();
      return await this.config.authProvider.validateCredentials(credentials);
    } catch {
      return false;
    }
  }

  async cleanup(): Promise<void> {
    for (const [sessionId, session] of this.sessions) {
      if (session.status === 'running') {
        await this.terminateSession(sessionId);
      }
    }

    this.sessions.clear();
    this.isInitialized = false;
  }

  createSession(config: SessionConfig): SessionState {
    const state: SessionState = {
      config,
      status: 'idle',
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIds: [],
    };

    this.sessions.set(config.id, state);
    return state;
  }
}
