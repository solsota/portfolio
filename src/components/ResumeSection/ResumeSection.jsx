import { Download, FileText } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { getResume } from '../../data/resume'
import './ResumeSection.css'

export default function ResumeSection() {
  const { language, t } = useLanguage()
  const resume = getResume(language)
  const buttonContent = <>{t('Download CV')}<Download size={19} aria-hidden="true" /></>

  return (
    <section className="resume-section" id="resume" aria-labelledby="resume-title">
      <div className="resume-card">
        <div className="resume-copy">
          <p className="resume-eyebrow">{t('A little more about me')}</p>
          <h2 id="resume-title">CV</h2>
          <p className="resume-description">{t('My experience, education and skills, in one place.')}</p>
        </div>

        <div className="resume-download">
          <div className="resume-file">
            <FileText size={27} strokeWidth={1.5} aria-hidden="true" />
            <span>Sol Masetti <span className="resume-format">PDF</span></span>
            <span className="resume-language" lang={resume.language}>{resume.label}</span>
          </div>
          {resume.url ? (
            <a className="resume-button" href={resume.url} download={resume.filename} hrefLang={resume.language} type="application/pdf">
              {buttonContent}
            </a>
          ) : (
            <button className="resume-button" type="button" disabled aria-describedby="resume-status">
              {buttonContent}
            </button>
          )}
          <p className="resume-status" id="resume-status" role="status">
            {resume.url ? t('PDF · {language}', { language: resume.label }) : t('PDF coming soon')}
          </p>
        </div>
      </div>
    </section>
  )
}
