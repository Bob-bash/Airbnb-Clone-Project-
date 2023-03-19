import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './placeview.css'
function PlaceView() {
  const [place, setPlace] = useState(null)
  const { id } = useParams()
  useEffect(() => {
    axios.get(`/place/:${id}`).then(({ data }) => {
      setPlace(data[0])
    })
  }, [])
  return <div></div>
}

export default PlaceView
