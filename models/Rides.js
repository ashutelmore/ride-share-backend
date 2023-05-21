const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails',
        required: true,
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    }],
    pickupLocation: {
        type: String,
        default: ''
    },
    destination: {
        type: String,
        default: ''
    },
    isAvailableForBook: {
        type: Boolean,
        default: null
    },
    note: {
        type: String,
        default: ''
    },
    sits: {
        type: Number,
        default: ""
    },
    // distance: {
    //     type: Number,
    //     default: ''
    // },
    // duration: {//sec
    //     type: Number,
    //     default: ''
    // },
    price: {//sec
        type: Number,
        default: ''
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isAllow: {
        chat: {
            type: Boolean,
            default: null
        },
        smoke: {
            type: Boolean,
            default: null
        },
        music: {
            type: Boolean,
            default: null
        },
        food: {
            type: Boolean,
            default: null
        },
        ladies: {
            type: Boolean,
            default: null
        },
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

rideSchema.virtual('isActive').get(function () {
    const currentDate = new Date();
    return currentDate >= this.startDate && currentDate <= this.endDate;
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
