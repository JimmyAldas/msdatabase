const express = require('express');
const mysql = require('mysql2');

const port = 3000
// Initialize Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Add your MySQL password
    database: 'appdist'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});


// Create a new students
app.post('/students', (req, res) => {
    const { name_, email,fecha_nacimiento} = req.body;
    const sql = 'INSERT INTO students (name_, email,fecha_nacimiento) VALUES (?,?,?)';
    db.query(sql, [name_, email,fecha_nacimiento], (err, result) => {
        if (err) throw err;
        res.status(201).send({ id: result.insertId, name_, email,fecha_nacimiento });
    });
});


// Get all users
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Update a user
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name_, email, fecha_nacimiento } = req.body;
    const sql = 'UPDATE students SET name_ = ?, email = ? , fecha_nacimiento = ? WHERE id = ?';
    db.query(sql, [name_, email, fecha_nacimiento, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send('students not found');
        }
        res.send({ id, name_, email,fecha_nacimiento });
    });
});

// Delete a user
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            return res.status(404).send('students not found');
        }
        res.send('students deleted');
    });
});

// Define route handler for GET requests to '/'
app.get('/', (req, res) => {
    res.send('Hello World\n');
});



// Start the server on port 5000
app.listen(port, () => {
    console.log('Server listening at http://localhost:'+port);
});