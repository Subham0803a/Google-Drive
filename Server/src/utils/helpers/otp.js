const nodemailer = require('nodemailer');
const crypto = require('crypto');
const emailTemplates = require('../../view/email-template');


const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const template = emailTemplates.otpVerification(otp);

    const mailOptions = {
      from: `"StoreIt Team" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = { 
  generateOTP, 
  sendOTP,
};