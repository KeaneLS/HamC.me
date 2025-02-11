'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/components/IntroSection.module.css'

interface IntroSectionProps {
  onComplete: () => void
}

export default function IntroSection({ onComplete }: IntroSectionProps) {
  const [typedText, setTypedText] = useState('')
  const fullText = "See What I'm About"

  useEffect(() => {
    let i = 0
    setTimeout(() => {
      const typeWriter = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(prev => prev + fullText.charAt(i))
          i++
        } else {
          clearInterval(typeWriter)
          setTimeout(onComplete, 1500)
        }
      }, 120)
    }, 2000)
  }, [onComplete])

  return (
    <div className={styles.introContainer}>
      <div className={styles.introLogo}>
        <Image src="/HamClogo.png" alt="Logo" width={800} height={200} />
      </div>
      <div className={styles.introText}>
        <span className={styles.typingText}>{typedText}</span>
      </div>
    </div>
  )
} 