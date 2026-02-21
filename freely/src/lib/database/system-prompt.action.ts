import { getDatabase } from "./config";
import type {
  SystemPrompt,
  SystemPromptInput,
  UpdateSystemPromptInput,
} from "@/types";

/**
 * Create a new system prompt
 */
export async function createSystemPrompt(
  input: SystemPromptInput
): Promise<SystemPrompt> {
  const db = await getDatabase();

  // Validate and sanitize input
  const name = input.name.trim();
  const prompt = input.prompt.trim();

  if (!name) {
    throw new Error("System prompt name cannot be empty");
  }

  if (!prompt) {
    throw new Error("System prompt text cannot be empty");
  }

  const result = await db.execute(
    "INSERT INTO system_prompts (name, prompt) VALUES (?, ?)",
    [name, prompt]
  );

  // Get the last inserted row
  const inserted = await db.select<SystemPrompt[]>(
    "SELECT * FROM system_prompts WHERE id = ?",
    [result.lastInsertId]
  );

  if (!inserted[0]) {
    throw new Error("Failed to retrieve created system prompt");
  }

  return inserted[0];
}

/**
 * Get all system prompts
 */
export async function getAllSystemPrompts(): Promise<SystemPrompt[]> {
  const db = await getDatabase();
  return await db.select<SystemPrompt[]>(
    "SELECT * FROM system_prompts ORDER BY created_at DESC"
  );
}

/**
 * Get a single system prompt by ID
 */
export async function getSystemPromptById(
  id: number
): Promise<SystemPrompt | null> {
  const db = await getDatabase();
  const result = await db.select<SystemPrompt[]>(
    "SELECT * FROM system_prompts WHERE id = ?",
    [id]
  );
  return result[0] || null;
}

/**
 * Update a system prompt
 */
export async function updateSystemPrompt(
  id: number,
  input: UpdateSystemPromptInput
): Promise<SystemPrompt> {
  const db = await getDatabase();

  // Build dynamic update query
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      throw new Error("System prompt name cannot be empty");
    }
    updates.push("name = ?");
    values.push(name);
  }

  if (input.prompt !== undefined) {
    const prompt = input.prompt.trim();
    if (!prompt) {
      throw new Error("System prompt text cannot be empty");
    }
    updates.push("prompt = ?");
    values.push(prompt);
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  await db.execute(
    `UPDATE system_prompts SET ${updates.join(", ")} WHERE id = ?`,
    values
  );

  const result = await db.select<SystemPrompt[]>(
    "SELECT * FROM system_prompts WHERE id = ?",
    [id]
  );

  if (!result[0]) {
    throw new Error("System prompt not found after update");
  }

  return result[0];
}

/**
 * Delete a system prompt
 */
export async function deleteSystemPrompt(id: number): Promise<void> {
  const db = await getDatabase();
  const result = await db.execute("DELETE FROM system_prompts WHERE id = ?", [
    id,
  ]);

  if (result.rowsAffected === 0) {
    throw new Error("System prompt not found");
  }
}
