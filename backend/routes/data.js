/**
 * Routes for all proceeding related actions
 */
require('dotenv').config();
const {Pool} = require('pg')
const pool = new Pool({
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

        let createQuery = `insert into teams values('${req.params.teamName}', '{${req.params.players.reduce(x,y=>{
            return `${x},${y}`;
        })}}', 0, '{}')`;
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

router.put('/solve', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM problems where _key = '${req.params.problem}' and flag = '${req.params.flag}'`;
        // let query = mysql.format(selectQuery, ['problemsTable', 'Proceeding', proceedingId]);
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0) {
                let shouldUpdateQuery = `select * from teams where _key = '${req.params.teamName}' and ((${req.params.problem} = any(solved)) is not true)`;
                pool.query(shouldUpdateQuery, (err, data2) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if(data.rows.length > 0){
                        let updateQuery = `update teams set solved = solved || '${req.params.problem}', points = ${data2.rows[0].points+data.rows[0].points}`;
                        pool.query(updateQuery, (err,data) =>{
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                });
                return res.status(200).json({solved:true});
            } else
                return res.status(400).json({solved:false});

        });

        
    } catch (e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;
