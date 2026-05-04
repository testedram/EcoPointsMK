import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: [],
      sessions: [],
      events: []
    }, null, 2));
  }
}

export function readDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function writeDB(data) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getUsers() {
  return readDB().users;
}

export function getUserById(id) {
  return readDB().users.find(u => u.id === id);
}

export function getUserByUsername(username) {
  return readDB().users.find(u => u.username === username);
}

export function createUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
  return user;
}

export function updateUser(id, updates) {
  const db = readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  writeDB(db);
  return db.users[idx];
}

// SESSIONS
export function getActiveSession(binId) {
  const db = readDB();
  const now = Date.now();
  return db.sessions.find(s => s.binId === binId && s.active && (now - s.startedAt) < 30000);
}

export function getActiveSessionByUser(userId) {
  const db = readDB();
  const now = Date.now();
  return db.sessions.find(s => s.userId === userId && s.active && (now - s.startedAt) < 30000);
}

export function createSession(session) {
  const db = readDB();
  // Deactivate old sessions for this bin
  db.sessions = db.sessions.map(s =>
    s.binId === session.binId ? { ...s, active: false } : s
  );
  db.sessions.push(session);
  writeDB(db);
  return session;
}

export function endSession(sessionId) {
  const db = readDB();
  const idx = db.sessions.findIndex(s => s.id === sessionId);
  if (idx !== -1) {
    db.sessions[idx].active = false;
    db.sessions[idx].endedAt = Date.now();
    writeDB(db);
  }
}

// EVENTS (for cooldown)
export function getLastEvent(binId) {
  const db = readDB();
  const events = db.events.filter(e => e.binId === binId).sort((a, b) => b.timestamp - a.timestamp);
  return events[0] || null;
}

export function addEvent(event) {
  const db = readDB();
  db.events.push(event);
  // Keep only last 1000 events
  if (db.events.length > 1000) db.events = db.events.slice(-1000);
  writeDB(db);
}
