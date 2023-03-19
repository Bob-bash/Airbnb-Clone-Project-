import React from 'react'
import './pop.css'
import { motion } from 'framer-motion'
import popImage from '../assets/learnMore.webp'
function Pop({ show, setShow }) {
  return (
    <div>
      {show && (
        <div className="home__popw">
          <motion.div
            className="home__pop"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="home__pop__t">
              <i
                class="ri-close-line"
                onClick={(ev) => {
                  setShow(false)
                }}
              ></i>
              <img src={popImage} alt="" className="home__pop__img" />
            </div>
            <motion.div
              className="home__pop__texts"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileInView={{ opacity: 1 }}
            >
              <span className="home__pop__span1">EARLY ACCESS</span>
              <div className="home__pop__text">
                <h1>
                  One total
                  <br />
                  price,up front
                </h1>
                <p>
                  You can now see the total price up front,
                  <br />
                  including all fees,before taxes.
                </p>
              </div>
              <motion.div
                className="home__pop__b"
                initial={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileInView={{ opacity: 1 }}
              >
                <button className="home__pop__btn">Try now</button>
                <span
                  className="home__pop__span"
                  onClick={(ev) => {
                    setShow(false)
                  }}
                >
                  Maybe later
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Pop
