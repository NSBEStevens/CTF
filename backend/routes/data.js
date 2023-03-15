/**
 * Routes for all proceeding related actions
 */
require('dotenv').config();
const {Client} = require('pg')
const pool = new Client({
    /*connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      requestCert: true
    },*/
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
pool.connect();
const express = require('express');
const router = express.Router();
const data = require('../data');
const proceedingData = data.proceedings;

// routing and pulling from DBs

router.get('/:id', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM problemsTable WHERE Proceeding = ${req.params.id}`;
        // let query = mysql.format(selectQuery, ['problemsTable', 'Proceeding', proceedingId]);
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            return res.status(200).json(data.rows);
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;
