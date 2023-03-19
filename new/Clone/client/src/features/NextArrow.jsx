import React, { useRef } from 'react'
import './next.css'
function NextArrow({ onClick, currentSlide }) {
  const arrowRef = useRef()
  return (
    <i
      class="ri-arrow-right-s-line next__icon"
      style={{ display: currentSlide >= 4 ? 'none' : 'grid' }}
      ref={arrowRef}
      onClick={onClick}
    ></i>
  )
}

export default NextArrow
