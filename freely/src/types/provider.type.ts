export interface TYPE_PROVIDER {
  id?: string;
  streaming?: boolean;
  responseContentPath?: string;
  isCustom?: boolean;
  /** Agent-backed providers (claude-code, codex, gemini-sdk) don't use curl */
  isAgent?: boolean;
  curl?: string;
}
