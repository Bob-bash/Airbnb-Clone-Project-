import React, { useState, useRef, useEffect, Suspense, lazy } from 'react'
import './home.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
const Slider = lazy(() => import('react-slick'))
const Header = lazy(() => import('../components/Header'))
const Pop = lazy(() => import('../components/Pop'))
const PreArrow = lazy(() => import('../features/PreArrow'))
const NextArrow = lazy(() => import('../features/NextArrow'))
function Home() {
  const [show, setShow] = useState(false)
  const btnRef = useRef()
  const [places, setPlaces] = useState([])
  //LearnMore poping effect
  useEffect(() => {
    const timer = setTimeout(() => {
      btnRef.current.classList.remove('pop')
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [show])
  useEffect(() => {
    axios.get('/index-places').then(({ data }) => {
      setPlaces(data)
    })
  }, [])
  const settings = {
    prevArrow: <PreArrow />,
    nextArrow: <NextArrow />,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <div className="home">
      {/* Poppage */}
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Pop show={show} setShow={setShow} />
      </Suspense>
      {/* learnMore */}
      <div className="home__showmore">
        Show total prices up front
        <span
          ref={btnRef}
          onClick={(ev) => {
            setShow(true)
            btnRef.current.classList.add('pop')
          }}
        >
          Learn more
        </span>
      </div>
      {/* HeaderPagge */}
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Header />
      </Suspense>
      {/* home sections  */}
      <div className="home__sections">
        {places.length > 0 &&
          places.map((place) => (
            <Suspense
              fallback={<h5 className="home__section__lazy">Loading now!</h5>}
              key={place.title}
            >
              <Link className="home__section" to={`/place-detail/${place._id}`}>
                <div className="home__section__imgw">
                  <Slider {...settings}>
                    {place.photos.length > 0 &&
                      place.photos.map((photo) => (
                        <img
                          loading="lazy"
                          fetchpriority="high"
                          src={photo}
                          alt=""
                          className="home__section__img"
                          key={photo}
                        />
                      ))}
                  </Slider>
                  <i class="ri-heart-3-line home__section__icon home__icon__com"></i>
                </div>
                <div className="home__section__texts">
                  <b className="home__section__b">{place.address}</b>
                  <p className="home__section__p">{place.description}</p>
                  <div className="home__section__text">
                    <span>{place.checkIn}</span>
                    <span>-</span>
                    <span>{place.checkOut}</span>
                  </div>
                </div>
              </Link>
            </Suspense>
          ))}
      </div>
    </div>
  )
}

export default Home
