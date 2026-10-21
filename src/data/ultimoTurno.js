// Animated media is converted losslessly from the original GIFs.
export const ultimoTurnoImages = {
  banner: '/ultimoturno/Banner EUT.webp',
  eva: '/ultimoturno/Icon EVa.webp',
}

export const ultimoTurnoMedia = {
  contribution: '/ultimoturno/1012.webp',
  interface: '/ultimoturno/main-menu.webp',
  hud: '/ultimoturno/cleaning-gameplay.webp',
  beer: '/ultimoturno/1012.webp',
  whisky: '/ultimoturno/1012(2).webp',
  cleaning: '/ultimoturno/cleaning-gameplay.webp',
  creatureShadow: '/ultimoturno/creature-shadow.webp',
  enemyDisintegration: '/ultimoturno/enemy-disintegration.webp',
}

export const ultimoTurnoMechanics = [
  {
    id: 'beer',
    title: 'Beer Serving System',
    tools: 'Unity Animation · C# Scripting · Shader Graph',
    paragraphs: [
      'Developed an interactive beer-serving mechanic using Unity animations and C# scripts to synchronize the pouring sequence.',
      'The system coordinates the beer stream, glass-filling effect, and animation timing to create a smooth and visually consistent interaction.',
    ],
  },
  {
    id: 'whisky',
    title: 'Whisky Serving System',
    tools: 'Blender Animation · Unity · C# Scripting',
    paragraphs: [
      'Developed an interactive whisky-serving mechanic featuring first-person arms and hand animations created in Blender.',
      'Using C# scripts, I synchronized the character’s movements, bottle interactions, whisky pouring, and glass-filling effects to create a seamless first-person experience.',
    ],
  },
  {
    id: 'cleaning',
    title: 'Cleaning Mechanics',
    tools: 'Blender Animation · Unity · C# Scripting',
    paragraphs: [
      'Developed an interactive cleaning system featuring first-person animations created in Blender for mop interactions.',
      'Using C# scripts, I synchronized the cleaning animations with player input, surface interactions, and progress tracking to create a responsive and immersive gameplay mechanic.',
    ],
  },
]

export const ultimoTurnoAnimationGallery = [
  { id: 'rigging', image: '/ultimoturno/pilar-rigging.webp', label: 'Pilar · Creature Rigging' },
  { id: 'movement', image: '/ultimoturno/sombra-animation.webp', label: 'Sombra · Quadrupedal Movement' },
  { id: 'animation', image: '/ultimoturno/mop-animation.webp', label: 'First-person Animation' },
]
