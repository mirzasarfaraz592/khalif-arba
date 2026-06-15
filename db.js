const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const dbPath = isProd ? '/tmp/database.json' : path.join(__dirname, 'database.json');
const originalDbPath = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  if (isProd && fs.existsSync(originalDbPath)) {
    fs.copyFileSync(originalDbPath, dbPath);
  } else {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], products: [], orders: [] }, null, 2));
  }
}


function readDB() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
