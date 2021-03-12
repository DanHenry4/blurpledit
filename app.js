// TODO this file is getting a bit cumbersome.
// Find a way to move the routes into their own file.

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');

const findObject = require('./utils/findObject');

// Connect to Database
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;
const dbname = process.env.DB_NAME;
const mongoDB = `mongodb+srv://${dbuser}:${dbpass}@cluster0.vhzc0.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to db...');
});

// Compile models.
const Post = require('./models/Post')(conn);
const User = require('./models/User')(conn);

const auth = require('./middleware/auth')(conn);
app.use(auth);

// If we ever choose to switch to a API format, we may need to use this
// app.use(express.json());
// app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

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
            page: req.query.p 
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
            page: req.query.p
        }),
    });
});

tagRouter.get('/:tag', async (req, res) => {
    res.render('posts/all', {
        title: `${req.params.tag}`,
        data: await findObject({ 
            Type: Post, 
            tag: req.params.tag,
            page: req.query.p
         })
    });
});

app.use('/user', userRouter);
app.use('/tag', tagRouter);

app.get('/', async (req, res) => {
  res.render('index', {
      title: "Home!",
      user: req.user,
      data: await findObject({ Type: Post })
    });
});

// Server Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});