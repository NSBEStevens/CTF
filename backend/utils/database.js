const { Pool } = require("pg");
const csvtojson = require("csvtojson");
const fileName = `${__dirname}/problems.csv`;
require('dotenv').config();
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// singular database
pool.connect((error) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log('Database Connection established successfully');

    pool.query("DROP TABLE problems", (err, drop) => {
        //Query to create table "preTable"
        const create = "CREATE TABLE problems(_key VARCHAR(32) NOT NULL PRIMARY KEY, flag VARCHAR(32) NOT NULL, desc VARCHAR(512) NOT NULL, points INTEGER  NOT NULL,path varchar(128) NOT NULL);"
        // Creating table "problems"
        pool.query(create, (err, drop) => {
            if (err) console.error(error);
        });
        const teams = "CREATE TABLE teams(_key VARCHAR(64) NOT NULL PRIMARY KEY, leader varchar(128) NOT NULL, players text[] NOT NULL, points INTEGER  NOT NULL, solved text[]);"
        // Creating table "teams"
        pool.query(teams, (err, drop) => {
            if (err) console.error(error);
        });
    });

    csvtojson().fromFile(fileName).then((source) => {
        // fetching the data from each row and inserting into "preTable"
        for (let i = 0; i < source.length; i++) {
            let _key = source[i]["_key"];
            let Authors = source[i]["flag"];
            let Title = source[i]["desc"];
            let Abstract = source[i]["points"];
            let Path = source[i]["path"];

            let insertStatement =   `INSERT INTO problems values ($1, $2, $3, $4, $5)`;
            let items = [_key, Authors, Title, Abstract, Path];

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
