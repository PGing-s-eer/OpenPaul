import { useEffect, useRef, useState } from 'react'
import cloud from 'd3-cloud'

const CYAN = '#00f5d4'
const MUTED = '#8888a8'

/**
 * Fond décoratif type word cloud (d3-cloud), opacité basse.
 */
export function WordCloudBackground({ terms, className = '' }) {
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [placed, setPlaced] = useState([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!dims.w || !dims.h || !terms.length) return

    const seed = terms.map((text, i) => ({
      text,
      size: 11 + (i % 5) * 2.5 + (i % 3),
    }))

    const c = cloud()
      .size([dims.w, dims.h])
      .words(seed)
      .padding(4)
      .rotate(() => (~~(Math.random() * 6) - 3) * 12)
      .font('JetBrains Mono')
      .fontSize((d) => d.size)
      .on('end', (words) => {
        setPlaced(words)
      })

    c.start()

    return () => {
      c.stop()
      setPlaced([])
    }
  }, [dims.w, dims.h, terms])

  const ready = dims.w > 0 && dims.h > 0 && terms.length > 0
  const visiblePlaced = ready ? placed : []

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {ready && (
        <svg
          width={dims.w}
          height={dims.h}
          className="pointer-events-none select-none"
          aria-hidden
        >
          <g transform={`translate(${dims.w / 2},${dims.h / 2})`}>
            {visiblePlaced.map((d, i) => (
              <text
                key={`${d.text}-${i}`}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`translate(${d.x},${d.y}) rotate(${d.rotate})`}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: d.size,
                  fill: i % 4 === 0 ? CYAN : MUTED,
                  opacity: 0.22,
                }}
              >
                {d.text}
              </text>
            ))}
          </g>
        </svg>
      )}
    </div>
  )
}
