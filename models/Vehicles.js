
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Rides = require('./Rides');

const vehicleSchema = new Schema({

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    isAvailableForBook: {
        type: Boolean,
        default: null
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
    sits: {
        type: Number,
        default: ""
    },
    pricePerKm: {//per km
        type: Number,
        default: ""
    },
    vehicleNumber: {
        type: String,
        default: ""
    },
    descp: {
        type: String,
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


vehicleSchema.pre('deleteOne', async function (next) {

    const vehicleId = this.getQuery()["_id"];

    console.log('vehicleId', vehicleId)
    try {
        await mongoose.model('Ride').deleteMany({ vehicleId: vehicleId })
    } catch (error) {
        console.log('error pre vehicle', error)
    }
    next()
})

module.exports = mongoose.model('Vehicle', vehicleSchema);
