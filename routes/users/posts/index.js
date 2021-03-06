const posts = require('express').Router({ mergeParams: true });
const findObject = require('../../../utils/findObject');

const all = require('./all');
posts.get('/', all);

posts.param('postId', findObject('post'));

const single = require('./single');
posts.get('/:postId', single);

module.exports = posts;