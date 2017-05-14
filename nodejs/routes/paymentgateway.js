var express = require('express');
var config = require('../config.js');
var router = express.Router();
var mysql = require('mysql');
var srs = require("secure-random-string");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Got a GET request for paymentgateway");
    handleRoute({req: req, res: res});
});

function handleRoute(parameters) {

    var req = parameters.req;
    var res = parameters.res;

    var connection = mysql.createConnection({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.pw,
        requestTimeout: 50,
        acquireTimeout: 100,
        database: 'socksdb'
    });

    var sql = "select * from cart;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }

        console.log(results);
    });

    var sql = "truncate cart;"
    connection.query(sql, {}, function (err, results) {

        if (err) {
            res.status(500).send(err);
            return;
        }
        console.error(results);

    });

    connection.end();

    res.status(200).send("ok");

}

module.exports = router;
