const emailTemplates = {
  welcome: (username, email) => ({
    subject: 'Welcome to StoreIt - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a69bd; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          .button { display: inline-block; background-color: #4a69bd; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to StoreIt!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username || 'there'},</h2>
            <p>Thank you for joining StoreIt! Your account has been successfully created.</p>
            <p><strong>Your registered email:</strong> ${email}</p>
            <p>With StoreIt, you can:</p>
            <ul>
              <li>Safely store your important files</li>
              <li>Access your documents from anywhere</li>
              <li>Share files with friends and colleagues</li>
            </ul>
            <p>Get started by logging into your account:</p>
            <div style="text-align: center;">
              <a href="https://your-storeit-url.com/login" class="button">Login to Your Account</a>
            </div>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The StoreIt Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} StoreIt. All rights reserved.</p>
            <p>You're receiving this email because you signed up for a StoreIt account.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  
  otpVerification: (otp) => ({
    subject: 'StoreIt - Your Login Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a69bd; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .otp-container { text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4a69bd; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Required</h1>
          </div>
          <div class="content">
            <h2>Hello there,</h2>
            <p>You recently attempted to sign in to your StoreIt account. For your security, we require verification.</p>
            <p>Please use the verification code below to complete your login:</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p>This code will expire in 10 minutes.</p>
            <p><strong>Important:</strong> If you did not attempt to log in, please secure your account by changing your password immediately.</p>
            <p>Best regards,<br>The StoreIt Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} StoreIt. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

module.exports = emailTemplates;