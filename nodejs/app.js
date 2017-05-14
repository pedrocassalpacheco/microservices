require('instana-nodejs-sensor')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var home = require('./routes/home');
var cart = require('./routes/addtocart');
var payment = require('./routes/paymentgateway');
var app = express();

app.use('/', home);
app.use('/addtocart', cart);
app.use('/paymentgateway', payment);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    console.error(err);
  res.status(err.status || 500);

});

module.exports = app;
