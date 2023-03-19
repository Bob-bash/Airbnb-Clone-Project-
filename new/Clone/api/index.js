const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const load = require('image-downloader')
const bcyptjs = require('bcryptjs')
const User = require('./models/User.js')
const Place = require('./models/Place')
const Booking = require('./models/Booking')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { json } = require('express')
const multer = require('multer')
const fs = require('fs')
require('dotenv').config()
app.use(express.json())
require('dotenv').config()
app.use(cookieParser())
const secret = bcyptjs.genSaltSync(10)
const jwtSecret = 'disadoasdska231io'
app.use('/uploads', express.static(__dirname + '/uploads'))
// cors
app.use(
  cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
    // origin: '*',
  }),
)
// connection
mongoose.connect(process.env.MONGO_URL)

// testing
app.get('/test', (req, res) => {
  res.json('Ok!')
})
// register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcyptjs.hashSync(password, secret),
    })
    res.json(userDoc)
  } catch (e) {
    res.status(422).json(e)
  }
})
// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcyptjs.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (error, token) => {
          if (error) throw error
          res.cookie('token', token).json(userDoc)
        },
      )
    } else {
      res.status(400).json('Not passOk!')
    }
  } else {
    res.status(522).json('Not founded!')
  }
})
//profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      if (err) throw err
      const { name, email, _id } = await User.findById(tokenD.id)
      res.json({ name, email, _id })
    })
  }
})
//log out
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})
//down-by-link
app.post('/upload-by-link', async (req, res) => {
  const { photoLink } = req.body
  const newName = 'photo' + Date.now() + '.jpg'
  await load.image({
    url: photoLink,
    dest: __dirname + '/uploads/' + newName,
  })
  res.json(newName)
})
//upload
const photoMidware = multer({ dest: 'uploads/' })
app.post('/upload', photoMidware.array('file', 50), (req, res) => {
  let arr = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]
    const parts = originalname.split('.')
    const lastpart = parts[parts.length - 1]
    const newName = path + '.' + lastpart
    fs.renameSync(path, newName)
    arr.push(newName)
  }
  res.json(arr)
})
//place
app.post('/place', (req, res) => {
  const {
    title,
    address,
    addedLinks,
    price,
    description,
    perks,
    checkIn,
    checkOut,
    info,
    guests,
  } = req.body
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      if (err) throw err
      const placeDoc = await Place.create({
        userId: tokenD.id,
        title,
        price,
        address,
        photos: addedLinks,
        description,
        perks,
        checkIn,
        checkOut,
        extraInfo: info,
        maxGuests: guests,
      })
      res.json(placeDoc)
    })
  }
})
//places
app.get('/places', async (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      if (err) throw err
      const placeDoc = await Place.find({ userId: tokenD.id })
      res.json(placeDoc)
    })
  }
})
//place
app.get('/place/:id', (req, res) => {
  const { id } = req.params
  const { token } = req.cookies
  const newid = id.toString().split(':')[1]
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      if (err) throw err
      const placeDoc = await Place.find({ _id: newid })
      res.json(placeDoc)
    })
  }
})
//place put
app.put('/place/:id', async (req, res) => {
  const { id } = req.params
  const {
    title,
    address,
    addedLinks,
    price,
    description,
    perks,
    checkIn,
    checkOut,
    info,
    guests,
  } = req.body
  const { token } = req.cookies
  const newid = id.toString().split(':')[1]
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      const placeDoc = await Place.findById(newid)
      if (err) throw err
      if (placeDoc.userId == tokenD.id) {
        await placeDoc.set({
          title,
          price,
          address,
          photos: addedLinks,
          description,
          perks,
          checkIn,
          checkOut,
          extraInfo: info,
          maxGuests: guests,
        })
        await placeDoc.save()
        res.json('ok!')
      }
    })
  }
})
// delete
app.post('/item-delete', async (req, res) => {
  const { id } = req.body
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
      if (err) throw err
      await Place.deleteOne({ _id: id })
      res.json('ok')
    })
  }
})
//get all data from database
app.get('/index-places', async (req, res) => {
  res.json(await Place.find())
})
//placeDetail to view
app.get('/placeD/:id', async (req, res) => {
  const { id } = req.params
  const placeDoc = await Place.find({ _id: id })
  res.json(placeDoc)
})
//booking post
app.post('/booking', (req, res) => {
  const { token } = req.cookies
  const { checkIn, checkOut, persons, total, days, place } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, tokenData) => {
    if (err) throw err
    const bookingDoc = await Booking.create({
      userId: tokenData.id,
      checkIn,
      checkOut,
      place,
      days,
      guests: persons,
      total,
    })
    res.json(bookingDoc)
  })
})
// booking get
app.get('/bookings', (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
    if (err) throw err
    const bookingDoc = await Booking.find({ userId: tokenD.id }).populate(
      'place',
    )
    res.json(bookingDoc)
  })
})
// booings post
app.post('/bookings/:id', (req, res) => {
  const { id } = req.params
  const { token } = req.cookies
  jwt.verify(token, jwtSecret, {}, async (err, tokenD) => {
    if (err) throw err
    const bookingDoc = await Booking.deleteOne({ _id: id })
    res.json(bookingDoc)
  })
})
app.listen(3001)
