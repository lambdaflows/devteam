export interface SystemPrompt {
  id: number;
  name: string;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export interface SystemPromptInput {
  name: string;
  prompt: string;
}

export interface UpdateSystemPromptInput {
  name?: string;
  prompt?: string;
}
