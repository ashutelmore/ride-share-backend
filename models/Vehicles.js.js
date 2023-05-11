
const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleSchema = new Schema({

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    vehicleName: {
        type: String,
        trim: true,
        default: ""
    },
    type: {
        type: String,
        trim: true,
        default: ""
    },
    company: {
        type: String,
        trim: true,
        default: ""
    },
    sits: {
        type: Number,
        default: ""
    },
    pricePerKm: {//per km
        type: Number,
        default: ""
    },
    vehicleNumber: {
        type: Number,
        default: ""
    },
    descp: {
        type: Number,
        default: ""
    },
    polices: {
        isLicense: {
            type: Boolean,
            default: null
        },
        isInsurance: {
            type: Boolean,
            default: null
        }
    },
    image: {
        data: {
            type: Buffer,
            default: []
        },
        contentType: {
            type: String,
            default: ''
        },
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Vehicle', vehicleSchema);
