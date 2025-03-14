const { verifyToken } = require('../middleware/token');

/**
 * Middleware to authenticate requests using access token
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'No access token provided' });
    }
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; 
    next(); 

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid access token' });
    }
    next(error);
  }
};

module.exports = authMiddleware;