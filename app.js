const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Blog = require('./models/blog');
const mongodb = require('mongodb')
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;
const router = require('./routes/index.js');

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

// Express body parser
app.use(express.urlencoded({ extended: true }));

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
app.use('/blogs', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

app.get('/blogs', (req, res) => {
  Blog.find().sort({ created: -1 })
      .then(result => {
          res.render('blogs', { 'blogs': result, title: 'Lifestyle | Fashion | Technology' });
      })
      .catch(err => {
          console.log(err);
      });
});