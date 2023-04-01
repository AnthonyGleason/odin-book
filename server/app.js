var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var app = express();

//dotenv
const env = require('dotenv');
env.config();

//setup express session
const session = require('express-session');
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

//setup passport
const passport = require('passport');

//setup jwt
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
app.use(passport.initialize());
app.use(passport.session());
const {getUser} = require('./controllers/user');
passport.use(
  new JwtStrategy({
    //options
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
  },async (jwtPayload,done)=>{
    try{
      const user = await getUser(jwtPayload.id);
      if (user){
        return done(null,user);
      }else{
        return done(null,false);
      }
    }catch(e){
      console.log(`there was an error ${e} when getting the user`);
      res.status(401).send({message: 'Unauthorized'});
    }
  })
);
passport.serializeUser((user,done)=>{
  return done(null,user._id);
})
passport.deserializeUser(async (docID,done)=>{
  const user = await getUser(docID);
  return done(null,user);
});

//cors
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));

//setup mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('Successfully connected to mongodb');
}).catch((e)=>{
  console.log(`There was an error when connecting to the mongodb database. ${e}`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',apiRouter);
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
