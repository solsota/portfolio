const files = {
  en: '/cv/Sol_Masetti_CV_Harvard_EN.pdf',
  es: '/cv/Sol_Masetti_CV_Harvard_ES.pdf',
}

export function getResume(language) {
  const locale = language === 'es' ? 'es' : 'en'
  const filename = `sol-masetti-cv-${locale}.pdf`
  return {
    url: files[locale],
    filename,
    language: locale,
    label: locale === 'es' ? 'Español' : 'English',
  }
}
