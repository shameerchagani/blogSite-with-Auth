const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const upload = require("../middleware/multer");
const cloudinary = require("../middleware/cloudinary");

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

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
router.post('/blogs', upload.single("file"), ensureAuthenticated, async (req,res) =>{
   // console.log(req.file)
   const result = (!req.file) ? {secure_url:"https://res.cloudinary.com/shameer/image/upload/v1625835736/tja0cxagyrucgalxwgyk.png", public_id:"tja0cxagyrucgalxwgyk"} : await cloudinary.uploader.upload(req.file.path);
   
  //  if(!req.file){
  //     const result = {secure_url:"https://res.cloudinary.com/shameer/image/upload/v1625835736/tja0cxagyrucgalxwgyk.png", public_id:"tja0cxagyrucgalxwgyk"}
  //   }else{
  //     const result = await cloudinary.uploader.upload(req.file.path);
  //   } 
      
    const blog = await new Blog({
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      snippet: req.body.snippet,
      author: req.user.name, 
      image: result.secure_url,
      cloudinaryId: result.public_id,

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