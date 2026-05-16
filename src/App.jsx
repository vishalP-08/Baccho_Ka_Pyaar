import ParticlesBackground from './components/ParticlesBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MockTests from './components/MockTests'
import RegistrationForm from './components/RegistrationForm'
import HeartWishes from './components/HeartWishes'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <Navbar />

      <main>
        <Hero />
        <MockTests />
        <Stats />
        <RegistrationForm />
        <HeartWishes />
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}
