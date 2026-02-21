-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    attached_files TEXT,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
-- Composite index for efficient message queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation_timestamp ON messages(conversation_id, timestamp ASC);
-- Composite index for filtering by role
CREATE INDEX IF NOT EXISTS idx_messages_conversation_role ON messages(conversation_id, role, timestamp ASC);

-- Trigger to automatically update conversations updated_at when messages change
CREATE TRIGGER IF NOT EXISTS update_conversation_timestamp_on_message_insert
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    UPDATE conversations 
    SET updated_at = NEW.timestamp 
    WHERE id = NEW.conversation_id;
END;

CREATE TRIGGER IF NOT EXISTS update_conversation_timestamp_on_message_update
AFTER UPDATE ON messages
FOR EACH ROW
BEGIN
    UPDATE conversations 
    SET updated_at = NEW.timestamp 
    WHERE id = NEW.conversation_id;
END;

