module.exports = (connection) => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const PostSchema = new Schema({
        title: {
            type: String
        },
        content: {
            type: String
        },
        tag: {
            type: [String],
            maxlength: [24, 'There is a 24 character limit on tags, buddy.']
        },
        votes: {
            type: Number,
            default: 1
        },
        re: {
            type: Schema.Types.ObjectId,
            default: undefined
        },
        date: {
            type: Date,
            default: Date.now
        },
        nsfw: {
            type: Boolean,
            default: false
        }
    });

    return connection.model('Post', PostSchema);
}