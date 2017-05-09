//require('instana-nodejs-sensor')();
var express = require('express');
var connection = require('express-myconnection');
var app = express();
var mysql = require('mysql');
var srs = require('secure-random-string');

app.get('/', function (req, res) {

  console.log("Got a GET request for the homepage");

  var connection = mysql.createConnection({
      host: 'spring-music-mysql',
      user: 'root',
      password: '',
      requestTimeout: 50,
      acquireTimeout: 100,
      port: 3306,
      database: 'socksdb'
  });

  connection.connect(function(err){
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');

    srs({length: 256}, function(err, sr) {
      console.log(sr);
      var query = connection.query("INSERT INTO tag set ? ", sr, function (err, results) {

          if (err) {
              res.status(500).send(err);
          } else {
              console.log(results);
              res.status(200).send("ok");
          }
      }
    });

  connection.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
  });
});

app.get('/addtocart', function (req, res) {

    console.log("Got a GET request for addtocart");

    req.query.color

    var connection = mysql.createConnection({
        host: 'mysql',
        user: 'root',
        password: '',
        host: 'localhost',
        requestTimeout: 50,
        acquireTimeout: 100,
        port: 3306,
        database: 'socksdb'
    });

    srs({length: 256}, function(err, sr) {
      console.log(sr);
      var query = connection.query("INSERT INTO tag set ? ", sr, function (err, results) {

          if (err) {
              res.status(500).send(err);
          } else {
              console.log(results);
              res.status(200).send("ok");
          }
      });
    });
    connection.end();
});


// This responds a GET request for the /list_user page.
app.get('/tags', function (req, res) {
    console.log("Got a GET request for /list_user");

    var connection = mysql.createConnection({
        host: 'mysql',
        user: 'root',
        password: '',
        requestTimeout: 50,
        acquireTimeout: 100,
        host:"localhost",
        port: 3306,
        database: 'socksdb'
    });

    var sql = "select * from tag;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            res.status(500).send(err);
        }
        //var ret = JSON.parse(results);
        console.log(results);
        //res.setHeader('Content-Type', 'application/json');
        res.status(200).send("ok");
    })
    connection.end();
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
