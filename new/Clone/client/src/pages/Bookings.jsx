import React, { useEffect, useState, lazy, Suspense } from 'react'
import './bookings.css'
import axios from 'axios'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
function Bookings() {
  const [bookings, setBookings] = useState(null)
  useEffect(() => {
    axios.get('/bookings').then(({ data }) => {
      setBookings(data)
    })
  }, [])

  if (!bookings) {
    return ''
  }
  return (
    <div className="bookings">
      {bookings?.length <= 0 && (
        <b className="booing__no">Nothing to show bookings order!</b>
      )}
      {bookings?.length > 0 &&
        bookings?.map((booking) => (
          <Link to="" className="booking" key={booking._id}>
            <Tooltip title="Delete" placement="top">
              <button
                className="booking__icon2"
                type="button"
                onClick={async (ev) => {
                  const { data } = await axios.post(`/bookings/${booking._id}`)
                  location.reload()
                }}
              >
                <i class="ri-close-line booking__icon "></i>
              </button>
            </Tooltip>
            <div className="booking__imgw">
              <img
                loading="lazy"
                src={booking.place.photos[0]}
                alt=""
                className="booking__img"
              />
            </div>
            <div className="bookingr">
              <h3>{booking.place.title}</h3>
              <div className="bookingr__m__days">
                <span className="bookingr__m__daysw">
                  <span className="bookingr__m__daysw">
                    <i class="ri-lightbulb-flash-line booking__icon"></i>
                    {booking.days}
                    {booking.days > 1 ? 'nights' : 'night'}
                  </span>
                  <span className="bookingr__m__daysw">
                    <i class="ri-user-search-line booking__icon"></i>
                    <span>
                      {booking.guests}
                      {booking.guests > 1 ? 'guests' : 'guest'}
                    </span>
                  </span>
                  <span className="bookingr__m__daysw">
                    <i class="ri-customer-service-2-line booking__icon"></i>
                    2$ of service for per person
                  </span>
                  <span className="bookingr__m__daysw">
                    <i class="ri-money-dollar-circle-line booking__icon"></i>
                    {booking.place.price} for per room
                  </span>
                </span>
              </div>
              <div className="bookingr__m">
                <div className="bookingr__m__datew">
                  <div className="bookingr__m__date">
                    {format(new Date(booking.checkIn), 'yyyy-MM-dd')}
                    <i class="ri-calendar-check-line booing__icon1"></i>
                  </div>
                  <i class="ri-arrow-right-s-line booking__icon"></i>
                  <div className="bookingr__m__date">
                    {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                    <i class="ri-calendar-check-line booing__icon1"></i>
                  </div>
                </div>
              </div>
              <div className="bookingr__b">
                <div>
                  <i class="ri-wallet-line booing__icon1"></i>
                  Total:
                </div>
                <h3>{booking.total}$</h3>
              </div>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default Bookings
