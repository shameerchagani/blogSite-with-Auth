const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));
router.get('/blogs/newblog', (req,res) => res.render('newblog'));

// Dashboard All Blogs...
router.get('/blogs', ensureAuthenticated, (req, res) =>
  Blog.find().sort({ created: -1 })
    .then(result => {
      res.render('blogs', {
        'blogs': result,
        'title': 'Lifestyle | Fashion | Technology',
        'user': req.user
      })
    })
    .catch(err => {
      console.log(err);
    })
)

//Get Blogs By ID
router.get('/blogs/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
        //res.json(result)
      res.render('details', { blog: result, title: 'Blog Details', user: req.user });
    })
    .catch(err => {
      res.status(404).render('404', {title: 'Page Not Found'});
    });
});

//Delete Blog By Id
router.delete('/blogs/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

//create blog 
router.post('/blogs', (req,res) =>{
  const blog = new Blog(req.body);
  blog.save()
      .then(result => {
        console.log(result)
        res.redirect('/blogs/');
      })
      .catch(err => {
        console.log(err);
      });
})




module.exports = router;