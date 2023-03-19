import axios from 'axios'
import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
const Header = lazy(() => import('../components/Header'))
import './place.css'
function Place() {
  const perks1 = [
    { name: 'wifi', icon: <i class="ri-wifi-line"></i>, text: 'Wifi' },
    {
      name: 'free',
      icon: <i class="ri-truck-line"></i>,
      text: 'Free parking spot',
    },
    { name: 'tv', icon: <i class="ri-tv-2-line"></i>, text: 'TV' },
    { name: 'radio', icon: <i class="ri-radio-line"></i>, text: 'Radio' },
    { name: 'pets', icon: <i class="ri-thumb-up-line"></i>, text: 'Pets' },
    {
      name: 'leave',
      icon: <i class="ri-picture-in-picture-exit-line"></i>,
      text: 'Leave',
    },
  ]
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [photoLink, setPhotoLink] = useState('')
  const [addedLinks, setAddedLinks] = useState([])
  const [description, setDescription] = useState('')
  const [perks, setPerks] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [info, setInfo] = useState('')
  const [guests, setGuests] = useState(2)
  const [price, setPrice] = useState(0)

  const [place, setPlace] = useState(null)
  const { id } = useParams()
  useEffect(() => {
    if (id) {
      axios.get(`/place/:${id}`).then(({ data }) => {
        setPlace(data[0])
        setTitle(data[0].title)
        setAddress(data[0].address)
        setAddedLinks(data[0].photos)
        setDescription(data[0].description)
        setPerks(data[0].perks)
        setCheckIn(data[0].checkIn)
        setCheckOut(data[0].checkOut)
        setPrice(data[0].price)
        setGuests(data[0].maxGuests)
        setInfo(data[0].extraInfo)
      })
    }
  }, [])
  async function addByLink(ev) {
    ev.preventDefault()
    if (photoLink) {
      const { data } = await axios.post('/upload-by-link', { photoLink })
      const newLink = 'http://127.0.0.1:3001/uploads/' + data
      setAddedLinks((pre) => [...pre, newLink])
    }
    setPhotoLink('')
  }
  async function upload(ev) {
    ev.preventDefault()
    const files = ev.target.files
    const formdata = new FormData()
    for (let i = 0; i < files.length; i++) {
      formdata.append('file', files[i])
    }
    const { data } = await axios.post('/upload', formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    let arr = []
    for (let item of data) {
      let newname = `http://127.0.0.1:3001/${item}`
      arr.push(newname)
    }
    setAddedLinks((pre) => [...pre, ...arr])
  }
  function handlePerks(ev) {
    if (ev.target.checked) {
      setPerks((pre) => [...pre, ev.target.name])
    }
    if (ev.target.checked == false) {
      setPerks((pre) => [...pre.filter((item) => item != ev.target.name)])
    }
  }
  async function addPlace(ev) {
    ev.preventDefault()
    const data1 = {
      title,
      address,
      addedLinks,
      description,
      price,
      perks,
      checkIn,
      checkOut,
      info,
      guests,
    }
    if (id) {
      const { data } = await axios.put(`/place/:${id}`, data1)
      if (addedLinks.length <= 5) {
        setRedirect(true)
      } else {
        alert('Uploads must be <=5')
      }
    } else {
      const { data } = await axios.post('/place', data1)
      setRedirect(true)
    }
  }
  if (redirect) {
    return <Navigate to="/account/accomodations" />
  }
  return (
    <div className="placew">
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Header />
      </Suspense>
      <form className="place" onSubmit={addPlace}>
        <div className="place__t">
          <h3>Title</h3>
          <p>
            Title for you place.should be short and catchy as in advertisemennt.
          </p>
          <input
            type="text"
            value={title}
            onChange={(ev) => {
              setTitle(ev.target.value)
            }}
            placeholder="title,for example:My lovelyy apt"
            className="place__t__in place__in__com"
          />
        </div>
        <div className="place__a">
          <h3>Address</h3>
          <p>Address to this place</p>
          <input
            type="text"
            value={address}
            onChange={(ev) => {
              setAddress(ev.target.value)
            }}
            placeholder="address"
            className="place__in__com place__t__in"
          />
        </div>
        <div className="place__p">
          <h3>Photos</h3>
          <p>more=better</p>
          <div className="place__pw">
            <input
              value={photoLink}
              onChange={(ev) => {
                setPhotoLink(ev.target.value)
              }}
              type="text"
              placeholder="Add using a link ...jpg"
              className="place__in__com place__pw__in"
            />
            <button className="place__pw__btn" onClick={addByLink}>
              Add photo
            </button>
          </div>
          <div className="place__p__btns">
            {addedLinks.length > 0 &&
              addedLinks.map((link) => (
                <div className="place__imgw" key={link}>
                  <img src={link} alt="" className="place__img" />
                  <i
                    class="ri-delete-bin-2-line place__icon1 place__icon "
                    onClick={(ev) => {
                      setAddedLinks((pre) => [
                        ...pre.filter((item) => item != link),
                      ])
                      alert('Deleted!')
                    }}
                  ></i>
                  <i
                    class="ri-star-line place__icon place__icon2"
                    onClick={(ev) => {
                      setAddedLinks((pre) => [
                        link,
                        ...pre.filter((item) => item != link),
                      ])
                      alert('Position will change!')
                    }}
                  ></i>
                </div>
              ))}

            <label htmlFor="id" className="place__p__label">
              <input
                type="file"
                multiple
                id="id"
                style={{ display: 'none' }}
                onChange={upload}
              />
              <div className="place__upw">
                <i class="ri-upload-cloud-line"></i>
                <h4>Upload</h4>
              </div>
            </label>
          </div>
        </div>
        <div className="place__de">
          <h3>Description</h3>
          <p>description of the place</p>
          <textarea
            value={description}
            onChange={(ev) => {
              setDescription(ev.target.value)
            }}
            cols="30"
            rows="5"
            placeholder="Description"
            className="place__in__com place__de__in"
          ></textarea>
        </div>
        <div className="place__ps">
          <h3>Perks</h3>
          <p>select all the perks of your place</p>
          <div className="place__perks">
            {perks1.map((perk) => (
              <label
                className="place__perk "
                htmlFor={perk.name}
                key={`1${perk.name}`}
              >
                <input
                  type="checkbox"
                  key={perk.name}
                  id={perk.name}
                  checked={perks.includes(perk.name)}
                  name={perk.name}
                  onChange={handlePerks}
                />
                {perk.icon}
                {perk.text}
              </label>
            ))}
          </div>
        </div>
        <div className="place__extro">
          <h3>Extro info</h3>
          <p>house rules.etc</p>
          <textarea
            name=""
            id=""
            cols="30"
            value={info}
            onChange={(ev) => {
              setInfo(ev.target.value)
            }}
            rows="6"
            className="place__in__com place__de__in"
          ></textarea>
        </div>
        <div className="place__ch">
          <h3>Check in & out times</h3>
          <p>
            add check in and out times,remember to have some time window for
            cleaning the room between guests and max.
          </p>
          <div className="place__ch__ins">
            <div className="places__ch__inw">
              <span>Check in time</span>
              <input
                type="text"
                placeholder="14:00"
                className="place__in__com"
                value={checkIn}
                onChange={(ev) => {
                  setCheckIn(ev.target.value)
                }}
              />
            </div>
            <div className="places__ch__inw">
              <span>Check out time</span>
              <input
                type="text"
                placeholder="20:00"
                className="place__in__com"
                value={checkOut}
                onChange={(ev) => {
                  setCheckOut(ev.target.value)
                }}
              />
            </div>
            <div className="places__ch__inw">
              <span>Max guestes</span>
              <input
                max={10}
                type="number"
                placeholder="2"
                className="place__in__com"
                value={guests}
                onChange={(ev) => {
                  setGuests(ev.target.value)
                }}
              />
            </div>
            <div className="places__ch__inw">
              <span>Price</span>
              <input
                max={500}
                type="number"
                placeholder="100"
                className="place__in__com"
                value={price}
                onChange={(ev) => {
                  setPrice(ev.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <button className="place__btn" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}

export default Place
