const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {

    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("middle ware is working")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token missing.',
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// module.exports = verifyToken;