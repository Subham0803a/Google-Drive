const Auth = require('../models/auth');
const { hashPassword, comparePassword } = require('../utils/middleware/passroed');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/middleware/token');
const { generateOTP, sendOTP } = require('../utils/middleware/otp');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { username, gmail, password } = req.body;

    if (!username || !gmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await Auth.findOne({ $or: [{ username }, { gmail }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Gmail already exists' });
    }

    const hashedPassword = hashPassword(password);
    const user = new Auth({ username, gmail, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Initiate login: validate credentials and send OTP
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await Auth.findOne({ username });
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5-minute expiration
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    await sendOTP(user.gmail, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Verify OTP and complete login
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ message: 'Username and OTP are required' });
    }

    // Verify OTP
    const user = await Auth.findOne({ username });
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Log out
 */
const logout = (req, res) => {
  res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out successfully' });
};

/**
 * Refresh access token using refresh token
 */
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Auth.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ message: 'Access token refreshed' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Refresh token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    next(error);
  }
};

module.exports = { register, login, verifyOTP, logout, refresh };