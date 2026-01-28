require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    expiresIn: '7d', // 7 days
};
