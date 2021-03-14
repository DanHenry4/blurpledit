module.exports = (connection) => {
    const express = require('express');
    const app = express();

    const findObject = require('../utils/findObject');

    // Compile models.
    //const Tag = require('../models/Tag')(connection);
    const Post = require('../models/Post')(connection);
    const User = require('../models/User')(connection);

    // Setup middlewares.
    const auth = require('../middleware/auth')(connection);
    app.use(auth);

    // Handle Routes
    const userRouter = express.Router();
    const tagRouter = express.Router();
    const postRouter = express.Router({mergeParams: true});

    userRouter.use('/:userId/post', postRouter);
    tagRouter.use('/:tag/post', postRouter);

    userRouter.get('/', async (req, res) => {
        res.render('users/all', {
            title: `Users`,
            data: await findObject({
                Type: User, 
                maxVotes: req.query.v
            })
        });
    });

    userRouter.get('/:username', async (req, res) => {
        res.render('users/single', {
            title: `${req.params.username}'s profile`,
            userData: await findObject({
                Type: User, 
                username: req.params.username
            }),
            posts: await findObject({ 
                Type: Post, 
                username: req.params.username,
                maxVotes: req.query.v
            }),
        });
    });

    tagRouter.get('/:tag', async (req, res) => {
        res.render('posts/all', {
            title: `${req.params.tag}`,
            data: await findObject({
                Type: Post, 
                tag: req.params.tag,
                maxVotes: req.query.v
            })
        });
    });

    app.use('/user', userRouter);
    app.use('/tag', tagRouter);

    app.get('/', async (req, res) => {
    res.render('index', {
        title: "Home!",
        user: req.user,
        data: {
            posts: await findObject({
                Type: Post, 
                maxVotes: req.query.v 
            })
        }});
    });

    return app;
}