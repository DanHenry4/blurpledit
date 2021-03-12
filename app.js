const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');

// Connect to Database
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASS;
const dbname = process.env.DB_NAME;
const mongoDB = `mongodb+srv://${dbuser}:${dbpass}@cluster0.vhzc0.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to db...');
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set the routes.
const routes = require('./routes/routes')(conn);
app.use(routes);

// If we ever choose to switch to a API format, we may need to use this
// app.use(express.json());
// app.use(cookieParser());

// Server Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});