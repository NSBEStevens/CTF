var http = require('http');
var https = require('https');
var cors = require('cors');
const path = require('path');

// var privateKey  = process.env.privateKey;
// var certificate = process.env.certificate;

// var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8000);
// httpsServer.listen(8443);

app.use(express.static(path.resolve(__dirname, './front/build')));

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
