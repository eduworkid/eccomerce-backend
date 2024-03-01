const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  let payload = req.body;
  try {
    let user = new User(payload);
    await user.save();
    res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
const update = async (req, res, next) => {
  let payload = req.body;
  let { id } = req.params;
  try {
    let user = await User.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
      runValidations: true,
    });
    res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
const show = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { us_email, us_password } = req.body;
  try {
    const user = await User.findOne({ us_email });
    if (!user) {
      return res.status(400).json({ message: "Email tidak terdaftar." });
    }
    if (!bcrypt.compareSync(us_password, user.us_password)) {
      return res.status(400).json({ message: "Kata sandi salah." });
    }
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const payload = {
      user,
      exp: exp,
    };
    let signed = jwt.sign(payload, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    res.json({ user, token: signed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mencoba masuk." });
  }
};

const logout = async (req, res, next) => {
  let token = getToken(req);
  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token: token } },
    { useFindAndModify: false }
  );
  if (!token || !user) {
    res.status(400).json({
      error: 1,
      message: "user not found",
    });
  }
  return res.status(200).json({
    error: 0,
    message: "logout Succes",
  });
};
const me = (req, res, next) => {
  if (!req.user) {
    res.status(500).json({
      error: 1,
      message: `You're not login or token expired`,
    });
    next(err);
  }
  res.json(req.user);
};

module.exports = me;

module.exports = { register, login, logout, me, show, update };
