const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  type:{
    type: String,
    required: true,
    default: 'Public',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
      type: String,
      required: true,
  },
  
  snippet: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
  },
  file:{
    type: String
  },
  created: {
      type: Date,
      default: Date.now()
  },
  image: {
    type: String,
    default:"https://res.cloudinary.com/shameer/image/upload/v1625835736/tja0cxagyrucgalxwgyk.png"
  },
  cloudinaryId: {
    type: String,
    require: true,
    defaule:"tja0cxagyrucgalxwgyk"
  },

})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;