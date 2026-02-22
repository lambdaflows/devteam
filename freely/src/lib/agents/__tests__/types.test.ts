import { describe, expect, it } from 'vitest';
import {
  generateId,
  toMessageID,
  toSessionID,
  toTaskID,
  MessageRole,
  TaskStatus,
} from '../types.js';

describe('generateId', () => {
  it('generates a non-empty string', () => {
    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('generates unique IDs on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('generates UUID-format strings', () => {
    const id = generateId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });
});

describe('toMessageID', () => {
  it('passes through the string value', () => {
    const raw = 'msg-abc-123';
    expect(toMessageID(raw)).toBe(raw);
  });

  it('works with a UUID', () => {
    const uuid = generateId();
    expect(toMessageID(uuid)).toBe(uuid);
  });
});

describe('toSessionID', () => {
  it('passes through the string value', () => {
    const raw = 'session-xyz';
    expect(toSessionID(raw)).toBe(raw);
  });
});

describe('toTaskID', () => {
  it('passes through the string value', () => {
    const raw = 'task-789';
    expect(toTaskID(raw)).toBe(raw);
  });
});

describe('MessageRole', () => {
  it('has USER constant', () => {
    expect(MessageRole.USER).toBe('user');
  });

  it('has ASSISTANT constant', () => {
    expect(MessageRole.ASSISTANT).toBe('assistant');
  });

  it('has SYSTEM constant', () => {
    expect(MessageRole.SYSTEM).toBe('system');
  });

  it('has exactly three roles', () => {
    expect(Object.keys(MessageRole)).toHaveLength(3);
  });
});

describe('TaskStatus', () => {
  it('has PENDING constant', () => {
    expect(TaskStatus.PENDING).toBe('pending');
  });

  it('has ACTIVE constant', () => {
    expect(TaskStatus.ACTIVE).toBe('active');
  });

  it('has COMPLETED constant', () => {
    expect(TaskStatus.COMPLETED).toBe('completed');
  });

  it('has FAILED constant', () => {
    expect(TaskStatus.FAILED).toBe('failed');
  });

  it('has exactly four statuses', () => {
    expect(Object.keys(TaskStatus)).toHaveLength(4);
  });
});
