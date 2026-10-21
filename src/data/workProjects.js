import { archiveProjects } from './archiveProjects'

// All routes share this registry. Only explicitly featured work enters the menu.
export const workProjects = [
  {
    id: 'work-adimensional',
    path: '/work/adimensional',
    kind: 'adimensional',
    featured: true,
    category: 'digital',
    extraCategories: ['3d'],
    title: 'Adimensional',
    description: 'Brand identity · E-commerce UX · 3D product design',
    cover: '/adim/Banner Adim.webp',
  },
  {
    id: 'work-el-ultimo-turno',
    path: '/work/elultimoturno',
    kind: 'ultimo-turno',
    featured: true,
    category: 'games',
    title: 'El Último Turno',
    description: 'Game design · UI/UX · Technical art',
    studio: 'T15 Studio',
    type: 'Narrative horror game',
    year: '2026 — Present',
    role: 'UI/UX Designer · Game & Technical Art · Production',
    overview: 'El Último Turno is a narrative horror game developed as a collaborative university project. My work focuses on shaping its visual and interactive experience, from environment art and lighting to interface design, gameplay polish and narrative iteration.',
    tools: ['Unity', 'Blender', 'Mixamo'],
    cover: '/ultimoturno/Banner EUT.webp',
    cardImagePosition: 'left center',
    coverAlt: 'El Último Turno game presentation',
    contributions: [
      {
        title: 'Game & technical art',
        text: 'Environment dressing and lighting, 3D asset integration, character setup, rigging and animation using Unity, Blender and Mixamo.',
      },
      {
        title: 'UI/UX & implementation',
        text: 'Design and implementation of the game’s interface and interaction experience in Unity, including HUDs, menus, interaction systems and visual feedback.',
      },
      {
        title: 'Design & production',
        text: 'Gameplay and narrative iteration, level polish, project coordination and visual communication surrounding the game.',
      },
    ],
    gallery: [
      { src: '/experience/t15-02.webp', alt: 'El Último Turno gameplay' },
      { src: '/experience/t15-03.webp', alt: 'El Último Turno menus and interface design' },
    ],
  },
  ...archiveProjects,
]
