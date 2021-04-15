const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const saltRounds = 12;
const expiration = '1d';

const returnError = (code, res, next) => {
  const messages = {
    401: 'Invalid Username or Password',
    409: 'Username unavailable',
    418: "I'm a teapot!",
    422: 'Missing Username or Password',
    500: 'RuhRoh! 😱 Unexpected server error!',
  };
  const error = new Error(messages[code]);
  res.status(code);
  next(error);
};

const signToken = (payload) =>
  jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expiration });

const createTokenSendResponse = async (user, req, res, next) => {
  try {
    const payload = {
      _id: user._id,
      username: user.username,
    };
    const token = signToken(payload);

    const date = new Date();
    date.setDate(date.getDate() + 30);

    res.cookie('jwt', token, {
      expires: date,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      samesite: 'none',
    });

    res.json({
      status: 'success',
      token,
      data: {
        payload,
      },
    });
  } catch (error) {
    returnError(500, res, next);
  }
};

const science = (req, res, next) => {
  createTokenSendResponse(
    {
      username: 'bob',
      _id: '56456465',
    },
    req,
    res,
    next
  );
  // res.json({ message: 'bro wtf' });
};

const checkUser = async (req, res, next) => {
  let currentUser;
  console.log('check user');

  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      console.log('decoded: ', decoded);
      currentUser = await User.findById(decoded._id).select('-password');
      console.log('check user, user found: ', currentUser);
    } catch (error) {
      return returnError(500, res, next);
    }
  } else {
    currentUser = null;
  }

  res.status(200).json({ currentUser });
};

const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      password: hash,
    });

    const saved = await user.save();
    createTokenSendResponse(saved, req, res, next);
  } catch (error) {
    returnError(500, res, next);
  }
};

const login = async (req, res, next) => {
  console.log(req.body);
  console.log(req.loggingInUser);
  try {
    const { password } = req.body;
    const user = req.loggingInUser;
    const valid = await bcrypt.compare(password, user.password);
    console.log('password is valid');
    if (valid) {
      createTokenSendResponse(user, req, res, next);
    } else {
      returnError(401, res, next);
    }
  } catch (error) {
    returnError(500, res, next);
  }
};

const logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).send('logout user');
};

module.exports = {
  checkUser,
  science,
  signup,
  login,
  logout,
};
