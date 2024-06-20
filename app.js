const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

app.use(bodyParser.json());

const db = new sqlite3.Database('./cars.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cars database.');
});

app.get('/cars', (req, res) => {
    let query = "SELECT * FROM cars";
    if (req.query.year) {
        query += ` WHERE year = ${req.query.year}`;
    }
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.json({cars: rows});
        }
    });
});

app.post('/addCar', (req, res) => {
    const { model, year, details } = req.body;
    if (!model || !year) {
        res.status(400).send("Model and year are required.");
        return;
    }
    db.run(`INSERT INTO cars (model, year, details) VALUES (?, ?, ?)`, [model, year, details], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.status(201).send(`Car added with ID: ${this.lastID}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
