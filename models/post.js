const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  userId: {

    type: mongoose.Schema.Types.ObjectId
    // type: new mongoose.Schema({
    //   name: {
    //     type: String,
    //     minlength: 3,
    //     maxlength: 30
    //   },
    //   email: {
    //     type: String,
    //   },
    //   mobile: {
    //     type: String
    //   },
    //   isAdmin: {
    //     type: Boolean
    //   }
    // }),
  },

  post: {
    type: String,
    minlength: 1,
    required: true
  },
  comments: {
    type: Array
  }

});

const Post = mongoose.model('Post', postSchema);


module.exports.Post = Post;
module.exports.postSchema = postSchema; 