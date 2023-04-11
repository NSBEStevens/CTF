/**
 * Routes for all proceeding related actions
 */
require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require("path");


router.get('/challenge4', async (req,res) => {
        res.sendFile(path.resolve(__dirname, '../../public/problem_files/challenge4.handlebars', 'index.html'));
});

module.exports = router;
