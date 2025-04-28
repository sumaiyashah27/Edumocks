const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('🔐 Auth middleware called'); // Add this line
  
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }
  };
  

module.exports = authMiddleware;
