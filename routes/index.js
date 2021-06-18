const express = require('express');
const router = express.Router();
const Blog = require('../models/blog'); 

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/blogs', ensureAuthenticated, (req, res) =>
  res.render('blogs', {
    user: req.user
  })
);

module.exports = router;
