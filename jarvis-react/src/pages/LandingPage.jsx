import React from 'react'
import { motion } from 'framer-motion'
import './LandingPage.css'

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">
      <div className="landing-bg"></div>
      
      <div className="landing-content">
        {/* Lottie Animation Container */}
        <div className="lottie-wrapper">
          <lottie-player
            src="/r2a.lottie"
            background="transparent"
            speed="1"
            autoplay
            loop
          ></lottie-player>
        </div>

        {/* JARVIS Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="jarvis-title"
        >
          JARVIS 2.0
        </motion.h1>

        {/* Planets */}
        {/* Large Planet Left */}
        <motion.div
          className="floating-planet planet-position-left"
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="planet-large">
            <div className="planet-gradient"></div>
            <div className="planet-shine"></div>
          </div>
          {/* Floating stones around large planet */}
          <motion.div
            className="floating-stone stone-1"
            animate={{ y: [0, -30, 0], x: [0, 25, 0], rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div
            className="floating-stone stone-2"
            animate={{ y: [0, -35, 0], x: [-25, 0, -25], rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div
            className="floating-stone stone-3"
            animate={{ y: [0, -25, 0], x: [20, -20, 20], rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div
            className="floating-stone stone-4"
            animate={{ y: [0, -28, 0], x: [-20, 15, -20], rotate: -360 }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
        </motion.div>

        {/* Medium Planet Right Top */}
        <motion.div
          className="floating-planet planet-position-right-top"
          animate={{ y: [0, -25, 0], x: [-20, 0, -20] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="planet-medium">
            <div className="planet-gradient"></div>
            <div className="planet-ring"></div>
            <div className="planet-shine"></div>
          </div>
        </motion.div>

        {/* Small Planet Right Bottom */}
        <motion.div
          className="floating-planet planet-position-right-bottom"
          animate={{ y: [0, -15, 0], x: [20, 0, 20] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="planet-small">
            <div className="planet-gradient"></div>
            <div className="planet-shine"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
