import { motion } from 'motion/react'
import { ArrowUpRight, Mail, BriefcaseBusiness, Camera, CodeXml, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { contactEmail, socialProfiles } from '../../data/contactLinks'
import './ContactContent.css'

const socialIcons = {
  linkedin: BriefcaseBusiness,
  instagram: Camera,
  github: CodeXml,
  itchio: Gamepad2,
}

export default function ContactContent() {
  const { t } = useLanguage()

  return (
    <motion.div
      className="contact-content"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <a className="contact-card contact-email" href={`mailto:${contactEmail}`}>
        <Mail className="contact-icon" size={24} aria-hidden="true" />
        <span className="contact-card-text">
          <span className="contact-label">{t('Email')}</span>
          <span className="contact-address">{contactEmail}</span>
        </span>
        <ArrowUpRight className="contact-arrow" size={22} aria-hidden="true" />
      </a>

      {socialProfiles.map(({ id, label, href }) => {
        const Icon = socialIcons[id]
        return (
          <a key={id} className="contact-card" href={href} target="_blank" rel="noopener noreferrer">
            <Icon className="contact-icon" size={24} aria-hidden="true" />
            <span className="contact-card-text">{label}</span>
            <ArrowUpRight className="contact-arrow" size={22} aria-hidden="true" />
          </a>
        )
      })}
    </motion.div>
  )
}
