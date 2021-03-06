const mongoose = require('mongoose');

const AuthSchema = mongoose.Schema({
    ip : {
        type: String,
        validate: {
            validator: (v) => {
                return v.test(/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/);
            },
            message: 'Your IP address is whack, yo...'
        },
        required: [true, 'You honestly thought you could talk to the Internet without an IP address?']
    },
    uuid: {
        type: String,
        validate: {
            validator: (v) => {
                return v.test(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/);
            },
            message: 'That doesn\'t look like a UUID to me...'
        },
        required: [true, 'If you aren\'t checking a UUID, then what are you doing?']
    },
    attempts: {
        type: Number,
        validate: {
            validator: (v) => {
                return v < 5;
            },
            message: 'Sorry, friend, only 5 failed attempts allowed. Try again tomorrow.'
        }
    }
});

module.exports = mongoose.model('Auth', AuthSchema);