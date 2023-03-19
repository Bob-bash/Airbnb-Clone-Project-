import React from 'react'
import './pre.css'
function PreArrow({ onClick, currentSlide }) {
  return (
    <i
      class="ri-arrow-left-s-line pre__icon"
      style={{ display: currentSlide <= 0 ? 'none' : 'grid' }}
      onClick={onClick}
    ></i>
  )
}

export default PreArrow
