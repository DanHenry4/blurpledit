const routes = require('express').Router();

const users = require('./users');
routes.use('/users', users);

routes.get('/', (req, res) => {
  res.render('index', { title: "Home!", data: req.user });
});

module.exports = routes;