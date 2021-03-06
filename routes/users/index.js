const data = require('../../data.json');
const users = require('express').Router();

const findObject = require('../../utils/findObject');

users.param('userId', findObject('user'));

const all = require('./all');
users.get('/', all);

const single = require('./single');
users.get('/:userId', single);

const posts = require('./posts');
users.use('/:userId/posts', posts);

module.exports = users;