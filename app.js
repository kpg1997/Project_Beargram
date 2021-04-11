const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signRouter = require('./routes/sign');
const loginRouter = require('./routes/login');
const headerRouter = require('./routes/header');
const mainBoardRouter = require('./routes/mainBoard');
const myPagedRouter = require('./routes/myPage');
const DmRouter = require('./routes/Dm');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/login', loginRouter);
app.use('/mainBoard', mainBoardRouter);
app.use('/header', headerRouter);
app.use('/myPage', myPagedRouter);
app.use('/users', usersRouter);
app.use('/Dm',DmRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('????????')
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
