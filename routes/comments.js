const {User} = require('../models/user');
const {Post} = require('../models/post');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/:id', auth,  async(req, res) => {
  // const userId = req.user._id;
  // let user = await User.findById(userId);
  const post = await Post.findByIdAndUpdate({_id: req.params.id}, {
    $push: {comments: {text: req.body.comment, userId: mongoose.Types.ObjectId(req.user._id)}}
  }, {new:true})
  

  res.send(post);

});


module.exports = router;


