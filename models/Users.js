
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
        default: ""

    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    address: {
        streetAdd: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pin: {
            type: String,
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

userSchema.pre('deleteOne', async function (next) {
    console.log("deleteOne from user pre")
    const id = this.getQuery()["_id"];

    console.log('id', id)
    try {
        await mongoose.model('Vehicle').deleteMany({ driverId: id })
        await mongoose.model('Ride').deleteMany({ driverId: id })
        await mongoose.model('Booking').deleteMany({ passangerId: id })
    } catch (error) {
        console.log('error pre vehicle', error)
    }
    next()
})



module.exports = mongoose.model('UserDetails', userSchema);
