const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pickupLocation: {
        type: String,
        required: true,
        default: ''
    },
    destination: {
        type: String,
        required: true,
        default: ''
    },
    distance: {
        type: Number,
        required: true,
        default: ''
    },
    duration: {//sec
        type: Number,
        required: true,
        default: ''
    },
    pricePerKM: {//sec
        type: Number,
        required: true,
        default: ''
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled', 'in progress', 'pending', 'approved'],
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
