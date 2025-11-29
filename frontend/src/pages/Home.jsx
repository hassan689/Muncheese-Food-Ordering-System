import Hero from '../components/landing/Hero'
import PopularItems from '../components/landing/PopularItems'
import HowItWorks from '../components/landing/HowItWorks'
import Reviews from '../components/landing/Reviews'
import '../styles/pages/Home.css'

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <PopularItems />
      <HowItWorks />
      <Reviews />
    </div>
  )
}

export default Home

