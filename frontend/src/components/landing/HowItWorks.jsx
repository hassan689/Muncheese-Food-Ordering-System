import { HiLocationMarker } from 'react-icons/hi'
import { MdRestaurantMenu } from 'react-icons/md'
import { FaCreditCard } from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'
import '../../styles/components/landing/HowItWorks.css'

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: HiLocationMarker,
      title: 'Select location',
      description: 'Choose the location where your food will be delivered.'
    },
    {
      id: 2,
      icon: MdRestaurantMenu,
      title: 'Choose order',
      description: 'Check over hundreds of menus to pick your favorite food'
    },
    {
      id: 3,
      icon: FaCreditCard,
      title: 'Pay advanced',
      description: 'It\'s quick, safe, and simple. Select several methods of payment'
    },
    {
      id: 4,
      icon: GiPartyPopper,
      title: 'Enjoy meals',
      description: 'Food is made and delivered directly to your home.'
    }
  ]

  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="section-title">How does it work</h2>
        <div className="steps-grid">
          {steps.map(step => {
            const IconComponent = step.icon
            return (
              <div key={step.id} className="step-card">
                <div className="step-icon">
                  <IconComponent />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

