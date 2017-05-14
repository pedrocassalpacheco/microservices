var config = require('../config.js');
var router = express.Router();
var mysql = require('mysql');
var srs = require("secure-random-string");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Got a GET request for the addtocart");
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


    var pst  = {name: req.param('p')};
    var query = connection.query("INSERT INTO cart set ? ", pst, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(results);
            res.status(200).send("ok");
        }
    });

    connection.end();
}

module.exports = router;
