'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import IntroSection from '@/components/IntroSection'
import TourSection from '@/components/TourSection'
import MainContent from '@/components/MainContent'

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showTour, setShowTour] = useState(false)
  const [showMain, setShowMain] = useState(false)

  const handleTourComplete = () => {
    setShowTour(false)
    setShowMain(true)
  }

  const handleIntroComplete = () => {
    setShowIntro(false)
    setShowTour(true)
  }

  const handleReplayIntro = () => {
    setShowMain(false)
    setShowTour(false)
    setShowIntro(true)
  }

  return (
    <main>
      {showIntro && <IntroSection onComplete={handleIntroComplete} />}
      {showTour && <TourSection onComplete={handleTourComplete} />}
      {showMain && <MainContent onReplayIntro={handleReplayIntro} />}
    </main>
  )
} 