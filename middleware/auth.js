const jwt = require('jsonwebtoken');
const config = require('config');

function auth (req, res, next) {
  const token = req.header('x-auth-token');
  if(!token) return res.send('Access deined no token provided!');

  try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch(ex) {
    res.send('Invalid token!');
  }
}

module.exports = auth;
