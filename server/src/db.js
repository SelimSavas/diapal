import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'diapal.db')
export const db = new Database(dbPath)

// Basic schema for health-related data
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_goals (
  user_id TEXT PRIMARY KEY,
  hba1c_target REAL,
  steps_target INTEGER,
  carbs_limit INTEGER,
  water_target_ml INTEGER,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  value_mgdl REAL NOT NULL,
  measured_at INTEGER NOT NULL,
  context TEXT,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS moods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  mood INTEGER NOT NULL,
  stress INTEGER,
  sleep_quality INTEGER,
  note TEXT,
  recorded_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_profiles (
  user_id TEXT PRIMARY KEY,
  bio TEXT,
  focus_areas TEXT,
  online_services INTEGER DEFAULT 0,
  in_person_services INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_patients (
  doctor_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (doctor_id, patient_id),
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);
`)

