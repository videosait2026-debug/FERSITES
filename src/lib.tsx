import { motion, useReducedMotion, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { marca } from './contenido'
import frames from './frames.json'

export const EASE = [0.16, 1, 0.3, 1] as const
export const BASE_RECURSOS = '/recursos/'
export const ruta = (archivo: string) => BASE_RECURSOS + archivo
export const wa = (t: string) => `https://wa.me/${marca.whatsapp}?text=${encodeURIComponent(t)}`

export function Foto({ n, alt = '', className = '' }: { n: string; alt?: string; className?: string }) {
  const [mal, setMal] = useState(false)
  if (mal) return <div className={`vacio ${className}`} />
  return <img src={ruta(`${n}.jpg`)} alt={alt} loading="lazy" onError={() => setMal(true)} className={className} />
}

export function Video({ n, className = '' }: { n: string; className?: string }) {
  const [mal, setMal] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    ob.observe(v)
    return () => ob.disconnect()
  }, [mal])
  if (mal) return <Foto n={n} className={className} />
  return <video ref={ref} src={ruta(`${n}.mp4`)} muted loop playsInline preload="metadata" onError={() => setMal(true)} className={className} />
}

export function VideoScroll({ n, avance, className = '' }: { n: string; avance: MotionValue<number>; className?: string }) {
  const [mal, setMal] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const reducido = useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let rf = 0
    let suave = 0

    const ciclo = () => {
      if (!v || isNaN(v.duration) || v.duration <= 0) {
        rf = requestAnimationFrame(ciclo)
        return
      }
      const progreso = reducido ? 0 : Math.min(1, Math.max(0, avance.get()))
      const meta = progreso * v.duration
      suave += (meta - suave) * 0.15
      if (Math.abs(v.currentTime - suave) > 0.03) {
        v.currentTime = suave
      }
      rf = requestAnimationFrame(ciclo)
    }

    rf = requestAnimationFrame(ciclo)
    return () => cancelAnimationFrame(rf)
  }, [avance, reducido, mal])

  if (mal) return <Secuencia nombre={n} avance={avance} className={className} />
  return (
    <video
      ref={ref}
      src={ruta(`${n}.mp4`)}
      muted
      playsInline
      preload="auto"
      onError={() => setMal(true)}
      className={className}
      style={{ pointerEvents: 'none', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}


export function useExisten(nombres: string[]) {
  const [ok, setOk] = useState<string[]>([])
  useEffect(() => {
    let vivo = true
    Promise.all(nombres.map((n) => new Promise<string | null>((res) => {
      const i = new Image()
      i.onload = () => res(n)
      i.onerror = () => res(null)
      i.src = ruta(`${n}.jpg`)
    }))).then((l) => { if (vivo) setOk(l.filter(Boolean) as string[]) })
    return () => { vivo = false }
  }, [])
  return ok
}

// Título que aparece detrás de una línea menta, como un barrido de espejo.
export function Titulo({ texto, className = '', as = 'h2' }: { texto: string; className?: string; as?: 'h1' | 'h2' }) {
  const reducido = useReducedMotion()
  const T: any = motion[as]
  return (
    <T
      className={`barrer ${className}`}
      initial={reducido ? false : { clipPath: 'inset(-10% 100% -20% 0)' }}
      whileInView={{ clipPath: 'inset(-10% -2% -20% 0)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.15, ease: EASE }}
    >
      {texto}
    </T>
  )
}

export function Punto({ alto = 'var(--linea, 24vh)' }: { alto?: string }) {
  return <span className="punto" style={{ height: alto }} aria-hidden="true"><i /></span>
}

type Cache = { fotos: HTMLImageElement[]; carpeta: string; lista: boolean; promesa?: Promise<void> }
const memoria: Record<string, Cache> = {}

async function extraerEnNavegador(nombre: string, c: Cache, cuadros: number, avisar: (a: number) => void) {
  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'auto'
  v.src = ruta(`${nombre}.mp4`)
  await new Promise<void>((ok, mal) => {
    v.onloadeddata = () => ok()
    v.onerror = () => mal(new Error('video'))
    setTimeout(() => mal(new Error('tiempo')), 12000)
  })
  const vertical = innerHeight > innerWidth
  const W = vertical ? 540 : 1280
  const H = vertical ? 960 : 720
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const x = cv.getContext('2d')!
  const fin = Math.max(0.1, v.duration - 0.05)
  for (let i = 0; i < cuadros; i++) {
    await new Promise<void>((ok) => {
      const t = setTimeout(ok, 1500)
      v.onseeked = () => { clearTimeout(t); ok() }
      v.currentTime = (i / (cuadros - 1)) * fin
    })
    const s = Math.max(W / v.videoWidth, H / v.videoHeight)
    x.drawImage(v, (W - v.videoWidth * s) / 2, (H - v.videoHeight * s) / 2, v.videoWidth * s, v.videoHeight * s)
    const blob = await new Promise<Blob | null>((ok) => cv.toBlob(ok, 'image/webp', 0.72))
    if (blob) {
      const img = new Image()
      img.src = URL.createObjectURL(blob)
      c.fotos.push(img)
    }
    avisar((i + 1) / cuadros)
  }
}

export function cargarSecuencia(nombre: string, avisar: (a: number) => void = () => {}) {
  const carpeta = innerHeight > innerWidth ? 'm' : 'd'
  const previo = memoria[nombre]
  if (previo?.promesa) {
    if (previo.lista) avisar(1)
    return previo.promesa
  }
  const c: Cache = { fotos: [], carpeta, lista: false }
  memoria[nombre] = c
  const dato = (frames as Record<string, { total: number; ext: string }>)[nombre]
  c.promesa = (async () => {
    try {
      if (dato) {
        await new Promise<void>((listo) => {
          let listas = 0
          c.fotos = Array.from({ length: dato.total }, (_, i) => {
            const img = new Image()
            img.decoding = 'async'
            const fin = () => {
              listas += 1
              avisar(listas / dato.total)
              if (listas === dato.total) listo()
            }
            img.onload = fin
            img.onerror = fin
            img.src = `/frames/${nombre}/${carpeta}/${String(i + 1).padStart(4, '0')}.${dato.ext}`
            return img
          })
        })
      } else {
        await extraerEnNavegador(nombre, c, 72, avisar)
      }
    } catch {
      avisar(1)
    }
    c.lista = true
  })()
  return c.promesa
}

export function Secuencia({ nombre, avance, className = '' }: { nombre: string; avance: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reducido = useReducedMotion()
  useEffect(() => {
    let vivo = true
    let rf = 0
    let visible = false
    let actual = -1
    let suave = 0
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const medir = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5)
      cv.width = Math.round(cv.clientWidth * d)
      cv.height = Math.round(cv.clientHeight * d)
      actual = -1
    }
    const ob = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) cargarSecuencia(nombre)
    }, { rootMargin: '60% 0px' })
    ob.observe(cv)
    const ciclo = () => {
      if (!vivo) return
      const c = memoria[nombre]
      if (visible && c?.fotos.length) {
        const meta = (reducido ? 0 : avance.get()) * (c.fotos.length - 1)
        suave += (meta - suave) * 0.18
        if (Math.abs(meta - suave) < 0.02) suave = meta
        let i = Math.round(suave)
        while (i > 0 && !(c.fotos[i]?.complete && c.fotos[i]?.naturalWidth)) i -= 1
        const m = c.fotos[i]
        if (i !== actual && m?.complete && m.naturalWidth) {
          const s = Math.max(cv.width / m.naturalWidth, cv.height / m.naturalHeight)
          const w = m.naturalWidth * s
          const h = m.naturalHeight * s
          ctx.drawImage(m, (cv.width - w) / 2, (cv.height - h) / 2, w, h)
          actual = i
        }
      }
      rf = requestAnimationFrame(ciclo)
    }
    medir()
    addEventListener('resize', medir)
    rf = requestAnimationFrame(ciclo)
    return () => { vivo = false; cancelAnimationFrame(rf); ob.disconnect(); removeEventListener('resize', medir) }
  }, [nombre, reducido])
  return <canvas ref={ref} aria-hidden="true" className={className} />
}

export function Acordeon({ items }: { items: string[][] }) {
  const [abierta, setAbierta] = useState<number | null>(0)
  return (
    <div>
      {items.map(([p, r], i) => {
        const abierto = abierta === i
        return (
          <div key={p} className="acor">
            <button type="button" aria-expanded={abierto} onClick={() => setAbierta(abierto ? null : i)}>
              <span>{p}</span>
              <motion.b animate={{ rotate: abierto ? 45 : 0 }} aria-hidden="true">+</motion.b>
            </button>
            <motion.div initial={false} animate={{ height: abierto ? 'auto' : 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ overflow: 'hidden' }}>
              <p>{r}</p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
