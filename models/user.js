const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  mobile: {
    type: String,
    minlength:4,
    maxlength: 11,
    unique:true,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  date: {
    type: Date,
    default: Date.now
  },

  password: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema  = {
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(3).max(11).required(),
    isAdmin: Joi.boolean(),
    password: Joi.string().min(3).max(255).required()
  }
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;