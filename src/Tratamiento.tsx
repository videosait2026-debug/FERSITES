import { motion } from 'motion/react'
import { tratamientos } from './contenido'
import { Acordeon, EASE, Foto, Punto, Titulo, Video, wa } from './lib'

type Ir = (h: string, e: { clientX: number; clientY: number }) => void

export default function Tratamiento({ t, ir }: { t: (typeof tratamientos)[number]; ir: Ir }) {
  const i = tratamientos.findIndex((x) => x.slug === t.slug)
  const sig = tratamientos[(i + 1) % tratamientos.length]
  return (
    <main key={t.slug}>
      <section className="tr-h">
        <Video n={`esp-${t.slug}`} className="lleno cubre" />
        <div className="lleno tr-v" />
        <Punto alto="18vh" />
        <div className="tr-ht">
          <button type="button" className="enlace" onClick={(e) => ir('#/', e)}>Todas las especialidades</button>
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>{t.nombre}</motion.h1>
          <p className="lead">{t.frase}</p>
        </div>
      </section>
      <section className="tr-a" data-claro>
        <div>
          <Titulo texto="Qué resuelve" />
          <p className="lead">{t.resuelve}</p>
          <a className="btn oscuro" href={wa(`Hola, quiero información sobre ${t.nombre}.`)} target="_blank" rel="noreferrer">Preguntar por {t.nombre.toLowerCase()}</a>
        </div>
        <div className="tr-img"><Foto n={`esp-${t.slug}`} alt="" className="lleno cubre" /></div>
      </section>
      <section className="tr-b">
        <Titulo texto="Te conviene si" />
        <ul>{t.indicado.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
      <section className="tr-c" data-claro>
        <Titulo texto="Cómo es el proceso" />
        <div className="tr-p">
          {t.proceso.map(([a, b]) => (
            <motion.article key={a} initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
              <h3>{a}</h3>
              <p>{b}</p>
            </motion.article>
          ))}
        </div>
        <p className="nota">El doctor confirma tu plan después de evaluarte.</p>
      </section>
      <section className="dud" data-claro>
        <Titulo texto="Preguntas frecuentes" />
        <Acordeon items={t.preguntas} />
      </section>
      <button type="button" data-ver className="tr-s" onClick={(e) => ir(`#/tratamiento/${sig.slug}`, e)}>
        <Foto n={`esp-${sig.slug}`} alt="" className="lleno cubre" />
        <span className="lleno tr-v" />
        <span className="tr-st"><span className="lead">Siguiente</span><strong>{sig.nombre}</strong></span>
      </button>
    </main>
  )
}
