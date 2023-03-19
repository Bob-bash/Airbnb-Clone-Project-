import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3001'
axios.defaults.withCredentials = true
function App() {
  const Home = lazy(() => import('./pages/Home'))
  const Login = lazy(() => import('./pages/Login'))
  const Register = lazy(() => import('./pages/Register'))
  const Account = lazy(() => import('./pages/Account'))
  const Place = lazy(() => import('./pages/Place'))
  const PlaceDetail = lazy(() => import('./pages/PlaceDetail'))
  return (
    <div className="app">
      <Suspense
        fallback={
          <h3 className="eachpage__loading">
            Loading now;Please waite for a while!
          </h3>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:subpage?" element={<Account />} />
          <Route path="/account/accomodations/new" element={<Place />} />
          <Route path="/account/accomodations/:id" element={<Place />} />
          <Route path="/place-detail/:id" element={<PlaceDetail />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
