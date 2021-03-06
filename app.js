const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const accessSecret = process.env.ACCESS_TOKEN_SECRET;

const { v4: uuidv4 } = require('uuid');

const path = require('path');

const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Authenticate a jwt or assign one if missing.
app.use((req, res, next) => {
    const reqCookie = req.cookies.token;
    if (reqCookie === undefined) {
        // Setup new jwt...
        const new_uuid = uuidv4();

        const t1 = new Date().getTime();
        const t2 = new Date(2045, 1, 1, 0, 0, 0, 0).getTime();
        const expiresIn = t2 - t1;

        const accessToken = jwt.sign(
            { uuid: new_uuid },
            accessSecret,
            { expiresIn: expiresIn }
        );

        res.cookie(
            'token',
            { token: accessToken },
            { maxAge: expiresIn, httpOnly: true }
        );

        req.user = new_uuid;
    } else {
        const token = reqCookie.token;
        jwt.verify(token, accessSecret, (err, user) => {
            if (err) {
                return error;
            }

            req.user = user.uuid;
        });
    }
    next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Handle Routes
const routes = require('./routes');
const { Recoverable } = require('repl');
app.use('/', routes);

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