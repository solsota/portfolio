import { useState } from 'react'
import { Rotate3d } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { adimensionalGallery } from '../../data/adimensional'

function ProductCard({ product }) {
  const { t } = useLanguage()
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`adim-product-card${flipped ? ' is-flipped' : ''}`}
      style={{ aspectRatio: `${product.width} / ${product.height}` }}
      aria-pressed={flipped}
      aria-label={t('Flip {name} between photo and 3D render', { name: product.name })}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setFlipped(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setFlipped(false) }}
      onClick={() => setFlipped(value => !value)}
      onKeyDown={event => { if (event.key === 'Escape') setFlipped(false) }}
    >
      <span className="adim-product-card-inner">
        <span className="adim-product-face adim-product-photo" aria-hidden={flipped}>
          <img src={product.photo} alt={t('{name} — product photograph', { name: product.name })} width={product.width} height={product.height} loading="lazy" />
        </span>
        <span className="adim-product-face adim-product-render" aria-hidden={!flipped}>
          <img src={product.render} alt={t('{name} — 3D render', { name: product.name })} loading="lazy" />
        </span>
      </span>
      <span className="adim-product-flip-icon" aria-hidden="true"><Rotate3d size={17} /></span>
    </button>
  )
}

export default function AdimensionalGallery() {
  const { t } = useLanguage()
  return (
    <div className="adim-product-gallery" role="group" aria-label={t('Adimensional product photos and 3D renders')}>
      <div className="adim-product-masonry">
        {adimensionalGallery.map(product => <ProductCard key={product.name} product={product} />)}
      </div>
      <p className="adim-product-gallery-hint">{t('Hover or tap a photo to see its 3D render.')}</p>
    </div>
  )
}
