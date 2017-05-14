const instana = require('instana-nodejs-sensor');

// Always initialize the sensor as the first module inside the application.
instana({
    tracing: {
        enabled: true
    }
});

const opentracing = require('opentracing');

opentracing.initGlobalTracer(instana.opentracing.createTracer());
const tracer = opentracing.globalTracer();

var express = require('express');
var express_connection = require('express-myconnection');
var mysql = require('mysql');
var app = express();
var srs = require('secure-random-string');
var http = require('http');

/*
var kafka = require('kafka-node'),
            client = new kafka.Client('spring-music-kafka:9092'),
            producer = new kafka.Producer(client);
*/
/*function produceMessage() {
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
*/

function logErrorToInstana(err) {

    var spanContext = instana.opentracing.getCurrentlyActiveInstanaSpanContext();

    var bad = tracer.startSpan('Exception:' + err.message, {childOf: spanContext});
    bad.setTag(opentracing.Tags.ERROR, true);
    bad.setTag('Error:', err);
    bad.setTag('Stack Trace:', err.stackTrace);
    bad.finish();

}

function remote_call() {
  var options = {
    host: 'spring-music-proxy',
    port: '88',
    path: 'index.html'
  };

  callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    request.on('error', function(err) {
      console.log(str);
      return false;
    });

    response.on('end', function () {
      console.log(str);
    });
  }

  try {
    http.request(options, callback).end();
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    return true;
  }
}

// Home Page
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
  }, function(err) {
    console.error("Error captured by query");
    console.error(err);
    res.status(500).send(err);
    return;
  });

  srs({length: 20}, function(err, sr) {
    console.log(sr);
    var pst  = {name: sr};
    var query = connection.query("INSERT INTO tag set ? ", pst, function (err, results) {

        if (err) {
            logErrorToInstana(err);
            console.error("Error captured by query");
            console.error(err);
           res.status(500).send(err);
        } else {
            console.log(results);
            res.status(200).send("ok");
        }

        //produceMessage();

        connection.end();

    });
  });
});

app.get('/addtocart', function (req, res) {
    console.log("Got a GET request for /addtocart");

    var connection = mysql.createConnection({
        host: 'spring-music-mysql',
        user: 'root',
        password: '',
        requestTimeout: 50,
        acquireTimeout: 100,
        port: 3306,
        database: 'socksdb'
    });

    var pst  = {name: req.param('p')};
    console.log(req.param('p'));
    var query = connection.query("INSERT INTO cart set ? ", pst, function (err, results) {

        if (err) {
            logErrorToInstana(err);
            console.error(err);
            res.status(500).send(err);
        } else {
            console.log(results);
            res.status(200).send("ok");
        }

        //produceMessage();

    });

      connection.end();

})

app.get('/paymentgateway', function (req, res) {
    console.log("Got a GET request for /micropayment");

    var connection = mysql.createConnection({
        host: 'spring-music-mysql',
        user: 'root',
        password: '',
        port: 3306,
        database: 'socksdb'
    });

    var sql = "select * from cart;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            logErrorToInstana(err)
            console.error(err);
            res.status(500).send(err);
            return;
        } else {
          console.log(results);
        }
    });

    var sql = "trunxcate cart;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            logErrorToInstana(err)
            console.error(err);
            res.status(500).send(err);
            return;
        } else {
          console.log(results);
          res.status(200).send("ok");
        }


    });

    connection.end();
})

var server = app.listen(8080, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
