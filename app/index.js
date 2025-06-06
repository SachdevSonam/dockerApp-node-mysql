const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

function connectWithRetry(retries = 5) {
  const connection = mysql.createConnection({
    host: 'mysql',     // service name from docker-compose
    user: 'user',
    password: 'password',
    database: 'testdb'
  });

  connection.connect((err) => {
    if (err) {
      console.error('❌ MySQL connection failed:', err.message);
      if (retries > 0) {
        console.log(`🔁 Retrying in 5 seconds... (${retries} retries left)`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.log('❌ No more retries left. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('✅ Connected to MySQL!');
      startApp(connection);
    }
  });
}

function startApp(connection) {
  app.get('/', (req, res) => {
    connection.query('SELECT NOW() AS now', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(`Current time from DB: ${results[0].now}`);
    });
  });

  app.listen(port, () => {
    console.log(`🚀 Node.js app running at http://localhost:${port}`);
  });
}

connectWithRetry();
