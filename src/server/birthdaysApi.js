
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',     // Replace with your actual database host
  user: 'root',          // Replace with your actual database username
  password: '',          // Replace with your actual database password
  database: 'portal'     // Replace with your actual database name
};

// Birthdays API endpoint
app.post('/api/birthdays', async (req, res) => {
  try {
    const { location, weekStart, weekEnd } = req.body;
    
    // Validate required parameters
    if (!location || !weekStart || !weekEnd) {
      return res.status(400).json({ 
        error: 'Missing required parameters: location, weekStart, or weekEnd' 
      });
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Prepare query similar to the original PHP query
    const query = `
      SELECT 
        nm_dsc_usu, 
        nm_dep, 
        DATE_FORMAT(dt_nac, '%d-%m') AS dt_nac 
      FROM LOGIN_USUARIO
      WHERE nm_cid = ?
      AND DATE_FORMAT(dt_nac, '%m-%d') BETWEEN ? AND ? 
      ORDER BY DATE_FORMAT(dt_nac, '%m-%d')
    `;
    
    // Execute the query with parameters
    const [results] = await connection.execute(query, [location, weekStart, weekEnd]);
    
    // Close the connection
    await connection.end();
    
    // Return the results
    res.json(results);
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error occurred' });
  }
});

// Start server on port 3001 (or any available port)
const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Birthdays API server running on port ${PORT}`);
});

// Export for potential use with serverless functions
module.exports = app;
