const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    content: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment', CommentSchema);