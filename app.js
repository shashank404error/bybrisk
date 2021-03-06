var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var homepageRouter = require('./routes/homepage');
var fileupload = require('express-fileupload');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(fileupload({useTempFiles : true,
    tempFileDir : '\\tmp\\'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.post('/getting-started',authRouter);
app.get('/launch-your-business',authRouter);
app.post('/homepage',authRouter);
app.post('/itemUpload',homepageRouter);
app.post('/back-to-store',homepageRouter);
app.get('/itemInfoAdded',homepageRouter);
app.get('/itemPicAdded',homepageRouter);
app.post('/redirecting',authRouter);
app.get('/categoryItem',homepageRouter);


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
