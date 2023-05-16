const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  passangerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
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
  isPrivateBooking: {
    type: Boolean,
    default: null
  },
  // distance: {
  //   type: Number,
  //   default: 0
  // },
  // duration: {
  //   type: Number,
  //   required: true,
  //   default: 0
  // },
  numSits: {
    type: Number,
  },
  pickupDate: {
    type: Date,
  },
  pickupTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: 'something'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
/*
accepted 
*/