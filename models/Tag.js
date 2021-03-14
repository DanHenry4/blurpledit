module.exports = (connection) => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const TagSchema = new Schema({
        name: {
            type: String
        },
        attentionUnits: {
            type: Number,
            default: 1
        }
    });

    return connection.model('Tag', TagSchema);
}