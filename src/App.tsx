import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { marca, tratamientos } from './contenido'
import { EASE, wa } from './lib'
import Inicio from './Inicio'
import Tratamiento from './Tratamiento'

const ENLACES = [['espejo', '¿Qué ves?'], ['especialidades', 'Especialidades'], ['doctora', 'El doctor'], ['ubicacion', 'Ubicación'], ['agendar', 'Agendar']]

function Lente() {
  const n = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let x = 0, y = 0, a = 0, b = 0, r = 0
    const m = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const el = n.current!
      const t = e.target as Element
      el.style.opacity = '1'
      el.dataset.g = t.closest('a,button,input') ? '1' : ''
      el.dataset.v = t.closest('[data-ver]') ? '1' : ''
    }
    const c = () => {
      a += (x - a) * 0.17
      b += (y - b) * 0.17
      if (n.current) n.current.style.transform = `translate3d(${a}px,${b}px,0)`
      r = requestAnimationFrame(c)
    }
    addEventListener('mousemove', m)
    c()
    return () => { removeEventListener('mousemove', m); cancelAnimationFrame(r) }
  }, [])
  return <div className="lente" ref={n} aria-hidden="true"><i /><span>Ver</span></div>
}

function Pie({ ir }: { ir: (id: string) => void }) {
  return (
    <footer className="pie">
      <p className="pie-g">{marca.pregunta}</p>
      <button type="button" className="btn menta" onClick={() => ir('agendar')}>Agendar revisión</button>
      <div className="pie-d">
        <div><strong>{marca.nombre}</strong><p>{marca.direccion}</p></div>
        <div>{marca.horario.map((h) => <p key={h}>{h}</p>)}</div>
        <div>{tratamientos.slice(0, 4).map((t) => <a key={t.slug} href={`#/tratamiento/${t.slug}`}>{t.nombre}</a>)}</div>
        <div>{tratamientos.slice(4).map((t) => <a key={t.slug} href={`#/tratamiento/${t.slug}`}>{t.nombre}</a>)}</div>
      </div>
      <p className="nota">{marca.aviso} La información de este sitio es general y no reemplaza una evaluación profesional.</p>
    </footer>
  )
}

export default function App() {
  const [hash, setHash] = useState(location.hash)
  const [menu, setMenu] = useState(false)
  const [claro, setClaro] = useState(false)
  const iris = useRef<HTMLDivElement>(null)
  const reducido = useReducedMotion()

  useEffect(() => {
    const f = () => { setHash(location.hash); scrollTo(0, 0) }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])

  useEffect(() => {
    let r = 0
    const medir = () => {
      r = 0
      setClaro(Array.from(document.querySelectorAll('[data-claro]')).some((e) => {
        const q = e.getBoundingClientRect()
        return q.top < 40 && q.bottom > 40
      }))
    }
    const on = () => { if (!r) r = requestAnimationFrame(medir) }
    addEventListener('scroll', on, { passive: true })
    medir()
    return () => removeEventListener('scroll', on)
  }, [hash])

  const ir = (h: string, e: { clientX: number; clientY: number }) => {
    const fin = () => {
      location.hash = h
      if (h === '#/') setTimeout(() => document.getElementById('especialidades')?.scrollIntoView(), 140)
    }
    const n = iris.current
    if (reducido || !n) return fin()
    n.style.left = `${e.clientX}px`
    n.style.top = `${e.clientY}px`
    n.classList.add('on')
    setTimeout(fin, 520)
    setTimeout(() => n.classList.remove('on'), 640)
  }

  const a = (id: string) => {
    setMenu(false)
    if (hash.startsWith('#/tratamiento/')) {
      location.hash = '#/'
      setTimeout(() => document.getElementById(id)?.scrollIntoView(), 180)
    } else document.getElementById(id)?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' })
  }

  const t = tratamientos.find((x) => hash === `#/tratamiento/${x.slug}`)
  return (
    <>
      <header className={`cab ${claro && !menu ? 'claro' : ''}`}>
        <a href="#/" className="marca" onClick={() => { setMenu(false); scrollTo(0, 0) }}>{marca.nombre}</a>
        <nav aria-label="Principal">{ENLACES.map(([id, l]) => <button key={id} type="button" onClick={() => a(id)}>{l}</button>)}</nav>
        <button type="button" className="cab-m" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? 'Cerrar' : 'Menú'}</button>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div className="menu" initial={{ clipPath: 'circle(0% at 92% 40px)' }} animate={{ clipPath: 'circle(150% at 92% 40px)' }} exit={{ clipPath: 'circle(0% at 92% 40px)' }} transition={{ duration: 0.7, ease: EASE }}>
            {ENLACES.map(([id, l]) => <button key={id} type="button" onClick={() => a(id)}>{l}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
      {t ? <Tratamiento t={t} ir={ir} /> : <Inicio ir={ir} />}
      <Pie ir={a} />
      <a className="barra" href={wa('Hola, quiero agendar una revisión.')} target="_blank" rel="noreferrer">Agendar por WhatsApp</a>
      <div className="iris" ref={iris} aria-hidden="true" />
      <Lente />
    </>
  )
}
