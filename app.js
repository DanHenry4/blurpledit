// TODO this file is getting a bit cumbersome.
// Find a way to move the routes into their own file.

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const accessSecret = process.env.ACCESS_TOKEN_SECRET;

const { v4: uuidv4 } = require('uuid');

const path = require('path');

const User = require('./models/User');
const Post = require('./models/Post');
const findObject = require('./utils/findObject');

const mongoose = require('mongoose');

app.use(cookieParser());

// Authenticate a jwt or assign one if missing.
app.use(async (req, res, next) => {
    const reqCookie = req.cookies.token;
    if (reqCookie === undefined) {
        // Setup new jwt...
        const uuid = uuidv4();

        const t1 = new Date().getTime();
        const t2 = new Date(2045, 1, 1, 0, 0, 0, 0).getTime();
        const expiresIn = t2 - t1;

        const accessToken = jwt.sign(
            { uuid: uuid },
            accessSecret,
            { expiresIn: expiresIn }
        );

        res.cookie(
            'token',
            { token: accessToken },
            { maxAge: expiresIn, httpOnly: true }
        );

        req.user = {};
        req.user._id = uuid;
        req.user.username = uuid.substring(0,32); // 32 is the max length a displayname can be
        req.user.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Insert new user into database.
        const newUser = new User({
            _id: req.user._id,
            username: req.user.username,
            ipAddress: req.user.ipAddress
        });
        newUser.save();
    } else {
        const jwtUser = jwt.verify(reqCookie.token, accessSecret, (err, user) => {
            if (err) { res.status(403).send(err); }
            else { return user.uuid; }
        });

        if (req.user === undefined) {
            const userQuery = await User.findById(jwtUser, '_id username');
            req.user = JSON.stringify(userQuery);
        }
    }

    // Keep track of user on backend but mask the id of user to other users.
    if (req.privateMode === true) {
        req.user.username = 'anonymous';
        req.user._id = null;
    }

    next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Handle Routes
const userRouter = express.Router();
const tagRouter = express.Router();
const postRouter = express.Router({mergeParams: true});

userRouter.use('/:userId/post', postRouter);
tagRouter.use('/:tag/post', postRouter);

userRouter.get('/', async (req, res) => {
  res.status(200).json(await findObject({ Type: User }));
});

userRouter.get('/:username', async (req, res) => {
    res.render('single', {
        title: `${req.params.username}'s profile`,
        username: req.params.username,
        data: await findObject({ Type: User, username: req.params.username })
    });
});

app.use('/user', userRouter);
app.use('/tag', tagRouter);

app.get('/', async (req, res) => {
  res.render('index', {
      title: "Home!",
      user: req.user,
      posts: await findObject({ Type: Post })
    });
});

// Connect to Database
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;
const dbname = process.env.DB_NAME;
const mongoDB = `mongodb+srv://${dbuser}:${dbpass}@cluster0.vhzc0.mongodb.net/${dbname}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to db...');
});

// Server Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});