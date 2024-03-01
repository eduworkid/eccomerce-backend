const {getToken} = require('../utils')
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../app/models/userModel");

function decodeToken() {
    return async function (req, res, next) {
      try {
        let token = getToken(req);
        if (!token) return next();
        req.user = jwt.verify(token, config.secretKey);
        let user = await User.findOne({ token: token });
        if (!user) {
          return res.status(400).json({
            error: 1,
            message: "Token expired or your not login",
          });
        }
      } catch (err) {
        if (err && err.name === "JsonWebTokenError") {
          return res.json({
            error: 1,
            message: err.message,
          });
        }
        next(err);
      }
      return next();
    };
  }
  function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const tokenValue = token.split(' ')[1]; 

    jwt.verify(tokenValue, config.secretKey, (err, decoded) => {
        if (err) {
            console.error('Failed to authenticate token:', err.message);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; 
        next();
    });
}
module.exports = {decodeToken,verifyToken}