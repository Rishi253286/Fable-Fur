import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database', 'fablefur.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

const app = express();
const port = 4000;
const salt = 'fable-fur-sql-v1';

app.use(cors());
app.use(express.json());

const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

function hashPassword(password) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function createSeedUsers() {
  const defaultUsers = [
    { name: 'Avery Walker', email: 'avery@fablefur.com', password: 'FableFur2025!' },
    { name: 'Noah Brooks', email: 'noah@fablefur.com', password: 'Paws1234!' }
  ];

  for (const user of defaultUsers) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);
    if (!existing) {
      db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
        user.name,
        user.email,
        hashPassword(user.password)
      );
    }
  }
}

createSeedUsers();

app.get('/api/users', (req, res) => {
  const rows = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY id ASC').all();
  res.json({ users: rows });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim().toLowerCase();

  if (!trimmedEmail.includes('@')) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run(trimmedName, trimmedEmail, hashPassword(String(password)));

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({ user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(trimmedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  const passwordHash = hashPassword(String(password));
  if (user.password_hash !== passwordHash) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.get('/api/pets', (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.name, p.type, p.age, p.energy, p.size, p.city,
           p.image_url AS image, p.bio, p.story, p.tags, s.name AS shelter
    FROM pets p
    LEFT JOIN shelters s ON s.id = p.shelter_id
    WHERE p.status = 'available'
    ORDER BY p.id ASC
  `).all();

  const pets = rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags || '[]')
  }));

  res.json({ pets });
});

app.get('/api/matches', (req, res) => {
  const rows = db.prepare(`
    SELECT m.id, m.pet_id, m.user_name, m.match_type, m.created_at,
           p.name AS pet_name
    FROM matches m
    JOIN pets p ON p.id = m.pet_id
    ORDER BY m.created_at DESC
  `).all();

  res.json({ matches: rows });
});

app.post('/api/matches', (req, res) => {
  const { petId, userName, matchType } = req.body;

  if (!petId || !userName || !matchType) {
    return res.status(400).json({ error: 'petId, userName and matchType are required.' });
  }

  const result = db.prepare(`
    INSERT INTO matches (pet_id, user_name, match_type)
    VALUES (?, ?, ?)
  `).run(petId, userName, matchType);

  res.status(201).json({
    id: result.lastInsertRowid,
    petId,
    userName,
    matchType
  });
});

app.listen(port, () => {
  console.log(`Fable & Fur API listening at http://localhost:${port}`);
});
