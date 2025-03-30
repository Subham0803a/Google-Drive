require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailTemplates = require('../view/email-template');
const { User } = require('../models/index');
const { generateOTP, sendOTP } = require('../utils/helpers/otp');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'email already exist, Please try a new one'
      })
    }

    const salting = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salting);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username }, process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 86400000,
    });

    const template = emailTemplates.welcome(username, email);

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    // sending welcome email
    const mailOptions = {
      from: `"StoreIt Team" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User created Sucessfully' })

  } catch (err) {
    console.error(err);
    next(err);

  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: 'email and password are required'
      })
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const tempToken = jwt.sign(
      { id: user._id, username: user.username, verified: false }, 
      process.env.JWT_SECRET,
      { expiresIn: '15m' } 
    );

    res.cookie('token', tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    await sendOTP(user.email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'email and OTP are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(401).json({
        message: 'Invalid or expired OTP'
      });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username }, process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 86400000,
    });

    res.status(201).json({ message: 'User login Sucessfully' });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(204).json({ message: 'User logout successful' });
};


module.exports = {
  register,
  login,
  verifyOTP,
  logout,
};