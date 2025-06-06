const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'mysql', // service name in docker-compose
  user: 'user',
  password: 'password',
  database: 'testdb'
});

connection.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID', connection.threadId);
});

app.get('/', (req, res) => {
  connection.query('SELECT NOW() AS now', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(`Current time from DB: ${results[0].now}`);
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});