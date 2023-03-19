const mongoose = require('mongoose')
const PlaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: String,
  checkOut: String,
  maxGuests: Number,
  price: Number,
})
const PlaceModel = mongoose.model(' Place', PlaceSchema)
module.exports = PlaceModel
