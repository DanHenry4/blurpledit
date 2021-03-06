const data = require('../../../data.json');

module.exports = (req, res) => {
    const post = req.post;

    res.status(200).json({ post });
};