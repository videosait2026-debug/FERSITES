import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { agenda, capitulos, cita, doctora, marca, preguntas, sintomas, testimonios, tratamientos, ubicacion } from './contenido'
import { Acordeon, cargarSecuencia, EASE, Foto, Punto, Secuencia, Titulo, useExisten, Video, VideoScroll, wa } from './lib'
import Mapa from './Mapa'

type Ir = (h: string, e: { clientX: number; clientY: number }) => void
const trat = (s: string) => tratamientos.find((t) => t.slug === s)!

function Carga() {
  const [a, setA] = useState(0)
  const [fuera, setFuera] = useState(false)
  useEffect(() => {
    const limite = setTimeout(() => setFuera(true), 9000)
    cargarSecuencia('hook', (v) => setA(v)).then(() => setFuera(true))
    return () => clearTimeout(limite)
  }, [])
  const c = 2 * Math.PI * 46
  return (
    <AnimatePresence>
      {!fuera && (
        <motion.div className="carga" exit={{ clipPath: 'circle(0% at 50% 50%)' }} transition={{ duration: 0.9, ease: EASE }} style={{ clipPath: 'circle(120% at 50% 50%)' }}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#12383B" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#57BFAE" strokeWidth="1.5" strokeDasharray={c} strokeDashoffset={c * (1 - a)} transform="rotate(-90 50 50)" />
          </svg>
          <p>Preparando tu consulta</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Capitulo({ avance, c }: { avance: MotionValue<number>; c: (typeof capitulos)[number] }) {
  const opacity = useTransform(avance, [c.desde, c.desde + 0.03, c.hasta - 0.03, c.hasta], [0, 1, 1, 0])
  const y = useTransform(avance, [c.desde, c.desde + 0.05, c.hasta], [50, 0, -30])
  return (
    <motion.div className={`capi ${c.lado}`} style={{ opacity, y }}>
      <h2>{c.titulo}</h2>
      <p>{c.texto}</p>
    </motion.div>
  )
}

function Hook() {
  const zona = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start start', 'end end'] })
  const arriba = useTransform(p, [0, 0.16], ['0vh', '-62vh'])
  const abajo = useTransform(p, [0, 0.16], ['0vh', '62vh'])
  const pie = useTransform(p, [0, 0.07], [1, 0])
  const velo = useTransform(p, [0.86, 0.97], [0, 1])
  const cierre = useTransform(p, [0.9, 0.97], [0, 1])
  const n = marca.palabra.length
  return (
    <section ref={zona} className="hook" aria-label="Presentación">
      <div className="fijo">
        <VideoScroll n="hook" avance={p} className="lleno" />
        <div className="lleno hook-velo" />

        <h1 className="palabra" aria-label={marca.palabra} style={{ fontSize: `min(${Math.min(150 / n, 26)}vw, 42vh, 340px)` }}>
          <motion.span aria-hidden="true" className="pal-a" style={{ y: arriba }}>{marca.palabra}</motion.span>
          <motion.span aria-hidden="true" className="pal-b" style={{ y: abajo }}>{marca.palabra}</motion.span>
        </h1>
        <motion.div className="hook-arr" style={{ opacity: pie }}>
          <p>{marca.pregunta}</p>
        </motion.div>
        <motion.div className="hook-pie" style={{ opacity: pie }}>
          <span className="franja">{marca.franja}</span>
          <p>{marca.frase}</p>
          <a className="btn menta" href={wa('Hola, quiero agendar una revisión.')} target="_blank" rel="noreferrer">Agendar revisión</a>
        </motion.div>
        {capitulos.map((c) => <Capitulo key={c.titulo} avance={p} c={c} />)}
        <motion.div className="lleno negro" style={{ opacity: velo }} />
        <motion.p className="hook-fin" style={{ opacity: cierre }}>¿Y tú qué ves?</motion.p>
      </div>
    </section>
  )
}

function Sintomas({ ir }: { ir: Ir }) {
  const zona = useRef<HTMLElement>(null)
  const [est, setEst] = useState({ a: 0, b: 0 })
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start start', 'end end'] })
  const cambiar = (i: number) => setEst((e) => (e.a === i ? e : { a: i, b: e.a }))
  useMotionValueEvent(p, 'change', (v) => cambiar(Math.min(sintomas.length - 1, Math.floor(v * sintomas.length))))
  const elegir = (i: number) => {
    const z = zona.current!
    const t = z.offsetHeight - innerHeight
    if (t > 40) scrollTo({ top: z.offsetTop + t * ((i + 0.5) / sintomas.length), behavior: 'smooth' })
    else cambiar(i)
  }
  const activo = trat(sintomas[est.a].trat)
  return (
    <section ref={zona} className="sint" id="espejo">
      <div className="fijo">
        {sintomas.map((s, i) => (
          <div key={s.trat} className="sint-foto" data-e={i === est.a ? 'on' : i === est.b ? 'pre' : ''}>
            <Foto n={`esp-${s.trat}`} alt="" className="lleno cubre" />
          </div>
        ))}
        <div className="lleno sint-velo" />
        <Punto />
        <div className="sint-cab"><h2>¿Qué ves en el espejo?</h2></div>
        <div className="sint-lista">
          {sintomas.map((s, i) => (
            <button key={s.trat} type="button" className={i === est.a ? 'on' : ''} aria-pressed={i === est.a} onClick={() => elegir(i)}>{s.frase}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activo.slug} className="sint-res" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <span className="franja">{activo.nombre}</span>
            <p>{activo.frase}</p>
            <button type="button" className="enlace" onClick={(e) => ir(`#/tratamiento/${activo.slug}`, e)}>Ver cómo se resuelve</button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

const TAMS = ['g', 'p', 'm', 'g', 'p', 'm', 'g', 'p']

function Carril({ ir }: { ir: Ir }) {
  const zona = useRef<HTMLElement>(null)
  const pista = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start start', 'end end'] })
  useLayoutEffect(() => {
    const medir = () => setDist(innerHeight < 500 ? 0 : Math.max(0, pista.current!.scrollWidth - innerWidth))
    medir()
    addEventListener('resize', medir)
    return () => removeEventListener('resize', medir)
  }, [])
  const x = useTransform(p, [0, 1], [0, -dist])
  return (
    <section ref={zona} className="carril" id="especialidades" data-claro>
      <div className="fijo">
        <motion.div ref={pista} className="pista" style={{ x }}>
          <div className="carr-cab">
            <h2>Todo lo que tu boca puede necesitar, en un solo lugar.</h2>
            <p>Ocho especialidades con el mismo criterio: primero entender, después tratar.</p>
          </div>
          {tratamientos.map((t, i) => (
            <button key={t.slug} type="button" data-ver className={`pieza ${TAMS[i]} ${i % 2 ? 'baja' : 'alta'}`} onClick={(e) => ir(`#/tratamiento/${t.slug}`, e)}>
              <span className="pieza-m"><Video n={`esp-${t.slug}`} className="lleno cubre" /></span>
              <strong>{t.nombre}</strong>
              <span className="pieza-f">{t.frase}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Transformacion() {
  const zona = useRef<HTMLElement>(null)
  const reducido = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start start', 'end end'] })
  const radio = useTransform(p, [0, 0.28], [22, 150])
  const clipIni = useMotionTemplate`circle(${radio}vmin at 50% 50%)`
  const aro = useTransform(p, [0.14, 0.26], [1, 0])
  const esc = useTransform(p, [0, 0.28], [1, 7])
  const avance = useTransform(p, [0.28, 0.92], [0, 1], { clamp: true })
  const a = useTransform(p, [0.04, 0.1, 0.42, 0.5], [0, 1, 1, 0])
  const b = useTransform(p, [0.56, 0.64, 0.9, 1], [0, 1, 1, 1])
  return (
    <section ref={zona} className="trans" aria-label="Antes y después">
      <div className="fijo">
        <motion.div className="lleno" style={reducido ? undefined : { clipPath: clipIni }}>
          <Secuencia nombre="transformacion" avance={avance} className="lleno" />
          <div className="lleno trans-velo" />
        </motion.div>
        <motion.div className="aro" style={{ opacity: aro, scale: esc }} aria-hidden="true" />
        <motion.div className="trans-t izq" style={{ opacity: a }}><h2>Así llegó.</h2><p>Sarro, una caries y años sin revisión.</p></motion.div>
        <motion.div className="trans-t der" style={{ opacity: b }}><h2>Así se fue.</h2><p>El mismo diente, con su forma de siempre.</p></motion.div>
      </div>
    </section>
  )
}

function Comparador() {
  const caja = useRef<HTMLDivElement>(null)
  const mover = (v: string) => caja.current!.style.setProperty('--x', `${v}%`)
  return (
    <section className="comp" data-claro>
      <div className="comp-cab">
        <Titulo texto="Compáralo tú mismo." />
        <p className="lead">{`Arrastra la línea. Casos reales documentados con autorización del paciente.`}</p>
      </div>
      <div className="comp-caja" ref={caja}>
        <Foto n="despues" alt="Después del tratamiento" className="lleno cubre" />
        <div className="comp-a"><Foto n="antes" alt="Antes del tratamiento" className="lleno cubre" /></div>
        <div className="comp-l"><b /></div>
        <span className="comp-e i">Antes</span><span className="comp-e d">Después</span>
        <input type="range" min="0" max="100" defaultValue="50" aria-label="Comparar antes y después" onInput={(e) => mover((e.target as HTMLInputElement).value)} />
      </div>
    </section>
  )
}

function Cita() {
  const [a, setA] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const ob = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setA(refs.current.indexOf(e.target as HTMLElement)) }), { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach((r) => r && ob.observe(r))
    return () => ob.disconnect()
  }, [])
  return (
    <section className="cita" data-claro>
      <Titulo texto="Tu primera cita no empieza en el sillón." className="cita-t" />
      <div className="cita-g">
        <div className="cita-fija">
          {cita.map((c, i) => <div key={c.titulo} className="cita-f" data-on={i === a}><Foto n={`cita-${i + 1}`} alt="" className="lleno cubre" /></div>)}
        </div>
        <div>
          {cita.map((c, i) => (
            <article key={c.titulo} ref={(r) => { refs.current[i] = r }}>
              <div className="cita-m"><Foto n={`cita-${i + 1}`} alt="" className="lleno cubre" /></div>
              <h3>{c.titulo}</h3>
              <p className="lead">{c.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Doctora() {
  const zona = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: zona, offset: ['start end', 'end start'] })
  const y = useTransform(p, [0, 1], ['-8%', '8%'])
  return (
    <section ref={zona} className="doc" id="doctora">
      <div className="doc-m"><motion.div className="doc-in" style={{ y }}><Foto n="doctora" alt={marca.doctora} className="lleno cubre" /></motion.div></div>
      <div className="doc-t">
        <span className="franja">{marca.especialidad}</span>
        <Titulo texto={marca.doctora} />
        <p className="lead">{doctora.bio}</p>
        <ul>{doctora.credenciales.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </section>
  )
}

function Galeria() {
  const ok = useExisten(['galeria-1', 'galeria-2', 'galeria-3', 'galeria-4'])
  if (!ok.length) return null
  return (
    <section className="gal" aria-label="El consultorio">
      <Titulo texto="Un lugar donde se puede respirar." className="gal-t" />
      <div className="gal-g">
        {ok.map((n, i) => (
          <motion.div key={n} className={`gal-c c${i}`} initial={{ clipPath: 'inset(100% 0 0 0)' }} whileInView={{ clipPath: 'inset(0% 0 0 0)' }} viewport={{ once: true, margin: '-6% 0px' }} transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}>
            <Foto n={n} alt="" className="lleno cubre" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Testimonios() {
  if (!testimonios.length) return null
  return (
    <section className="test">
      {testimonios.map((t) => <figure key={t.autor}><blockquote>{t.texto}</blockquote><figcaption>{t.autor}</figcaption></figure>)}
    </section>
  )
}

function Chips({ titulo, valores, valor, cambiar }: { titulo: string; valores: string[]; valor: string; cambiar: (v: string) => void }) {
  return (
    <fieldset>
      <legend>{titulo}</legend>
      <div className="chips">
        {valores.map((v) => <button key={v} type="button" aria-pressed={v === valor} className={v === valor ? 'on' : ''} onClick={() => cambiar(v)}>{v}</button>)}
      </div>
    </fieldset>
  )
}

function Agenda() {
  const [motivo, setMotivo] = useState(tratamientos[5].nombre)
  const [dia, setDia] = useState(agenda.dias[1])
  const [hora, setHora] = useState(agenda.horas[0])
  return (
    <section className="age" id="agendar">
      <Foto n="galeria-1" alt="" className="lleno cubre age-f" />
      <div className="lleno age-v" />
      <div className="age-in">
        <div>
          <Titulo texto="Hoy puede ser el día que dejes de posponerlo." />
          <a className="btn coral" href={wa('Hola, me duele ahora y necesito atención lo antes posible.')} target="_blank" rel="noreferrer">Me duele ahora</a>
        </div>
        <div className="age-f2">
          <Chips titulo="Qué necesitas" valores={tratamientos.map((t) => t.nombre)} valor={motivo} cambiar={setMotivo} />
          <Chips titulo="Día" valores={agenda.dias} valor={dia} cambiar={setDia} />
          <Chips titulo="Horario" valores={agenda.horas} valor={hora} cambiar={setHora} />
          <a className="btn menta" href={wa(`Hola, quiero una cita para ${motivo}, el ${dia}, por la ${hora.toLowerCase()}.`)} target="_blank" rel="noreferrer">Quiero una cita</a>
        </div>
      </div>
    </section>
  )
}

export default function Inicio({ ir }: { ir: Ir }) {
  return (
    <main>
      <Carga />
      <Hook />
      <Sintomas ir={ir} />
      <Carril ir={ir} />
      <Transformacion />
      <Comparador />
      <Cita />
      <Doctora />
      <Galeria />
      <Testimonios />
      {ubicacion.activo && <Mapa />}
      <Agenda />
      <section className="dud" data-claro>
        <Titulo texto="Lo que nadie se anima a preguntar." />
        <Acordeon items={preguntas} />
      </section>
    </main>
  )
}
