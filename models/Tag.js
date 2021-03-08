const mongoose = require('mongoose');
const uuid = require('uuid');

const TagSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    name: {
        type: String,
        required: true,
        maxlength: [32, 'If tags are too long, they\'ll be meaningless. 32 character max!']
    }
});

module.exports = mongoose.model('Tag', TagSchema);