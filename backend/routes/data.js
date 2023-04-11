/**
 * Routes for all proceeding related actions
 */
require('dotenv').config();
const {Pool} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      requestCert: true
    }
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // port: process.env.DB_PORT,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME
});
pool.connect();
const express = require('express');
const router = express.Router();

// routing and pulling from DBs

router.get('/problems', async (req, res) => {
    try {
        let selectQuery = `SELECT _key, description, points, path, cg FROM problems order by cg desc, points desc`;
        
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

router.get('/teams/:key', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM teams where _key = '${req.params.key}'`;
        
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            return res.status(200).json(data.rows[0]);
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
});

router.post('/login', async (req, res) => {
    try {
        let selectQuery = `SELECT * FROM teams where _key = '${req.body.teamName}' and ('${req.body.email}' = any(players))`;
        
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length === 0) {
                return res.status(200).json({teamFound:false});
            }
            return res.status(200).json({teamFound:false});
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
});

router.post('/addTeam', async (req, res) => {
    let players=[req.body.player1,req.body.player2,req.body.player3];
    try {
        if(req.body.teamName === undefined) throw "Team Name not defined";
        let selectQuery = `SELECT * FROM teams where _key = '${req.body.teamName}'`;
        
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0)
                return res.status(400).json({teamFound:true});
        });
        let createQuery = `insert into teams values('`+req.body.teamName+`', '{${players.reduce((x,y)=>{
            return y !== ""? `${x},${y}`: x;
        })}}', 0, '{}')`;
        
        pool.query(createQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0)
                return res.status(200).json({teamFound:false});
        });

        
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
});

router.put('/solve', async (req, res) => {
    try {
        console.log(`${req.body.teamName} solved ${req.body.problem} with flag ${req.body.flag}`);
        let selectQuery = `SELECT * FROM problems where _key = '${req.body.problem}' and ctfflag = '${req.body.flag}'`;
        // let query = mysql.format(selectQuery, ['problemsTable', 'Proceeding', proceedingId]);
        pool.query(selectQuery, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            if(data.rows.length > 0) {
                let shouldUpdateQuery = `select * from teams where _key = '${req.body.teamName}' and not ('${req.body.problem}' = any(solved))`;
                pool.query(shouldUpdateQuery, (err, data2) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if(data2.rows.length > 0){
                        let updateQuery = `update teams set solved = solved || '{${req.body.problem}}', points = ${data2.rows[0].points+data.rows[0].points}`;
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

router.post('/clearProblems', (req, res) => {
    pool.query("delete from problems *", (err,data) => {
        if(err) console.error(err);
    });
});

router.post('/clearTeams', (req, res) => {
    pool.query("delete from teams *", (err,data) => {
        if(err) console.error(err);
    });
});

module.exports = router;
