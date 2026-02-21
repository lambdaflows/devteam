-- Create system_prompts table
CREATE TABLE IF NOT EXISTS system_prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

-- Index for faster lookups by name
CREATE INDEX IF NOT EXISTS idx_system_prompts_name ON system_prompts(name);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_system_prompts_timestamp 
AFTER UPDATE ON system_prompts
FOR EACH ROW
WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE system_prompts 
    SET updated_at = datetime('now') 
    WHERE id = NEW.id;
END;

