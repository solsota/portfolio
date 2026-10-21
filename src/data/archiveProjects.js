const text = (en, es) => ({ en, es })
const image = (src, en, es, options = {}) => ({ src, caption: text(en, es), ...options })

export const archiveProjects = [
  {
    id: 'work-laereo', path: '/work/laereo', featured: false, kind: 'archive', category: 'digital', theme: 'aviation',
    title: 'L’Aereo', type: 'Web Design & UX/UI', description: 'Web design · UX/UI · Visual design',
    cover: '/projects/laereo/home.webp', tools: [],
    overview: text('A clear digital presence for an aircraft maintenance company. I designed the website’s visual experience, bringing its services and corporate information into a coherent, professional interface.', 'Una presencia digital clara para una empresa de mantenimiento aeronáutico. Diseñé la experiencia visual del sitio, organizando sus servicios y la información corporativa en una interfaz coherente y profesional.'),
    role: text('Website visual design · Content hierarchy · Navigation experience', 'Diseño visual del sitio · Jerarquía de contenidos · Experiencia de navegación'),
    context: text('Corporate website', 'Sitio corporativo'),
    credit: text('My contribution was the website’s general visual design. Website programming and brand identity development were outside my role.', 'Mi participación fue el diseño visual general del sitio. La programación de la web y el desarrollo de la identidad de marca estuvieron fuera de mi rol.'),
    external: { href: 'https://www.laereo.com/?lang=es', label: 'Visit website' },
    sections: [
      { title: 'A clear first impression', body: text('I worked on composition and visual hierarchy to introduce the company and make its services easy to identify. The interface presents an established technical business with a consistent visual language.', 'Trabajé la composición y la jerarquía visual para presentar la empresa y facilitar la identificación de sus servicios. La interfaz comunica una actividad técnica especializada mediante un lenguaje visual consistente.'), media: [image('/projects/laereo/home.webp', 'Homepage · Company presentation', 'Inicio · Presentación de la empresa')] },
      { title: 'Services, in focus', body: text('The service pages give the company’s different areas a structured presentation. Clear headings, supporting imagery and a consistent layout help visitors move through the information.', 'Las páginas de servicios presentan las distintas áreas de la empresa de forma organizada. Los títulos, las imágenes de apoyo y una estructura consistente ayudan a recorrer la información.'), media: [image('/projects/laereo/services.webp', 'Aircraft maintenance · Service page', 'Mantenimiento aeronáutico · Página de servicio')] },
      { title: 'One visual system', body: text('The corporate sections continue the same composition and navigation, connecting the company’s presentation with the rest of the site.', 'Las secciones corporativas mantienen la misma composición y navegación, conectando la presentación de la empresa con el resto del sitio.'), media: [image('/projects/laereo/about.webp', 'About the company · Corporate information', 'Sobre la empresa · Información corporativa')] },
    ],
  },
  {
    id: 'work-salty-muffin', path: '/work/salty-muffin', featured: false, kind: 'archive', category: 'games', theme: 'bakery',
    title: 'Salty & Muffin', type: 'Game Design & Development', description: '2D game · Local co-op · Unity',
    cover: '/projects/salty-muffin/screen-2.webp', tools: ['Unity'],
    overview: text('A bakery adventure built around collecting ingredients and completing orders. I designed and developed this top-down 2D maze game as an individual project, with both single-player and local cooperative modes.', 'Una aventura de panadería centrada en recolectar ingredientes y completar pedidos. Diseñé y desarrollé este juego de laberintos 2D con vista top-down como proyecto individual, con modos para un jugador y cooperativo local.'),
    role: text('Game design · Visual direction · Gameplay implementation', 'Diseño del juego · Propuesta visual · Implementación de mecánicas'),
    context: text('Individual project · Video Game Programming II · UTN', 'Proyecto individual · Programación de Videojuegos II · UTN'),
    credit: text('Parts of development and some graphic resources were created with AI assistance.', 'Parte del desarrollo y algunos recursos gráficos se realizaron con asistencia de IA.'),
    external: { href: 'https://solsota.itch.io/salty-y-muffin', label: 'Play on itch.io' },
    sections: [
      { title: 'Orders give the maze a purpose', body: text('Players collect the ingredients needed for bakery orders while avoiding enemies. My work connected the game’s collection mechanics, visual proposal and playable rules around that shared objective.', 'Los jugadores recolectan los ingredientes necesarios para los pedidos mientras evitan enemigos. Mi trabajo conectó las mecánicas de recolección, la propuesta visual y las reglas jugables alrededor de ese objetivo.'), media: [image('/projects/salty-muffin/screen-1.webp', 'Salty & Muffin · Game interface', 'Salty & Muffin · Interfaz del juego'), image('/projects/salty-muffin/screen-2.webp', 'Top-down maze · Ingredient collection', 'Laberinto top-down · Recolección de ingredientes')] },
      { title: 'Play solo. Bake together.', body: text('The experience supports one player or two people playing locally. I designed and implemented the mechanics for both modes as part of the same individual Unity project.', 'La experiencia permite jugar en solitario o entre dos personas de forma local. Diseñé e implementé las mecánicas de ambos modos dentro del mismo proyecto individual en Unity.'), media: [image('/projects/salty-muffin/screen-3.webp', 'Game screen · Published project material', 'Pantalla del juego · Material publicado del proyecto'), image('/projects/salty-muffin/screen-4.webp', 'Game interface · Published project material', 'Interfaz del juego · Material publicado del proyecto')] },
    ],
  },
  {
    id: 'work-greta-fugazzeta', path: '/work/greta-la-fugazzeta', featured: false, kind: 'archive', category: 'games', theme: 'pizza',
    title: 'Greta la Fugazzeta', type: 'First Game Project', description: 'Endless runner · UI/UX · Unity',
    cover: '/projects/greta/screen-1.webp', tools: ['Unity'],
    cardImageScale: 1.08,
    overview: text('My first game, inspired by my cat Greta. I designed and developed a 2D endless runner where collecting ingredients becomes a race to make more pizzas, earn points and beat your own record.', 'Mi primer videojuego, inspirado en mi gata Greta. Diseñé y desarrollé un endless runner 2D donde recolectar ingredientes se convierte en una carrera por preparar más pizzas, sumar puntos y superar tu propio récord.'),
    role: text('Game concept · Interface design · Visual experience · Development', 'Concepto del juego · Diseño de interfaz · Experiencia visual · Desarrollo'),
    context: text('Individual project · Video Game Programming I · UTN', 'Proyecto individual · Programación de Videojuegos I · UTN'),
    recognition: '10/10',
    credit: text('I designed the interface, visual experience and game concept. Some assets, animations and parts of the programming were developed with AI assistance.', 'Diseñé personalmente la interfaz, la experiencia visual y el concepto del juego. Algunos assets, animaciones y partes de la programación se desarrollaron con asistencia de IA.'),
    external: { href: 'https://solsota.itch.io/greta-la-fugazzeta', label: 'Play on itch.io' },
    sections: [
      { title: 'A character to build around', body: text('Greta’s personality became the starting point for the game. I brought the cat, pizza-making objective and endless-runner format into one playful visual experience.', 'La personalidad de Greta fue el punto de partida del juego. Uní a la protagonista, el objetivo de preparar pizzas y el formato endless runner en una experiencia visual lúdica.'), media: [image('/projects/greta/menu.webp', 'Main menu & loading screen', 'Menú principal y pantalla de carga', { layout: 'portrait' })] },
      { title: 'A playful way to learn', body: text('I designed the tutorial to explain ingredient collection, lane changes and jumping through illustrated instructions. The interface introduces the rules before the first run.', 'Diseñé el tutorial para explicar la recolección de ingredientes, los cambios de carril y los saltos mediante instrucciones ilustradas. La interfaz presenta las reglas antes de empezar la primera partida.'), media: [image('/projects/greta/how-to-play.webp', 'How to play · Tutorial interface', 'Cómo jugar · Interfaz del tutorial')] },
      { title: 'Small controls, clear choices', body: text('The settings screen brings the audio controls into the same warm visual system. This project was my first practical introduction to turning a game concept into a playable experience.', 'La pantalla de ajustes integra los controles de audio en el mismo sistema visual cálido. Este proyecto fue mi primer acercamiento práctico a transformar una idea en una experiencia jugable.'), media: [image('/projects/greta/settings.webp', 'Settings · Music and sound controls', 'Ajustes · Controles de música y sonido', { layout: 'compact' })] },
    ],
  },
  {
    id: 'work-greta-japanese-garden', path: '/work/greta-japanese-garden', featured: false, kind: 'archive', category: 'games', theme: 'garden',
    title: 'Greta & the Japanese Garden', type: 'Interactive Audio & Game Development', description: 'Interactive audio · 3D game · Unity',
    cover: '/projects/garden/cover.webp', tools: ['Unity', 'Adobe Audition'],
    overview: text('A nighttime garden, a curious cat and a world shaped by sound. I designed and programmed this third-person 3D experience, focusing on interactions, playable behaviour and the implementation of interactive audio.', 'Un jardín nocturno, una gata curiosa y un mundo construido también desde el sonido. Diseñé y programé esta experiencia 3D en tercera persona, con foco en las interacciones, el comportamiento jugable y la implementación de audio interactivo.'),
    role: text('Game design · Gameplay programming · Interactive audio · Original recordings', 'Diseño del juego · Programación de mecánicas · Audio interactivo · Grabaciones originales'),
    context: text('Individual project · Interactive Audio · UTN', 'Proyecto individual · Audio Interactivo · UTN'),
    credit: text('The main environment comes from Unity Learn; other visual resources come from external libraries. These assets were not modelled by me. The local animations below are silent; the downloadable game includes the audio experience.', 'El escenario principal proviene de Unity Learn y otros recursos visuales de bibliotecas externas; no fueron modelados por mí. Las animaciones locales que se muestran aquí no tienen sonido; el juego descargable incluye la experiencia sonora.'),
    external: { href: 'https://solsota.itch.io/greta-japanese-garden', label: 'Explore on itch.io' },
    sections: [
      { title: 'Sound is part of the experience', body: text('I recorded and edited original audio, including the grandmother’s voice and sounds from my own cat, using Adobe Audition. The audio work forms part of the player’s experience as Greta explores and interacts with the garden.', 'Grabé y edité audios originales en Adobe Audition, incluyendo la voz de la abuela y sonidos de mi propia gata. El trabajo sonoro acompaña la experiencia del jugador mientras Greta explora e interactúa con el jardín.'), media: [image('/projects/garden/encounters.webp', 'Garden encounters · Silent gameplay loop', 'Encuentros en el jardín · Animación de gameplay sin sonido')] },
      { title: 'Explore, interact, complete', body: text('Greta explores a Japanese garden at night, completes errands and faces creatures. I worked on the game design and programmed the interactions and playable behaviour that connect these activities.', 'Greta explora un jardín japonés nocturno, completa encargos y se enfrenta a criaturas. Trabajé en el diseño del juego y programé las interacciones y el comportamiento jugable que conectan estas actividades.'), media: [image('/projects/garden/exploration.webp', 'Third-person exploration · Silent gameplay loop', 'Exploración en tercera persona · Animación de gameplay sin sonido'), image('/projects/garden/dialogue.webp', 'Character interaction · Silent gameplay loop', 'Interacción con personajes · Animación de gameplay sin sonido')] },
    ],
  },
  {
    id: 'work-getagame', path: '/work/get-a-game', featured: false, kind: 'archive', category: 'games', theme: 'puzzle',
    title: 'Get-A Game', type: 'Mobile Puzzle Games', description: '2048 · Magic Tap Away · Collaborative design',
    cover: '/experience/getagame-01.webp', tools: [],
    overview: text('Two mobile puzzle games, one small independent team. As part of a two-person project, I contributed to the game design and creative decisions behind 2048 and Magic Tap Away.', 'Dos juegos móviles de puzzle y un pequeño equipo independiente. Como parte de un proyecto de dos personas, participé en el diseño de los videojuegos y en las decisiones creativas de 2048 y Magic Tap Away.'),
    role: text('Mobile game design · Creative decisions', 'Diseño de videojuegos móviles · Decisiones creativas'),
    context: text('Independent collaboration · Team of two', 'Colaboración independiente · Equipo de dos personas'),
    credit: text('Get-A Game was developed collaboratively. My contribution focused on game design and creative decisions; this was not a solo development project.', 'Get-A Game fue un proyecto colaborativo. Mi participación se centró en el diseño de los videojuegos y las decisiones creativas; no fue un desarrollo individual.'),
    external: { href: 'https://play.google.com/store/apps/dev?id=8535466326774521400', label: 'Google Play profile' },
    sections: [
      { title: '2048', body: text('I participated in the design of 2048 as one of the project’s two puzzle games. These project mockups present its interface across mobile devices.', 'Participé en el diseño de 2048 como uno de los dos puzzles del proyecto. Estos mockups muestran su interfaz en dispositivos móviles.'), media: [image('/experience/getagame-01.webp', '2048 · Project presentation', '2048 · Presentación del proyecto', { layout: 'portrait' }), image('/experience/getagame-03.webp', '2048 · Main menu', '2048 · Menú principal', { layout: 'portrait' })] },
      { title: 'Magic Tap Away', body: text('The second puzzle game formed part of the same two-person collaboration. My contribution was linked to its game design and the project’s creative direction.', 'El segundo puzzle formó parte de la misma colaboración entre dos personas. Mi contribución estuvo vinculada al diseño del videojuego y a las decisiones creativas del proyecto.'), media: [image('/experience/getagame-02.webp', 'Magic Tap Away · Mobile interface', 'Magic Tap Away · Interfaz móvil', { layout: 'portrait' })] },
    ],
  },
  {
    id: 'work-technical-art', path: '/work/technical-art', featured: false, kind: 'archive', category: '3d', theme: 'environment',
    title: 'Technical Art', type: 'Unreal Engine · Environment Art', description: 'Environment art · Scene composition · Unreal Engine',
    cover: '/projects/technical-art/poster.webp', tools: ['Unreal Engine'],
    overview: text('An environment study built in Unreal Engine, focused on composing and presenting a 3D scene with external visual resources. The project explored how existing assets and materials can come together within a consistent visual direction.', 'Un estudio de entorno realizado en Unreal Engine, centrado en componer y presentar una escena 3D con recursos visuales externos. El proyecto exploró cómo integrar assets y materiales existentes dentro de una dirección visual consistente.'),
    role: text('Environment composition · Visual direction · Scene presentation', 'Composición del entorno · Dirección visual · Presentación de la escena'),
    context: text('Individual project · Technical Art · UTN', 'Proyecto individual · Technical Art · UTN'), recognition: '10/10',
    credit: text('The environment uses external assets and materials, including Quixel Megascans resources. I did not model the source assets.', 'El entorno utiliza assets y materiales externos, incluidos recursos de Quixel Megascans. No modelé los assets utilizados.'),
    sections: [
      { title: 'Final film', body: text('The final film presents the environment through a moving tour of its spaces, with warm brick façades and interiors set against a snowy landscape. The video is the main visual reference for this scene composition study.', 'El video final presenta el entorno mediante un recorrido por sus espacios, con fachadas e interiores de ladrillo cálidos frente a un paisaje nevado. El video es la referencia visual principal de este estudio de composición de escenas.'), media: [{ kind: 'video', src: '/projects/technical-art/environment.mp4', sources: [{ src: '/projects/technical-art/stream/index.m3u8', type: 'application/vnd.apple.mpegurl' }, { src: '/projects/technical-art/environment.mp4', type: 'video/mp4' }], poster: '/projects/technical-art/poster.webp', caption: text('Unreal Engine · Final environment film', 'Unreal Engine · Video final del entorno') }] },
      { title: 'Composing a place', body: text('The project brought together assets, surface and landscape materials, and visual references of architecture, cafés, European streets and railway settings. My focus was the composition and presentation of the environment.', 'El proyecto reunió assets, materiales de superficies y paisajes, y referencias visuales de arquitectura, cafeterías, calles europeas y escenarios ferroviarios. Mi foco fue la composición y presentación del entorno.'), media: [] },
    ],
  },
  {
    id: 'work-3d-art', path: '/work/3d-art', featured: false, kind: 'archive', category: '3d', theme: 'modelling',
    title: 'High Poly / Low Poly', type: '3D Art · Retopology & UVs', description: 'Blender · Retopology · UV mapping',
    cover: '/projects/3d-art/high-poly.webp', tools: ['Blender'],
    overview: text('A Blender modelling study focused on the foundations of producing a game-ready object: a high-poly model, a low-poly version, retopology and UV preparation.', 'Un estudio de modelado en Blender centrado en los fundamentos para producir un objeto preparado para videojuegos: modelo high poly, versión low poly, retopología y preparación de UVs.'),
    role: text('High-poly & low-poly modelling · Retopology · UV mapping', 'Modelado high poly y low poly · Retopología · UV mapping'),
    context: text('Individual project · 3D Art · UTN', 'Proyecto individual · Arte 3D · UTN'), recognition: '10/10',
    credit: text('The submission included the editable Blender file and a low-poly FBX export. Tutor feedback highlighted shape fidelity, subdivisions, vertex support, retopology and UV quality, with small improvements suggested for geometry and UV space use.', 'La entrega incluyó el archivo editable de Blender y la exportación low poly en FBX. La devolución docente destacó la fidelidad de la forma, las subdivisiones, el soporte de vértices, la retopología y las UVs, con pequeñas mejoras sugeridas en geometría y aprovechamiento del espacio UV.'),
    sections: [
      { title: 'From shape to structure', body: text('I modelled a measuring device in Blender, developing its high-poly form with subdivisions and support geometry. The working capture shows the object’s structure, from its handle and casing to its controls and small details.', 'Modelé un medidor en Blender, desarrollando su forma high poly mediante subdivisiones y geometría de soporte. La captura de trabajo muestra la estructura del objeto, desde el asa y la carcasa hasta los controles y los detalles pequeños.'), media: [image('/projects/3d-art/high-poly.webp', 'High Poly · Subdivisions and support geometry in Blender', 'High Poly · Subdivisiones y geometría de soporte en Blender')] },
      { title: 'Retopology & game-ready geometry', body: text('I built a low-poly version through retopology, organising the geometry around the object’s shape. The second working capture shows the resulting topology. The project also included UV preparation through seams, the editable Blender file and a low-poly FBX export.', 'Construí una versión low poly mediante retopología, organizando la geometría alrededor de la forma del objeto. La segunda captura de trabajo muestra la topología resultante. El proyecto también incluyó preparación de UVs mediante seams, el archivo editable de Blender y la exportación low poly en FBX.'), media: [image('/projects/3d-art/retopology.webp', 'Low Poly · Retopology wireframe in Blender', 'Low Poly · Wireframe de la retopología en Blender')] },
    ],
  },
]

export function projectText(value, language) {
  return typeof value === 'object' && value !== null ? value[language] ?? value.en : value
}

export const projectCategories = [
  { id: 'digital', label: 'DIGITAL / UX·UI' },
  { id: 'games', label: 'GAME EXPERIENCES' },
  { id: '3d', label: '3D & PRODUCT DESIGN' },
]
