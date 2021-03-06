const data = require('../../../data.json');

module.exports = (req, res) => {
  const userId = req.params.userId * 1;
  const posts = data.posts.filter(p => p.userId === userId);

  res.status(200).json({ posts });
};