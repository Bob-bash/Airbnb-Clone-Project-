import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { UserContextProvider } from './features/userContext'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserContextProvider>
  </BrowserRouter>,
)
