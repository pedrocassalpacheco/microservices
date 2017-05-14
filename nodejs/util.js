var http = require('http');

function remote_call(parameters) {
    var options = {
        host: parameters.host,
        port: parameters.port,
        path: parameters.page
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