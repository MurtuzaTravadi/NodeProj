var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var logger = require('../Logger/winston').logger
var User = require('../Database/Model/User')
var secretKey = '!supersecret'
function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if (!token) {
    logger.info("------------------------------New Request-----------------------------------------")
    logger.info("Token:- " + token)
    logger.info("Token:- " + JSON.stringify(req.headers))
    return res.status(200).send({ code: 108, auth: false, message: 'Failed to authenticate token.' });
  }
  logger.info("------------------------------New Request-----------------------------------------")
  logger.info("Token:- " + token)
  logger.info("Token:- " + JSON.stringify(req.headers))
  // verifies secret and checks exp
  jwt.verify(token, secretKey,async function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    logger.info("auth:- success" + " userId :-" + decoded.id + "userEmail" + decoded.email)
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  });

}

module.exports = verifyToken;