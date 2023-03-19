const mongoose = require('mongoose')
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: ' Place' },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  days: Number,
  total: Number,
})
const BookingModel = mongoose.model('Booking', BookingSchema)
module.exports = BookingModel
