const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();


// Passport Config
require('./config/passport')(passport);


// connection to MongoDB
mongoose.set('strictQuery', false);
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log('Database Connected . . .')
}).catch((err) => console.log(err));


// view engine
app.use(expressLayouts);
app.set('view engine', 'ejs')

// bodyparser
app.use(express.urlencoded({ extended: true }))


// Express session
app.use(
    session({
      secret: 'middleware',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//routes
app.use('/', require('./routes/users'));


const port = process.env.port;
app.listen(port, console.log(`server is up on ${port}`));
