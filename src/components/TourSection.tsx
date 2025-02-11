'use client'

import { useEffect, useState } from 'react'
import styles from '@/styles/components/TourSection.module.css'

interface TourSectionProps {
  onComplete: () => void
}

export default function TourSection({ onComplete }: TourSectionProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptText, setPromptText] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const text = 'Keep scrolling to explore!'
      let i = 0
      const typePrompt = setInterval(() => {
        if (i < text.length) {
          setPromptText(prev => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typePrompt)
        }
      }, 100)
      setShowPrompt(true)
    }, 2000)
  }, [])

  return (
    <div className={styles.tourContainer}>
      <section className={`${styles.tourSection} ${styles.aboutTour}`}>
        <div className={styles.tourContent}>
          <p className={styles.aboutText}>
            Hey, I'm Keane Lee-Shanok—though ever since I was ten years old, I've been known online as HamC.
            I'm a programmer at heart, but under this alias, I've also explored my passion for content creation
            in photo editing, 3D rendering, and video editing. These creative outlets have shaped me into the
            programmer I am today, and I'm excited for you to see what I've built.
          </p>
          {showPrompt && <p className={styles.scrollPrompt}>{promptText}</p>}
        </div>
      </section>

      <section className={styles.tourSection}>
        <div className={styles.tourContent}>
          <h3>The Beginning - 2015</h3>
          <div className={styles.tourMedia}>
            <div className={styles.placeholderImg}></div>
          </div>
          <p>Your journey text here...</p>
        </div>
      </section>

      <section className={`${styles.tourSection} ${styles.tourEnd}`}>
        <div className={styles.tourContent}>
          <h3>Welcome to My Portfolio</h3>
          <p>Now that you know my story, explore my work...</p>
          <button className={styles.enterPortfolio} onClick={onComplete}>
            Enter Portfolio
          </button>
        </div>
      </section>
    </div>
  )
} 