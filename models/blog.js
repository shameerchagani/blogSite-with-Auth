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

})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;