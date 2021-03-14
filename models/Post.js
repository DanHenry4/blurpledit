module.exports = (connection) => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    //const Tag = connection.model('Tag').schema;

    const PostSchema = new Schema({
        title: {
            type: String
        },
        content: {
            type: String
        },
        tags: {
            type: [String]
        },
        attentionUnits: {
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