var instana = require('instana-nodejs-sensor')();
var express = require('express');
var connection = require('express-myconnection');
var app = express();
var srs = require('secure-random-string');
var kafka = require('kafka-node'),
            client = new kafka.Client('spring-music-kafka:9092'),
            producer = new kafka.Producer(client);

function produceMessage() {
  payloads = [
          { topic: 'test', messages: 'This is the First Message I am sending', partition: 0 },
      ];
  console.log(payloads);

  producer.on('ready', function(){
    producer.send(payloads, function(err, data){
        console.log(data)
      });
  });

  producer.on('error', function (err) {
    console.log(err);
  });

}

// Home Page
app.get('/', function (req, res) {

  console.log("Got a GET request for the homepage");

  var connection = mysql.createConnection({
      host: 'mysql',
      user: 'root',
      password: '',
      requestTimeout: 50,
      acquireTimeout: 100,
      port: 3306,
      database: 'socksdb'
  });

  srs({length: 20}, function(err, sr) {
    console.log(sr);
    var pst  = {name: sr};
    var query = connection.query("INSERT INTO tag set ? ", pst, function (err, results) {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(results);
            res.status(200).send("ok");
        }

        produceMessage();

        connection.end();

    });
  });

});

app.get('/addtocart', function (req, res) {
    console.log("Got a GET request for /list_user");

    var connection = mysql.createConnection({
        host: 'mysql',
        user: 'root',
        password: '',
        requestTimeout: 50,
        acquireTimeout: 100,
        port: 3306,
        database: 'socksdb'
    });

    var sql = "select * from tag;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            res.status(500).send(err);
        }
        console.log(results);
        res.status(200).send("ok");


    })


    connection.end();
})

var server = app.listen(8080, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
