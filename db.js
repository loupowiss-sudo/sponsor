const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.sqlite');
const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password_hash TEXT, github_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, sess TEXT, expire INTEGER)'
    );
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

function findUserByGithubId(githubId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE github_id = ?', [githubId], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

function createUser({ email, passwordHash, githubId }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password_hash, github_id) VALUES (?, ?, ?)',
      [email, passwordHash || null, githubId || null],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, email, github_id: githubId || null });
      }
    );
  });
}

module.exports = { db, init, findUserByEmail, findUserById, findUserByGithubId, createUser };
