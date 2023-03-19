import axios from 'axios'
import React, { useState, useContext, Suspense, lazy } from 'react'
import { Link, Navigate } from 'react-router-dom'
const Header = lazy(() => import('../components/Header'))
import { UserContext } from '../features/userContext'
import './login.css'
function Login() {
  const { user } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const { setUser } = useContext(UserContext)
  const [redirect, setRedirect] = useState(false)
  const [password, setPassword] = useState('')
  async function login(ev) {
    ev.preventDefault()
    try {
      const { data } = await axios.post(
        '/login',
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      setUser(data)
      alert('Login')
      setRedirect(true)
    } catch (e) {
      alert('Not Login')
    }
  }
  if (redirect) {
    return <Navigate to="/" />
  }
  if (user) {
    return <Navigate to="/account" />
  }
  return (
    <div className="login">
      <Suspense
        fallback={<h5 className="home__section__lazy">Loading now!</h5>}
      >
        <Header />
      </Suspense>
      <form className="login__form" onSubmit={login}>
        <h1>Login</h1>
        <div className="login__ins">
          <input
            autoComplete="on"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value)
            }}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value)
            }}
          />
        </div>
        <button className="login__btn" type="submit">
          Login
        </button>
        <div className="login__texts">
          <p>
            Don't have an account yet?
            <Link to="/register" className="login__span">
              Register now
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
