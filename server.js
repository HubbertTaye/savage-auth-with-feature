// server.js

// set up ======================================================================
// get all the tools we need (modules)
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080; //either enviornment variable port or 8080 (will set up enviornment later)
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose'); //works with mongodb
var passport = require('passport'); //authentication module (create users, log in session, etc)
var flash    = require('connect-flash'); //view/access error messages. 'wrong password' etc

var morgan    = require('morgan'); //debugger, also logs all requests in cmd
var cookieParser = require('cookie-parser'); //work w/ cookies. in this case user login session
var bodyParser   = require('body-parser');
var session      = require('express-session'); //where ever u move in the app, u r still logged in thus can always go back to the profile page. this is called a session (idk if its related to this part)

var configDB = require('./config/database.js'); //stores databse object contains url and dbName from file config/database.js made for keeping database info secret when pushing to git

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db); //passes app, passport and db into file routes in folder app. routes.js runs a function
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
