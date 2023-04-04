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

// routing and pulling from DBs

router.get('/problems', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM problems`;
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

router.get('/teams', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM teams`;
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

router.post('/addTeam', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM teams where _key = '${req.params.teamName}'`;
        // let query = mysql.format(selectQuery, ['problemsTable', 'Proceeding', proceedingId]);
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0)
                return res.status(400).json({teamFound:true});
        });

        let createQuery = `insert into teams values('${req.params.teamName}', {${req.params.players.map(x=>{
            return `'${x}'`;
        }).reduce(x,y=>{
            return `${x},${y}`;
        })}}, 0, null)`;
        // let query = mysql.format(selectQuery, ['problemsTable', 'Proceeding', proceedingId]);
        pool.query(createQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0)
                return res.status(200).json({teamFound:false});
        });

        
    } catch (e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;
