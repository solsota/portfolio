import './ToolkitSection.css'


const tools = [
  { name: 'Figma', icon: '/toolkit/figma.svg' },
  { name: 'Unity', icon: '/toolkit/unity.svg' },
  { name: 'Unreal', icon: '/toolkit/unreal.svg' },
  { name: 'Illustrator', icon: '/toolkit/illustrator.svg' },
  { name: 'Photoshop', icon: '/toolkit/photoshop.svg' },
  { name: 'Blender', icon: '/toolkit/blender.svg' },
  { name: 'Substance', icon: '/toolkit/substance.svg' },
  { name: 'VS Code', icon: '/toolkit/vscode.svg' },
  { name: 'GitHub', icon: '/toolkit/github.svg' },
  { name: 'CapCut', icon: '/toolkit/capcut.svg' },
  { name: 'Canva', icon: '/toolkit/canva.svg' }
]


function ToolkitSection() {

  const duplicatedTools = [
    ...tools,
    ...tools
  ]


  return (
    <section
      className="toolkit-section"
      aria-label="Toolkit"
    >

      <div className="toolkit-marquee">

        <div className="toolkit-track">

          {duplicatedTools.map(
            (tool, index) => (

              <div
                className="toolkit-pill"
                key={`${tool.name}-${index}`}
              >

                <span className="toolkit-icon-wrap">

                  <img
                    src={tool.icon}
                    alt=""
                    draggable="false"

                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />

                </span>

                <span className="toolkit-name">
                  {tool.name}
                </span>

              </div>

            )
          )}

        </div>

      </div>

    </section>
  )
}


export default ToolkitSection