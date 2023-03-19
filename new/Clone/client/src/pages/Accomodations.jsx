import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './accomodations.css'
function Accomodations() {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get('/places').then(({ data }) => {
      setPlaces(data)
    })
  }, [])
  return (
    <div className="accomo">
      <Link to="/account/accomodations/new" className="accomodations">
        <i class="ri-add-line"></i>
        <span>Add new place</span>
      </Link>
      <div className="accomow">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              className="accomo__item"
              key={place._id}
              to={`/account/accomodations/${place._id}`}
            >
              <i
                class="ri-close-line accomo__icon"
                onClick={(ev) => {
                  ev.preventDefault()
                  axios.post('/item-delete', { id: place._id })
                  location.reload()
                }}
              ></i>
              <img
                src={place.photos[0]}
                alt=""
                className="accomo__img"
                loading="lazy"
              />
              <div className="accomo__texts">
                <h2 className="accomo__h2">{place.title}</h2>
                <p>{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Accomodations
