const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// DB setup
const db = new sqlite3.Database('./access_log.db');
db.serialize(() => {
  db.run(\`
    CREATE TABLE IF NOT EXISTS access_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      os TEXT,
      latitude TEXT,
      longitude TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  \`);
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint para salvar dados de acesso
app.post('/log', (req, res) => {
  const { ip, userAgent, os, latitude, longitude } = req.body;

  db.run(\`
    INSERT INTO access_log (ip, user_agent, os, latitude, longitude)
    VALUES (?, ?, ?, ?, ?)
  \`, [ip, userAgent, os, latitude, longitude], function(err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(\`Servidor rodando em http://localhost:\${PORT}\`);
});