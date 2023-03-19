import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './header.css'
import { UserContext } from '../features/userContext'
function Header() {
  const links = ['Anywhere', 'Any week', 'Add guests']
  const [selected, setSelected] = useState('Anywhere')
  const { user } = useContext(UserContext)
  return (
    <div className="header">
      <Link to="/" className="header__logo">
        <i class="ri-send-plane-2-line"></i>
      </Link>
      <div className="header__mw header__shadow">
        <div className="header__ml">
          {links.map((link) => (
            <span
              key={link}
              className="header__link"
              style={{
                opacity: selected == link ? 0.6 : 1,
              }}
              onClick={(ev) => {
                setSelected(link)
              }}
            >
              {link}
            </span>
          ))}
        </div>
        <div className="header__mr">
          <i class="ri-search-2-line header__search"></i>
        </div>
      </div>
      <Link to="/login" className="header__r header__shadow">
        <i class="ri-menu-fill header__icon"></i>
        {user && <span>{user.name}</span>}
        <div className="header__r__iconw">
          <i class="ri-user-settings-line header__icon header__icon1"></i>
        </div>
      </Link>
    </div>
  )
}

export default Header
