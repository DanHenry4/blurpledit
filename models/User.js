const mongoose = require('mongoose');
const uuid = require('uuid');

const UserSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    publicId: {
        type: String,
        default: uuid.v4()
    },
    name: {
        type: String,
        maxlength: [32, 'Sorry, chum. There\'s a 32 character limit at this establishment.']
    },
    posts: {
        type: [String]
    },
    comments: {
        type: [String]
    },
    saved: {
        type: [String]
    },
    followed: {
        type: [String]
    }
});

module.exports = mongoose.model('User', UserSchema);