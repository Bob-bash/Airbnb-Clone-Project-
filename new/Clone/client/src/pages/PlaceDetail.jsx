import axios from 'axios'
import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { differenceInCalendarDays } from 'date-fns'
import './placedetail.css'
const Header = lazy(() => import('../components/Header'))
const Snackbar = lazy(() => import('@mui/material/Snackbar'))
const MotionDiv = lazy(() =>
  import('framer-motion').then((mod) => ({ default: mod.motion.div })),
)
function PlaceDetail() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  let days = 0
  if (checkIn && checkOut) {
    days = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }
  const { id } = useParams()
  const [ps, setPs] = useState(false)
  const [place, setPlace] = useState(null)
  const btnref = useRef()
  const [message, setMessage] = useState('')
  const [show, setShow] = useState(false)
  const [count, setCount] = useState(0)
  const person = [
    { name: 'name1', value: 1 },
    { name: 'name2', value: 2 },
    { name: 'name3', value: 3 },
    { name: 'name4', value: 4 },
    { name: 'name5', value: 5 },
    { name: 'name6', value: 6 },
    { name: 'name7', value: 7 },
  ]
  const [persons, setpersons] = useState(0)
  const [selectS, setSelectS] = useState(false)
  const [total, setTotal] = useState(0)
  const [redirect, setRedirect] = useState(false)
  const copyToClipboard = (text) => {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  function detectReload() {
    setpersons(0)
  }
  function detectScroll() {
    setSelectS(false)
  }
  function updatetotal() {
    setTotal(place?.price * persons * days + 2 * persons)
  }
  async function handleS(ev) {
    ev.preventDefault()
    if (checkIn && checkOut && persons >= 1) {
      const { data } = await axios.post('/booking', {
        checkIn,
        checkOut,
        persons,
        days,
        place: place._id,
        total,
      })
      setRedirect(true)
    } else {
      alert('Info should be complete!')
    }
  }

  useEffect(() => {
    axios.get(`/placeD/${id}`).then(({ data }) => {
      setPlace(data[0])
    })
    updatetotal()
    window.addEventListener('scroll', detectScroll)
    window.addEventListener('load', detectReload)
    return () => {
      window.removeEventListener('load', detectReload)
      window.addEventListener('scroll', detectScroll)
    }
  }, [updatetotal])
  if (ps) {
    return (
      <div className="ps__postion">
        <MotionDiv
          className="ps__pw"
          transition={{ duration: 0.6 }}
          initial={{ scale: 0.7 }}
          whileInView={{ scale: 1 }}
        >
          <div className="ps1">
            <div className="psw" style={{ left: `${-count * 80}vw` }}>
              {place.photos?.length > 0 &&
                place.photos?.map((photo) => (
                  <img src={photo} alt="" key={photo} className="ps__img" />
                ))}
            </div>
          </div>
          <button>
            <i
              class="ri-arrow-left-s-line ps__iconL ps__icon"
              style={{ display: count == 0 ? 'none' : 'grid' }}
              onClick={(ev) => {
                setCount((pre) => {
                  if (count <= 0) {
                    return 0
                  } else {
                    return pre - 1
                  }
                })
              }}
            ></i>
          </button>
          <button>
            <i
              class="ri-close-fill  ps__iconClose"
              onClick={(ev) => {
                setPs(false)
                setpersons(0)
              }}
            ></i>
          </button>
          <button>
            <i
              class="ri-arrow-right-s-line ps__iconR ps__icon"
              style={{ display: count == 4 ? 'none' : 'grid' }}
              onClick={(ev) => {
                setCount((pre) => {
                  if (count >= 4) {
                    return 4
                  } else {
                    return pre + 1
                  }
                })
              }}
            ></i>
          </button>
        </MotionDiv>
      </div>
    )
  }
  if (!place) {
    return ''
  }
  if (redirect) {
    return <Navigate to="/account/bookings" />
  }
  return (
    <div className="placeD">
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={show}
          sx={{ '& .MuiSnackbarContent-message': { fontWeight: 'bold' } }}
          onClose={(ev) => {
            setShow(false)
          }}
          message={message}
        />
        <Suspense
          fallback={<h5 className="home__section__lazy">Loading now!</h5>}
        >
          <Header />
        </Suspense>
      </Suspense>
      <div className="placeDw">
        <div className="placeDw__top">
          <div className="placeDw__top__l">
            <h3 className="placeDw__top__h3">{place?.title}</h3>
            <div className="placeDw__top__texts">
              <div className="placeDw__iconw">
                <i class="ri-timer-line"></i>
                Superhost
              </div>
              <span className="dot"></span>
              <a
                href={'https://google.com/maps/?q=' + place?.address}
                target="__blank"
                className=" placeDw__top__link"
              >
                <b>{place?.address}</b>
              </a>
            </div>
          </div>
          <div className="placeDw__top__r">
            <button
              className="placeDw__iconw"
              type="button"
              onClick={(ev) => {
                ev.preventDefault()
                copyToClipboard(btnref.current.dataset.link)
                setMessage(btnref.current.dataset.link)
                setShow(true)
              }}
            >
              <i class="ri-share-box-line placeDw__top__r__icon"></i>
              <span
                className="placeDw__top__link"
                ref={btnref}
                data-link={location.href}
              >
                Share
              </span>
            </button>
            <button className="placeDw__iconw">
              <i class="ri-heart-add-line placeDw__top__r__icon"></i>
              <span className="placeDw__top__link">Save</span>
            </button>
          </div>
        </div>
        <div className="placeDw__photosw">
          <div className="placeDw__photos">
            {place?.photos.length > 0 &&
              place?.photos
                .slice(0, 1)
                .map((photo) => (
                  <img
                    loading="lazy"
                    src={photo}
                    alt=""
                    className="placeDw__img1"
                    key={photo}
                  />
                ))}
            <div className="placeDw__photo__inw">
              {place?.photos.length > 0 &&
                place?.photos
                  .slice(1, 3)
                  .map((photo) => (
                    <img
                      loading="lazy"
                      src={photo}
                      alt=""
                      className="placeDw__img2"
                      key={photo}
                    />
                  ))}
            </div>
          </div>
          <button
            className="placeDw__showmore"
            onClick={(ev) => {
              setPs(true)
            }}
          >
            <i class="ri-grid-line"></i>
            <span>Show all photos</span>
          </button>
        </div>
        {/* start */}
        <div className="placeDw__m">
          <div className="placeDw__ml">
            <div className="placeDw__ml__texts">
              <p>{place?.description}</p>
              <span>{place?.extraInfo}</span>
            </div>
            <div className="placeDw__ml__imgw">
              <img src={place?.photos[3]} alt="" className="placeDw__ml__img" />
              <button
                onClick={(ev) => {
                  setPs(true)
                }}
              >
                Show all photos
              </button>
            </div>
          </div>
          {/* right  */}
          <form className="placeDw__mrW" onSubmit={handleS}>
            {selectS && (
              <MotionDiv
                className="seletesw"
                whileInView={{ x: '-20vw' }}
                initial={{ x: '-18vw' }}
              >
                {person.map((item) => (
                  <span
                    className="selects"
                    key={item.name}
                    onClick={(ev) => {
                      setSelectS(false)
                      setpersons(item.value)
                    }}
                  >
                    {item.value}
                  </span>
                ))}
              </MotionDiv>
            )}
            <div className="placeDw__mr">
              <h4 className="placeDw__mr__h4">{place?.price}$-per night</h4>
              <div className="placeDw__mr__datew">
                <div className="placeDw__mr__date1 placeDw__mr__date2">
                  <h5>CHECK-IN</h5>
                  <input
                    type="date"
                    required
                    onChange={(ev) => {
                      setCheckIn(ev.target.value)
                    }}
                  />
                </div>
                <div className="placeDw__mr__date1 placeDw__mr__date3">
                  <h5>CHECK-OUT</h5>
                  <input
                    type="date"
                    required
                    onChange={(ev) => {
                      setCheckOut(ev.target.value)
                    }}
                  />
                </div>
                <button
                  className="placeDw__mr__select"
                  onClick={(ev) => {
                    setSelectS(!selectS)
                  }}
                  type="button"
                >
                  <div className="placeDw__mr__selectL">
                    <h5>GUESTS</h5>
                    <span>
                      {persons}--{persons > 1 ? 'guests' : 'guest'}
                    </span>
                  </div>
                  <i class="ri-arrow-down-s-line placeDw__mr__selectR"></i>
                </button>
              </div>
              <button className="placeDw__mr__datew__btn" type="submit">
                Reserve
              </button>
              <span className="placeDw__mr__datew__span">
                You won't be charged yet
              </span>
              <div className="placeDw__mr__checkw">
                <div className="placeDw__mr__check">
                  <span className="placeDw__mr__check__span">
                    <span className="placeDw__top__link"> Price:</span>
                    {place?.price}$
                  </span>
                  <span className="placeDw__mr__check__span">
                    <span className="placeDw__top__link">Guest:</span>
                    {persons}
                  </span>
                  <span className="placeDw__mr__check__span">
                    <span className="placeDw__top__link">
                      Service per person:
                    </span>
                    2$
                  </span>
                </div>
                <h4 className="placeDw__mr__total">
                  <span>Total:</span>
                  {place?.price * persons * days + 2 * persons}$
                </h4>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetail
