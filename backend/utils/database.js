const { Pool } = require("pg");
const csvtojson = require("csvtojson");
//const { patch } = require("../routes/proceedings");
const fileName = `${__dirname}/preTable.csv`;
require('dotenv').config();
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

// // Database Pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

// singular database
pool.connect((error) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log('Database Connection established successfully');

    pool.query("DROP TABLE preTable", (err, drop) => {
        //Query to create table "preTable"
        const create = "CREATE TABLE preTable(_key VARCHAR(32) NOT NULL PRIMARY KEY, flag VARCHAR(32) NOT NULL, desc VARCHAR(512) NOT NULL, points INTEGER  NOT NULL,path varchar(128) NOT NULL);"
        // Creating table "preTable"
        pool.query(create, (err, drop) => {
            if (err) console.error(error);
        });
    });

    csvtojson().fromFile(fileName).then((source) => {
        // fetching the data from each row and inserting into "preTable"
        for (let i = 0; i < source.length; i++) {
            let _key = source[i]["_key"];
            let Authors = source[i]["Authors"];
            let Title = source[i]["Title"];
            let Abstract = source[i]["Abstract"];
            let Path = source[i]["Path"];
            let Proceeding = source[i]["Proceeding"];
            let Article = source[i]["Article"];

            let insertStatement =   `INSERT INTO preTable values ($1, $2, $3, $4, $5, $6, $7)`;
            let items = [_key, Authors, Title, Abstract, Path, Proceeding, Article];

            pool.query(insertStatement, items, (err, results, fields) => {
                if (err){ 
                    console.error(err);
                    return;
                }
            })
        }
        console.log("All items stored into database successfully");
    });
});

// // pooled database
// pool.getConnection((err, connection) => {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
//     // // making table
//     // let sql = "CREATE TABLE preTable(_key VARCHAR(9) NOT NULL PRIMARY KEY ,Authors VARCHAR(320) NOT NULL ,Title VARCHAR(221) NOT NULL ,Abstract VARCHAR(4210) ,Path VARCHAR(56) NOT NULL ,Proceeding INTEGER  NOT NULL ,Article INTEGER  NOT NULL)"
//     // connection.query(sql, (err, result) => {
//     //     connection.release(); // return the connection to pool
//     //     if (err) throw err;
//     //     console.log("Table Created: preTable");
//     // });

//     connection.query('SELECT * from user LIMIT 1', (err, rows) => {
//         connection.release(); // return the connection to pool
//         if (err) throw err;
//         console.log('The data from users table are: \n', rows);
//     });

// });
