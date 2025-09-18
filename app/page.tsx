'use client'

import { Suspense } from 'react'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import SkillsSection from './components/SkillsSection'
import ContactSection from './components/ContactSection'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'

export default function Home() {
  return (
    <main className="relative">
      <Suspense fallback={<LoadingScreen />}>
        <Navigation />
        <Hero />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </Suspense>
    </main>
  )
}