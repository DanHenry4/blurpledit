module.exports = (connection) => {
    const express = require('express');
    const app = express();
    const cookieParser = require('cookie-parser');

    const jwt = require('jsonwebtoken');
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    const { v4: uuidv4 } = require('uuid');

    const User = connection.model('User');


    app.use(cookieParser());

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

    return app;
}