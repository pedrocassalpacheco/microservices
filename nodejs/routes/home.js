var express = require('express');
var config = require('../config.js');
var router = express.Router();
var mysql = require('mysql');
var srs = require("secure-random-string");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Got a GET request for the homepage");
    handleRoute({req: req, res: res});
});

function handleRoute(parameters) {
    var req = parameters.req;
    var res = parameters.res;


    res.status(200).send("Up and running");
}

module.exports = router;
