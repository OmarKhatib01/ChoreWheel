const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Use bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Enable CORS for your React application
app.use(cors());

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost', // or your remote database host
    user: 'chorewheel', // your database username
    password: 'chorewheel', // your database password
    database: 'ChoreWheel' // your database name
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
});

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token part of the "Bearer <token>" string
    if (!token) {
        return res.status(401).send('Unauthorized request');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (e) {
        console.error('Error verifying JWT token:', e);
        return res.status(401).send('Unauthorized request');
    }
};

// create a new apartment
app.post('/apartment/create', verifyToken, (req, res) => {
    console.log('Received data:', req.body);
    const { name, address, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Apartment name and password are required' });
    }

    connection.query(
        'SELECT * FROM Apartments WHERE Name = ?',
        [name],
        (err, results) => {
            if (err) {
                console.error('Error checking for existing apartment:', err);
                return res.status(500).json({ message: 'Error checking for existing apartment' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'An apartment with this name already exists' });
            } else {
                connection.query(
                    'INSERT INTO Apartments (Name, Address, Password) VALUES (?, ?, ?)',
                    [name, address, password], // Consider hashing the password
                    (insertErr, insertResults) => {
                        if (insertErr) {
                            console.error('Failed to insert new apartment:', insertErr);
                            return res.status(500).json({ message: 'Error creating new apartment' });
                        }
                        // return apartment id, name, and address
                        res.status(201).json({
                            id: insertResults.insertId,
                            Name: name,
                            Address: address
                        });
                    }
                );
            }
        }
    );
});


// login to an apartment
app.post('/apartment/login', verifyToken, (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).send('Apartment name and password are required');
    }

    connection.query(
        'SELECT * FROM Apartments WHERE Name = ? AND Password = ?',
        [name, password],
        (err, results) => {
            if (err) {
                console.error('Error logging in:', err);
                return res.status(500).json({ message: 'Error logging in' });
            }

            if (results.length === 0) {
                // No apartment found
                return res.status(404).json({ message: 'No apartment found with that name and password' });
            } else {
                // Create and return JWT token
                const token = jwt.sign({ id: results[0].ApartmentID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                //return apartment id, name, and address
                res.json({
                    id: results[0].ApartmentID,
                    authToken: token,
                    name: results[0].Name,
                    address: results[0].Address
                });
            }
        }
    );
});

// get an apartment
app.get('/apartments/:id', verifyToken, (req, res) => {
    connection.query(
        'SELECT * FROM Apartments WHERE ApartmentID = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error('Error fetching apartment:', err);
                return res.status(500).send('Error fetching apartment');
            }
            if (results.length === 0) {
                return res.status(404).send('Apartment not found');
            }
            // return apartment id, name, and address
            res.json({
                id: results[0].ApartmentID,
                name: results[0].Name,
                address: results[0].Address
            });
        }
    );
});


// get tasks for an apartment
app.get('/apartments/:id/tasks', verifyToken, (req, res) => {
    connection.query(
        'SELECT * FROM Tasks WHERE ApartmentID = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error('Error fetching tasks:', err);
                return res.status(500).send('Error fetching tasks');
            }
            // return task id, user id, title, interval days, and days remaining
            res.json(results);
        }
    );
});


// add a new task to an apartment
app.post('/apartments/:id/tasks/create', verifyToken, (req, res) => {
    console.log('Received data:', req.body);
    const { UserID, ApartmentID, title, intervalDays, daysRemaining, completed } = req.body;
    if (!UserID || !title || !intervalDays || !ApartmentID) {
        console.log('Missing required task information');
        return res.status(400).json({ message: "Missing required task information" });
    }
    connection.query(
        'INSERT INTO Tasks (ApartmentID, UserID, Title, IntervalDays, DaysRemaining, Completed) VALUES (?, ?, ?, ?, ?, ?)',
        [ApartmentID, UserID, title, intervalDays, daysRemaining, completed],
        (err, results) => {
            if (err) {
                console.error('Error adding task:', err);
                return res.status(500).send('Error adding task');
            }
            res.status(201).json({
                TaskID: results.insertId,
                ApartmentID: req.params.id,
                UserID: UserID,
                Title: title,
                IntervalDays: intervalDays,
                DaysRemaining: daysRemaining,
                Completed: completed
            });
        }
    );
});

app.put('/apartments/:aptId/tasks/:taskId/complete', verifyToken, (req, res) => {
    const completed = req.body.completed ? 1 : 0; // Convert boolean to 0/1
    console.log('Updating task:', req.params.taskId, 'to', completed);
    connection.query(
        'UPDATE Tasks SET Completed = ? WHERE ApartmentID = ? AND TaskID = ?',
        [completed, req.params.aptId, req.params.taskId],
        (err, results) => {
            if (err) {
                console.error('Error updating task:', err);
                return res.status(500).send('Error updating task');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Task not found');
            }
            res.status(200).send('Task updated successfully');
        }
    );
});


// delete a task from an apartment
app.delete('/apartments/:aptId/tasks/:taskId', verifyToken, (req, res) => {
    connection.query(
        'DELETE FROM Tasks WHERE ApartmentID = ? AND TaskID = ?',
        [req.params.aptId, req.params.taskId],
        (err, results) => {
            if (err) {
                console.error('Error deleting task:', err);
                return res.status(500).send('Error deleting task');
            }
            if (results.affectedRows === 0) {
                // No task was deleted, likely because it didn't exist
                return res.status(404).send('Task not found');
            }
            console.log('Deleted task:', results);
            res.status(200).send('Task deleted successfully');
        }
    );
});


// get users for an apartment
app.get('/apartments/:id/users', verifyToken, (req, res) => {
    connection.query(
        'SELECT * FROM Users WHERE ApartmentID = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).send('Error fetching users');
            }
            // return user id and name
            res.json(results);
        }
    );
});


// add a new user to an apartment
app.post('/apartments/:id/users/create', verifyToken, (req, res) => {
    const { name } = req.body;
    connection.query(
        'INSERT INTO Users (ApartmentID, Name) VALUES (?, ?)',
        [req.params.id, name],
        (err, results) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).send('Error adding user');
            }
            res.status(201).json({
                id: results.insertId,
                name: name
            });
        }
    );
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
