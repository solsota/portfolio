import { useLanguage } from '../../i18n/LanguageContext'
import './ArchiveFolders.css'

function ArchiveFolders() {
  const { t } = useLanguage()

  return (
    <button
      className="archive-folders"
      type="button"
      aria-label={t("Open creative archive")}
    >
      <span className="archive-folder folder-uiux">
        <span className="folder-label">{t("UI / UX")}</span>
      </span>

      <span className="archive-folder folder-games">
        <span className="folder-label">{t("GAMES")}</span>
      </span>

      <span className="archive-folder folder-visual">
        <span className="folder-label">{t("VISUAL")}</span>
      </span>

      <span className="archive-folder folder-creative">
        <span className="folder-label">{t("CREATIVE")}</span>
      </span>
    </button>
  )
}

export default ArchiveFolders