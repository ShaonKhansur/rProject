const bcrypt = require('bcrypt');
const express = require('express');
const {User, validateUser} = require('../models/user');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/', [auth, admin], async(req, res) => {
  let users = await User.find();
  let use = users.map((user) => {
    return {
      name: user.name, 
      mobile: user.mobile,
      email: user.email,
    };
  });
  res.send(use);
});

router.post('/', async(req, res) => {
  const {error} = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const getUserByEmail = await User.findOne({email: req.body.email})
  if(getUserByEmail) return res.send('The given email is already registered!');

  if(!getUserByEmail) {
    const getUserByMobile = await User.findOne({mobile: req.body.mobile});
    if(getUserByMobile) return res.send('The given mobile is already registered!');
  }
  const roundSalt = 10;
  const salt = await bcrypt.genSalt(roundSalt);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    isAdmin: req.body.isAdmin,
    password: hashPassword
  });
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(user);
});

router.get('/:id', [auth, admin], async(req, res) => {
  let user = await User.findById(req.params.id);
  if(!user) return res.status(404).send('The user with the given id not found');
  res.status(200).send(user);
});

router.put('/:id', [auth, admin], async(req, res) => {
  const {error} = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      isAdmin: req.body.isAdmin
    }
  }, {new: true})
  if(!user) return res.status(404).send('The user with the given id not found');
  res.send(user);
});

router.delete('/:id', [auth, admin], async(req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if(!user) return res.status(404).send('The user with the given id not found');
  res.send(user);
});





module.exports = router;