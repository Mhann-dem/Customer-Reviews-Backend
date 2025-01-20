const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// API Endpoints

// Fetch all reviews (latest 10 reviews)
app.get('/api/reviews', (req, res) => {
  const query = 'SELECT * FROM reviews ORDER BY created_at DESC LIMIT 10';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json(results);
  });
});

// Fetch average rating and total number of reviews
app.get('/api/summary', (req, res) => {
  const query = 'SELECT AVG(rating) AS averageRating, COUNT(*) AS totalReviews FROM reviews';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching summary:', err);
      return res.status(500).json({ error: 'Failed to fetch summary' });
    }
    res.json(results[0]);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
