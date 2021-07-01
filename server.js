const express = require('express');
const multer  = require('multer')

const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Blog = require('./models/blog');
const mongodb = require('mongodb')
const app = express();
const dotenv = require('dotenv').config()

// DB Config
//const db = require('./config/keys').mongoURI;
const db = process.env.dbPassword;

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .then(() =>  app.listen(PORT, console.log(`Server running on Port: ${PORT}`)))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express static route
app.use(express.static('public'))

// Express body parser
app.use(express.urlencoded({ extended: true }));

//Multer Middleware
let Storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
})

// let upload = multer({
//   storage: Storage
// }).single('file');
 
// let upload = multer({ storage: storage })

// Express session
app.use(
  session({
    secret: 'secret',
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

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/blogs/newblog', require('./routes/index.js'))

