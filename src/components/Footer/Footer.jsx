import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { contactEmail, socialProfiles } from '../../data/contactLinks'
import './Footer.css'

export default function Footer() {
  const { t, href } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <p className="footer-eyebrow">{t('Have a project in mind?')}</p>
          <h2>{t('Let’s create together.')}</h2>
          <a className="footer-email" href={`mailto:${contactEmail}`}>
            {contactEmail}
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        </div>

        <nav className="footer-socials" aria-label={t('Social profiles')}>
          {socialProfiles.map(({ id, label, href: profileUrl }) => (
            <a key={id} href={profileUrl} target="_blank" rel="noopener noreferrer">
              {label}<ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <a className="footer-brand" href={href('/#home')} lang="en">SOL’s creative ARCHIVE</a>
        <small>© {new Date().getFullYear()} Sol Masetti</small>
        <a className="footer-top" href={href('/#home')}>
          {t('Back to top')}<ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
