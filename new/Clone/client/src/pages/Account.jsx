import axios from 'axios'
import React, { useContext, useState, Suspense, lazy } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
const Header = lazy(() => import('../components/Header'))
const Accomodations = lazy(() => import('./Accomodations'))
const Bookings = lazy(() => import('./Bookings'))
import { UserContext } from '../features/userContext'
import './account.css'
function Account() {
  const { user, ready, setUser } = useContext(UserContext)
  const [redirect, setRedirect] = useState(false)
  const [selected, setSelected] = useState('profile')
  const { subpage } = useParams()
  const location = useLocation()
  const links = [
    {
      link: 'profile',
      icon: <i class="ri-user-4-line"></i>,
      name: 'My profile',
    },
    {
      link: 'bookings',
      icon: <i class="ri-menu-line"></i>,
      name: 'My bookings',
    },
    {
      link: 'accomodations',
      icon: <i class="ri-home-line"></i>,
      name: 'My accomodationns',
    },
  ]
  async function logout(ev) {
    await axios.post('/logout')
    setRedirect(true)
    setUser(null)
  }
  if (redirect && !user) {
    return <Navigate to="/" />
  }
  if (!ready) {
    return <span> Loading now!</span>
  }
  if (subpage == undefined) {
    return <Navigate to="/account/profile" />
  }
  // if (location.pathname.split('/')[2] === 'accomodations') {
  //   return <Navigate to="/account/accomodations" />
  // }

  return (
    <div className="accountw">
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Header />
      </Suspense>
      <div className="account__links">
        {links.map((link) => (
          <Link
            to={`/account/${link.link}`}
            key={link.link}
            className={`accounnt__link ${
              location.pathname.split('/')[2] == link.link
                ? 'accounnt__link__active'
                : ''
            }`}
          >
            {link.name}
            {link.icon}
          </Link>
        ))}
      </div>
      {subpage == 'profile' && (
        <div className="profilew">
          <span>
            Logged in as
            <b> {user.name} </b>({user.email})
          </span>
          <button className="profile__btn" onClick={logout}>
            Log out
          </button>
        </div>
      )}
      {subpage == 'accomodations' && (
        <Suspense
          fallback={<h5 className="home__section__lazy">Loading now!</h5>}
        >
          <Accomodations />
        </Suspense>
      )}
      {subpage == 'bookings' && (
        <Suspense
          fallback={<h5 className="home__section__lazy">Loading now!</h5>}
        >
          <Bookings />
        </Suspense>
      )}
    </div>
  )
}

export default Account
