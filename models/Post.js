const mongoose = require('mongoose');
const uuid = require('uuid');

const PostSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        maxlength: [24, 'There is a 24 character limit on tags, buddy.']
    },
    date: {
        type: Date,
        default: Date.now
    },
    nsfw: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model('Post', PostSchema);