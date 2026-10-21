import { workProjects } from './workProjects'

// A project can demonstrate several disciplines. Each card chooses its own
// visual and destination, including existing sections inside a case study.
function card(projectId, options = {}) {
  const project = workProjects.find(item => item.id === projectId)
  return {
    title: project.title,
    link: project.path,
    thumbnail: project.cover,
    imageScale: project.cardImageScale || 1,
    imagePosition: project.cardImagePosition || 'center',
    ...options,
  }
}

export const projectArchiveRows = [
  {
    id: 'digital', label: 'DIGITAL EXPERIENCES / UX·UI', cards: [
      card('work-adimensional', { thumbnail: '/experience/adimensional-03.webp', link: '/work/adimensional#digital-experience' }),
      card('work-laereo'),
      card('work-el-ultimo-turno', { title: 'El Último Turno · UI/UX', thumbnail: '/projects/eut/interface.webp', imagePosition: 'left center', link: '/work/elultimoturno#designing-the-experience', eva: true }),
      card('work-greta-fugazzeta', { title: 'Greta la Fugazzeta · UI/UX', thumbnail: '/projects/greta/how-to-play.webp', imagePosition: 'left center', imageScale: 1 }),
      card('work-getagame', { title: 'Get-A Game · UI/UX', thumbnail: '/experience/getagame-03.webp' }),
    ],
  },
  {
    id: 'games', label: 'GAME DESIGN & DEVELOPMENT', cards: [
      card('work-getagame'),
      card('work-el-ultimo-turno', { eva: true }),
      card('work-greta-japanese-garden'),
      card('work-salty-muffin', { thumbnail: '/projects/salty-muffin/main-menu.webp' }),
      card('work-greta-fugazzeta', { thumbnail: '/projects/greta/menu.webp', imagePosition: 'center top', imageScale: 1.08 }),
    ],
  },
  {
    id: '3d', label: '3D & PRODUCT DESIGN', cards: [
      card('work-adimensional', { title: 'Adimensional · 3D & Product Design', thumbnail: '/projects/adimensional/model-and-lamp.webp', link: '/work/adimensional#layer-by-layer' }),
      card('work-technical-art', { thumbnail: '/projects/technical-art/landscape.webp', icon: '/toolkit/unreal.svg', lightIcon: true }),
      card('work-el-ultimo-turno', { title: 'Blender Animation & Bones', thumbnail: '/projects/eut/sombra.webp', imagePosition: 'center', link: '/work/elultimoturno#rigging-animation', eva: true }),
      card('work-3d-art', { icon: '/toolkit/blender.svg' }),
    ],
  },
]
