const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

router.post('/', async(req, res) => {
  const {error} = validateAuth(req.body);
  if(error) return res.send(error.details[0].message);

  if(req.body.email) {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.send('The given email is not registered yet!');
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.send('The given password not matched, try again');
    
    if(validPassword) {
      const token = user.generateAuthToken();
      res.send(token);
    } else{
      res.send('password not valid try again');
    }
  } 

  if(req.body.mobile) {
    const user = await User.findOne({mobile: req.body.mobile});
    if(!user) return res.send('The given mobile is not valid or registered');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.send('The given password does not matched');
    
    if(validPassword) {
      const token = user.generateAuthToken();
      res.send(token);
    } else{
      res.send('password not valid try again');
    }
  }
 
});



function validateAuth(req) {
  const schema = {
    email: Joi.string().min(3).max(255).email(),
    mobile: Joi.string().min(3).max(11),
    password: Joi.string().min(3).max(255).required()
  }

  return Joi.validate(req, schema);
}


module.exports = router;