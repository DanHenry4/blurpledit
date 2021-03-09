const mongoose = require('mongoose');
const uuid = require('uuid');

const UserSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4(),
        // validate: {
        //     validator: (v) => {
        //         return v.test(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/);
        //     },
        //     message: 'That doesn\'t look like a UUID to me...'
        // }
    },
    publicId: {
        type: String,
        default: uuid.v4(),
        // validate: {
        //     validator: (v) => {
        //         return v.test(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/);
        //     },
        //     message: 'That doesn\'t look like a UUID to me...'
        // }
    },
    name: {
        type: String,
        maxlength: [32, 'Sorry, chum. There\'s a 32 character limit at this establishment.']
    },
    ipAddress: {
        type: String,
        // validate: {
        //     validator: (v) => {
        //         return v.test(/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/);
        //     },
        //     message: 'Your IP address is whack, yo...'
        // },
        required: [true, 'You honestly thought you could talk to the Internet without an IP address?']
    },
    votes: {
        type: Number,
        default: 0
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);