var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const usersRouter = require('./app/routers/userRoute');
const {decodeToken} = require('./middleware')
const productRoute = require('./app/routers/productRoute')
const categoryRoute = require('./app/routers/categoryRoute')
const orderRoute = require('./app/routers/orderRoute')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(decodeToken())

//route
app.use('/auth' ,usersRouter)
app.use('/api' ,productRoute)
app.use('/api' ,categoryRoute)
app.use('/api' ,orderRoute)
app.use('/', function (req, res) {
  res.render('index', {
    title : "e commerce api service"
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
