import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const en = {
  translation: {
    app_name: ':out\\of\\context',
    tagline: "India's friendliest influencer marketplace",
    hero_headline: "India's friendliest\ninfluencer marketplace",
    hero_sub: 'Connecting real creators with brands that care about results.',
    cta_creator: "I'm a Creator",
    cta_creator_pitch: 'Find paid brand work that fits your audience',
    cta_brand: "I'm a Brand",
    cta_brand_pitch: 'Find the right creators — without the agency fees',
    social_proof: 'Trusted by 500K+ creators across India',
    login: 'Login',
    get_started: 'Get started',
    how_it_works: 'How it works',
  },
}

// Hindi placeholder — keys ready, translations pending
const hi = { translation: {} }

i18n.use(initReactI18next).init({
  resources: { en, hi },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
