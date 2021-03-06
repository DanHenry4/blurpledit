const data = require('../../data.json');

module.exports = (req, res) => {
    const user = req.user;
    
    res.status(200).json({ user });
};