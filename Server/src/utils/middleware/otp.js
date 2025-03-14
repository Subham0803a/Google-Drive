const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * Generate a random 6-digit OTP
 * @returns {String} - 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Send OTP to the user's email
 * @param {String} email - User's email address
 * @param {String} otp - OTP to send
 */
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    }
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTP };