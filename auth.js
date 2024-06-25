require('dotenv').config()
const jwt = require('jsonwebtoken');
var JWT_SECRET=process.env.JWT_SECRET;

function generateToken(payload) {
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
}

function isLoggedIn(req, res, next) {

  // Check if the user has token in cookies. If not return the request;
  if(!req.cookies.jwt) return res.redirect('/login');
  const clientToken = req.cookies.jwt;

 try {
  //  Decode the client token by using same secret key that we used to sign the token
    const decoded = jwt.verify(clientToken, JWT_SECRET);
    req.user = decoded;
    next();
 }
 catch(err){
    res.json({error: 'Invalid Token'});
    return res.redirect('/login');
 }

}

module.exports = {
  generateToken,
  isLoggedIn
}
