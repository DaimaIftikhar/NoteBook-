const connectToMongo = require('./db');
const express = require('express');

connectToMongo(); // Connecting to MongoDB
const app = express(); // Initializing Express
const port = 5002; // Server port

// Middleware to parse incoming JSON
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/notes', require('./Routes/notes'));

app.get('/', (req, res) => {
  res.send('Hello Harry!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
