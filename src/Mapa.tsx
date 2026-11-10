import { useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { marca, ubicacion } from './contenido'

type Punto = [number, number]

const metros = (a: Punto, b: Punto) => {
  const r = Math.PI / 180
  const dLat = (b[1] - a[1]) * r
  const dLng = (b[0] - a[0]) * r
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLng / 2) ** 2
  return 12742000 * Math.asin(Math.sqrt(s))
}
const linea = (c: Punto[]) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: c } })

async function pedirRuta(): Promise<{ c: Punto[]; km: number; min: number }> {
  const { origen: o, destino: d } = ubicacion
  try {
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${o.lng},${o.lat};${d.lng},${d.lat}?overview=full&geometries=geojson`, { signal: AbortSignal.timeout(9000) })
    const j = await r.json()
    const x = j.routes[0]
    return { c: x.geometry.coordinates, km: Math.round(x.distance / 100) / 10, min: Math.max(1, Math.round(x.duration / 60)) }
  } catch {
    return { c: [[o.lng, o.lat], [d.lng, d.lat]], km: 0, min: 0 }
  }
}

function tenir(map: any) {
  for (const capa of map.getStyle().layers) {
    const id = capa.id
    const ocultar = () => map.setLayoutProperty(id, 'visibility', 'none')
    try {
      if (capa.type === 'background') map.setPaintProperty(id, 'background-color', '#0B1416')
      else if (capa.type === 'raster') ocultar()
      else if (capa.type === 'fill-extrusion') { map.setPaintProperty(id, 'fill-extrusion-color', '#12383B'); map.setPaintProperty(id, 'fill-extrusion-opacity', 0.95) }
      else if (capa.type === 'fill') {
        if (id === 'road_area_pattern' || id === 'building') ocultar()
        else map.setPaintProperty(id, 'fill-color', id === 'water' ? '#0F2E38' : '#0E1B1E')
      } else if (capa.type === 'line') {
        if (/casing|rail|boundary|tunnel|outline/.test(id)) ocultar()
        else map.setPaintProperty(id, 'line-color', /waterway/.test(id) ? '#0F2E38' : '#27484C')
      } else if (capa.type === 'symbol') {
        if (/^highway-name|^label_(city|town|village|other)/.test(id)) { map.setPaintProperty(id, 'text-color', '#8FA5A3'); map.setPaintProperty(id, 'text-halo-color', '#0B1416') }
        else ocultar()
      }
    } catch { /* Una capa distinta no debe detener el mapa. */ }
  }
}

function marcaDiente() {
  const el = document.createElement('div')
  el.innerHTML = '<svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="22" fill="#57BFAE" stroke="#0B1416" stroke-width="2"/><path transform="translate(9 9) scale(1.17)" d="M12 3C9 1 3 1 2 7c-.6 4 1.500 6 2 9 .4 2.500 1 5 2.500 5 2 0 1.500-6 5.500-6s3.500 6 5.500 6c1.500 0 2.100-2.500 2.500-5 .5-3 2.600-5 2-9-1-6-7-6-10-4Z" fill="#0B1416"/></svg>'
  return el
}

const chip = (t: string, c: string) => {
  const el = document.createElement('div')
  el.className = c
  el.textContent = t
  return el
}

export default function Mapa() {
  const zona = useRef<HTMLElement>(null)
  const caja = useRef<HTMLDivElement>(null)
  const obj = useRef(0)
  const [fallo, setFallo] = useState(false)
  const [info, setInfo] = useState({ km: 0, min: 0 })
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start start', 'end end'] })
  const av = useTransform(p, [0.06, 0.86], [0, 1], { clamp: true })
  useMotionValueEvent(av, 'change', (v) => { obj.current = v })

  useEffect(() => {
    let vivo = true
    let rf = 0
    let map: any
    const ob = new IntersectionObserver(async (es) => {
      if (!es[0].isIntersecting || map) return
      ob.disconnect()
      try {
        const [ml, tr, ruta] = await Promise.all([
          import('maplibre-gl'),
          import('maplibre-gl/dist/maplibre-gl-worker.mjs?url' as string),
          pedirRuta(),
          import('maplibre-gl/dist/maplibre-gl.css'),
        ]) as any
        if (!vivo) return
        ml.setWorkerUrl(tr.default)
        setInfo({ km: ruta.km, min: ruta.min })
        const coords: Punto[] = ruta.c
        const acum = coords.reduce<number[]>((l, c, i) => [...l, i ? l[i - 1] + metros(coords[i - 1], c) : 0], [])
        const largo = acum[acum.length - 1]
        const tramo = (q: number) => {
          const d = q * largo
          let i = 0
          while (i < acum.length - 2 && acum[i + 1] < d) i += 1
          const a = coords[i], b = coords[i + 1]
          const t = (d - acum[i]) / Math.max(1, acum[i + 1] - acum[i])
          const pt: Punto = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
          return { pt, hecha: [...coords.slice(0, i + 1), pt] }
        }
        const m = new ml.Map({ container: caja.current!, style: 'https://tiles.openfreemap.org/styles/liberty', interactive: false, center: coords[0], zoom: 14, pitch: 58, attributionControl: { compact: true } })
        map = m
        m.on('error', (e: any) => { if (!m.isStyleLoaded() && String(e.error?.message).includes('style')) setFallo(true) })
        m.once('load', () => {
          if (!vivo) return
          tenir(m)
          caja.current!.style.opacity = '1'
          const b = new ml.LngLatBounds(coords[0], coords[0])
          coords.forEach((c) => b.extend(c))
          const movil = innerWidth < 768
          const cam = m.cameraForBounds(b, { padding: movil ? { top: 170, bottom: 250, left: 50, right: 50 } : { top: 150, bottom: 140, left: 520, right: 120 }, pitch: 58, bearing: 24 })
          const centro = ml.LngLat.convert(cam?.center ?? coords[0])
          const z0 = cam?.zoom ?? 14
          m.addSource('todo', { type: 'geojson', data: linea(coords) })
          m.addSource('hecha', { type: 'geojson', data: linea(coords.slice(0, 2)) })
          const lay = { 'line-cap': 'round', 'line-join': 'round' }
          m.addLayer({ id: 'todo', type: 'line', source: 'todo', layout: lay, paint: { 'line-color': '#F4EFE6', 'line-opacity': 0.2, 'line-width': 3, 'line-dasharray': [1, 2] } })
          m.addLayer({ id: 'halo', type: 'line', source: 'hecha', layout: lay, paint: { 'line-color': '#57BFAE', 'line-opacity': 0.35, 'line-width': 18, 'line-blur': 9 } })
          m.addLayer({ id: 'hecha', type: 'line', source: 'hecha', layout: lay, paint: { 'line-color': '#57BFAE', 'line-width': 5 } })
          new ml.Marker({ element: chip(ubicacion.origen.nombre, 'map-chip'), anchor: 'bottom', offset: [0, -26] }).setLngLat(coords[0]).addTo(m)
          new ml.Marker({ element: chip(ubicacion.destino.nombre, 'map-chip fin'), anchor: 'bottom', offset: [0, -30] }).setLngLat(coords[coords.length - 1]).addTo(m)
          const dn = new ml.Marker({ element: marcaDiente() }).setLngLat(coords[0]).addTo(m)
          let q = 0, ult = -1
          const ciclo = () => {
            if (!vivo) return
            q += (obj.current - q) * 0.12
            if (Math.abs(q - ult) > 0.0004) {
              ult = q
              const t = tramo(Math.min(0.9999, Math.max(0.0001, q)))
              dn.setLngLat(t.pt)
              m.getSource('hecha').setData(linea(t.hecha))
              m.jumpTo({ center: [centro.lng + (t.pt[0] - centro.lng) * 0.3 * q, centro.lat + (t.pt[1] - centro.lat) * 0.3 * q], zoom: z0 + 0.35 * q, bearing: 24 - 46 * q, pitch: 58 })
            }
            rf = requestAnimationFrame(ciclo)
          }
          rf = requestAnimationFrame(ciclo)
        })
      } catch { setFallo(true) }
    }, { rootMargin: '100% 0px' })
    ob.observe(zona.current!)
    return () => { vivo = false; ob.disconnect(); cancelAnimationFrame(rf); map?.remove() }
  }, [])

  const { destino: d } = ubicacion
  return (
    <section ref={zona} className="mapa" id="ubicacion">
      <div className="fijo">
        {!fallo && <div className="lleno"><div ref={caja} style={{ width: '100%', height: '100%', opacity: 0, transition: 'opacity .8s' }} /></div>}
        <div className="lleno mapa-v" />
        <div className="mapa-t">
          <h2>El camino es más corto de lo que crees.</h2>
          <p className="lead">{marca.direccion}</p>
          {marca.horario.map((h) => <p key={h}>{h}</p>)}
          {info.min > 0 && <p className="nota">{info.km} km, unos {info.min} minutos desde {ubicacion.origen.nombre.toLowerCase()}</p>}
          <a className="btn claro" href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`} target="_blank" rel="noreferrer">Abrir en Google Maps</a>
        </div>
      </div>
    </section>
  )
}
