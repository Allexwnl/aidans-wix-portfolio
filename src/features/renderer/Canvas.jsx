/** Canvas — versie 1.0 | Laatst gewijzigd: 2026-10-29. Eigen viewport voor correcte responsive mediaqueries. */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SiteRenderer } from './SiteRenderer.jsx'
import siteCss from './site.css?inline'

// Een iframe gebruikt echte viewportbreedte; stijlen blijven los van het dashboard.
export function Canvas(props) {
  const [frame, setFrame] = useState(null)
  const host = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    )
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  const width = props.viewportWidth || size.width
  const scale = width && size.width ? Math.min(1, size.width / width) : 1
  return (
    <div className="canvas-viewport" ref={host}>
      <iframe
        className="canvas-frame"
        style={{
          width: width ? `${width}px` : '100%',
          height: size.height ? `${size.height / scale}px` : '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        title={props.editing ? 'Website bewerken' : 'Websitevoorbeeld'}
        srcDoc="<!doctype html><html lang='nl'><head><meta name='viewport' content='width=device-width, initial-scale=1'></head><body><div id='canvas-root'></div></body></html>"
        onLoad={(event) =>
          setFrame(event.currentTarget.contentDocument.getElementById('canvas-root'))
        }
      >
        {frame &&
          createPortal(
            <>
              <style>{siteCss}</style>
              <SiteRenderer {...props} />
            </>,
            frame
          )}
      </iframe>
    </div>
  )
}
