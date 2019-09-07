const auth = require('../middleware/auth');
const {Post} = require('../models/post');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {

 let posts  = await Post.aggregate([{
   $lookup: {
     from: 'users', 
     localField: 'userId', 
     foreignField: '_id', 
     as: 'postCreator'
    }}]);

 res.send(posts);
});

router.post('/', auth, async(req, res) => {
  // let userId = req.user._id;
  // let user = await User.findById(userId);

  let post = new Post({
    userId: req.user._id,  
    post: req.body.post
  });

  post = await post.save();
  res.send(post);
  // // const user = await User.findById(req.params.id);
  // // if(!user) return res.send('Then given id user not found');
  // let post = new Post({
  //   user: req.user._id,
  //   post: req.body.post,
  //   // user: {
  //   //   _id: user._id,
  //   //   name: user.name,
  //   //   email: user.email,
  //   //   mobile: user.mobile,
  //   //   isAdmin: user.isAdmin
  //   // },
  //   // post: req.body.post,
  // });

  // post = await post.save();
  // res.send(post);

});



module.exports = router;