const express = require('express');
const cors = require('cors'); // ⬅️ on importe cors
const app = express();

app.use(cors()); // ⬅️ on active cors

// jo2024-api/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'JoParis2024!',
  database: 'jo2024'
});

db.connect(err => {
  if (err) {
    console.error('❌ Connexion échouée :', err);
  } else {
    console.log('✅ Connecté à MySQL');
  }
});

// Exemple d’API
app.get('/api/offers', (req, res) => {
  db.query('SELECT * FROM offers', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 API en ligne sur http://localhost:${port}`);
});
