import './ArchiveFolders.css'

function ArchiveFolders() {
  return (
    <button
      className="archive-folders"
      type="button"
      aria-label="Open creative archive"
    >
      <span className="archive-folder folder-uiux">
        <span className="folder-label">UI / UX</span>
      </span>

      <span className="archive-folder folder-games">
        <span className="folder-label">GAMES</span>
      </span>

      <span className="archive-folder folder-visual">
        <span className="folder-label">VISUAL</span>
      </span>

      <span className="archive-folder folder-creative">
        <span className="folder-label">CREATIVE</span>
      </span>
    </button>
  )
}

export default ArchiveFolders