import React, { useState, useContext, Suspense, lazy } from 'react'
import { Link, Navigate } from 'react-router-dom'
const Header = lazy(() => import('../components/Header'))
import axios from 'axios'
import { UserContext } from '../features/userContext'
function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)

  const { user } = useContext(UserContext)
  async function register(ev) {
    ev.preventDefault()
    try {
      await axios.post('/register', { name, email, password })
      alert('Registered!')
      setRedirect(true)
    } catch (e) {
      alert('Not registered!')
    }
  }
  if (user) {
    return <Navigate to="/" />
  }
  if (redirect) {
    return <Navigate to="/login" />
  }

  return (
    <div className="login">
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Header />
      </Suspense>
      <form className="login__form register__form" onSubmit={register}>
        <h1>Register</h1>
        <div className="login__ins">
          <input
            type="text"
            value={name}
            onChange={(ev) => {
              setName(ev.target.value)
            }}
            placeholder="Enter name"
          />
          <input
            type="email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value)
            }}
            placeholder="Enter email"
          />
          <input
            type="password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value)
            }}
            placeholder="Enter password"
          />
        </div>
        <button className="login__btn" type="submit">
          Register
        </button>
        <div className="login__texts">
          <p>
            Already be a member?
            <Link to="/login" className="login__span">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
