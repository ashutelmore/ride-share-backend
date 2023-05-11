
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: String,
        enum: ['passanger', 'driver', 'admin', 'common'],
        default: 'common'
    },
    name: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        default: ""

    },
    address: {
        streetAdd: {
            type: String,
            unique: true,
            default: ""
        },
        city: {
            type: String,
            unique: true,
            default: ""
        },
        state: {
            type: String,
            unique: true,
            default: ""
        },
        pin: {
            type: String,
            unique: true,
            default: ""
        },
    },
    password: {
        type: String,
        trim: true,
        default: ""
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'not-disclose'],
    },
    DOB: {
        type: String,
        default: ""
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: Number,
        default: ""
    },
    rating: {
        type: String,
        enum: ['1', '2', '3', '4', '5'],
    },

}, {
    timestamps: true
});



module.exports = mongoose.model('UserDetails', userSchema);
