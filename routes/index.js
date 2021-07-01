const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const multer  = require('multer')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Multer Middleware
let Storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
})
let upload = multer({ storage: Storage}).single('file');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/blogs/newblog', ensureAuthenticated, (req,res) => res.render('newblog', {user: req.user}));

//about and contact routes
router.get('/about', (req, res) => res.render('about.ejs', {user: req.user} ));
router.get('/contact', (req, res) => res.render('contact.ejs', {user: req.user} ));
router.get('/404', (req, res) => res.render('404.ejs'));

// Dashboard All Blogs...
router.get('/blogs', (req, res) =>
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
router.get('/blogs/:id', (req, res) => {
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
      res.render('/blogs/404')
    });
});

//create blog 
router.post('/blogs', upload, ensureAuthenticated,(req,res) =>{

   
    const blog = new Blog({
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      snippet: req.body.snippet,
      author: req.user.name, 
      // file: req.file.filename
    })
    const author = req.user.name
    blog.save()
        .then(result => {
         res.redirect('/blogs/');
        })
        .catch(err => {
          console.log(err);
        });
  
})


module.exports = router;