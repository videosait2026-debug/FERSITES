// Datos del negocio. Es el único archivo que cambia entre un cliente y otro.
export const marca = {
  nombre: 'FER SITES',
  palabra: 'Sonríe',
  pregunta: '¿Cuándo fue tu última revisión?',
  franja: 'Odontología integral y avanzada en el Salar de Uyuni',
  frase: 'Ortodoncia, carillas, curaciones, implantes y estética dental de vanguardia con atención personalizada y tecnología de punta.',
  doctora: 'Dr. Fer Sites',
  especialidad: 'Odontología Integral y Rehabilitación Oral',
  whatsapp: '59170000000',
  direccion: 'Av. Ferroviaria esq. Potosí s/n, Uyuni, Potosí, Bolivia',
  horario: ['Lunes a viernes, 9:00 a 19:00', 'Sábados, 9:00 a 14:00'],
  aviso: 'Atención odontológica integral en Uyuni, Bolivia. Previa cita y urgencias.',
}

export const ubicacion = {
  activo: true,
  origen: { nombre: 'Torre del Reloj de Uyuni', lat: -20.4638, lng: -66.8252 },
  destino: { nombre: 'Clínica FER SITES', lat: -20.4605, lng: -66.8228 },
}

export const capitulos = [
  { desde: 0.2, hasta: 0.38, lado: 'izq', titulo: 'Por fuera, todo parece bien.', texto: 'Y ese suele ser el problema.' },
  { desde: 0.44, hasta: 0.62, lado: 'der', titulo: 'El espejo ve lo que tú no.', texto: 'Una revisión encuentra lo que todavía no duele.' },
  { desde: 0.68, hasta: 0.84, lado: 'izq', titulo: 'Cada boca pide algo distinto.', texto: 'Por eso aquí se resuelve todo en un mismo lugar.' },
]

export const sintomas = [
  { frase: 'Tengo los dientes torcidos', trat: 'ortodoncia' },
  { frase: 'No me gusta su forma', trat: 'carillas' },
  { frase: 'Tengo una caries', trat: 'curaciones' },
  { frase: 'Me falta una pieza', trat: 'implantes' },
  { frase: 'Me duele y no se pasa', trat: 'endodoncia' },
  { frase: 'Me sangran las encías', trat: 'limpieza' },
  { frase: 'Los quiero más claros', trat: 'blanqueamiento' },
  { frase: 'Es para mi hijo', trat: 'ninos' },
]

export const tratamientos = [
  { slug: 'ortodoncia', nombre: 'Ortodoncia', frase: 'Los dientes se mueven. Solo necesitan dirección.', resuelve: 'Corrige dientes apiñados, separados o una mordida que no cierra bien, con brackets o alineadores transparentes.', indicado: ['Dientes torcidos o encimados', 'Espacios entre dientes', 'Mordida cruzada o abierta', 'Desgaste por mala mordida'], proceso: [['Estudio', 'Fotos, radiografías y medidas para planificar cada movimiento.'], ['Plan', 'Eliges entre brackets y alineadores, con tiempos claros.'], ['Controles', 'Citas periódicas para ajustar y revisar el avance.'], ['Retención', 'Un retenedor mantiene el resultado.']], preguntas: [['¿Soy muy grande para usar ortodoncia?', 'No hay edad límite si los dientes y las encías están sanos.'], ['¿Se notan los alineadores?', 'Son transparentes y casi no se ven a la distancia normal de una conversación.']] },
  { slug: 'carillas', nombre: 'Carillas', frase: 'La forma que tus dientes no tuvieron.', resuelve: 'Láminas delgadas de porcelana o resina que cambian la forma, el tamaño y el tono de los dientes visibles.', indicado: ['Dientes cortos o desparejos', 'Manchas que no aclaran', 'Bordes astillados', 'Pequeños espacios'], proceso: [['Diseño', 'Vemos cómo quedaría tu sonrisa antes de tocar un diente.'], ['Preparación', 'Se prepara el esmalte solo lo necesario.'], ['Prueba', 'Revisas forma y color antes de la colocación final.'], ['Cementado', 'Se fijan y se ajusta la mordida.']], preguntas: [['¿Se ven artificiales?', 'Depende del diseño. Por eso se prueban antes de colocarlas.'], ['¿Cuánto duran?', 'Varía según el material y tus cuidados. Te lo explicamos en la evaluación.']] },
  { slug: 'curaciones', nombre: 'Curaciones', frase: 'La caries se va. El diente se queda.', resuelve: 'Se retira el tejido dañado y se reconstruye el diente con resina del mismo tono.', indicado: ['Caries pequeñas o medianas', 'Curaciones antiguas filtradas', 'Sensibilidad al frío o al dulce', 'Dientes fracturados'], proceso: [['Diagnóstico', 'Se ubica la lesión y su profundidad.'], ['Limpieza', 'Se retira solo lo que está dañado.'], ['Reconstrucción', 'La resina se coloca por capas.'], ['Pulido', 'Se ajusta la mordida y queda liso.']], preguntas: [['¿Me va a doler?', 'Usamos anestesia cuando hace falta y te avisamos cada paso.'], ['¿Se puede cambiar una curación negra?', 'Sí, si el diente lo permite se reemplaza por resina del color del diente.']] },
  { slug: 'implantes', nombre: 'Implantes', frase: 'Donde había un hueco, vuelve a haber un diente.', resuelve: 'Un pilar de titanio reemplaza la raíz y sostiene una corona a medida, sin desgastar los dientes vecinos.', indicado: ['Una o varias piezas perdidas', 'Prótesis que se mueven', 'Hueso suficiente o regenerable', 'Encías sanas'], proceso: [['Evaluación', 'Tomografía para medir el hueso disponible.'], ['Colocación', 'Cirugía con anestesia local.'], ['Integración', 'El hueso se une al implante durante algunos meses.'], ['Corona', 'Se coloca la pieza definitiva.']], preguntas: [['¿Cualquiera puede ponerse un implante?', 'Depende del hueso y de tu salud general. Primero se evalúa.'], ['¿Duele la cirugía?', 'Se hace con anestesia y te indicamos cómo manejar las molestias posteriores.']] },
  { slug: 'endodoncia', nombre: 'Endodoncia', frase: 'Para cuando ya llegó al nervio.', resuelve: 'Se limpia el interior del diente y se sellan sus conductos para eliminar el dolor y conservarlo.', indicado: ['Dolor intenso o espontáneo', 'Sensibilidad que no se va', 'Infección o absceso', 'Diente oscurecido'], proceso: [['Radiografía', 'Se evalúan los conductos y la infección.'], ['Anestesia', 'La zona queda dormida.'], ['Limpieza', 'Se desinfecta el interior del diente.'], ['Sellado', 'Se cierran los conductos y se restaura.']], preguntas: [['¿Es mejor sacar el diente?', 'Conservar tu propio diente suele ser la primera opción cuando es posible.'], ['¿Cuántas citas son?', 'Depende del caso. Te lo confirmamos después de evaluarte.']] },
  { slug: 'limpieza', nombre: 'Limpieza y encías', frase: 'Lo que el cepillo ya no alcanza.', resuelve: 'Retira el sarro y trata la inflamación de las encías para frenar el sangrado y proteger el hueso.', indicado: ['Encías que sangran', 'Mal aliento persistente', 'Sarro visible', 'Más de seis meses sin limpieza'], proceso: [['Revisión', 'Se mide la salud de las encías.'], ['Retiro de sarro', 'Con ultrasonido, también bajo la encía si hace falta.'], ['Pulido', 'Una superficie lisa acumula menos placa.'], ['Plan', 'Te indicamos la frecuencia para tu caso.']], preguntas: [['¿La limpieza daña el esmalte?', 'No, cuando la realiza un profesional con la técnica adecuada.'], ['¿Cada cuánto debo hacerla?', 'Lo habitual es cada seis meses, pero depende de tus encías.']] },
  { slug: 'blanqueamiento', nombre: 'Blanqueamiento', frase: 'Solo después de que todo esté sano.', resuelve: 'Aclara el tono natural del esmalte con productos supervisados por el doctor.', indicado: ['Dientes amarillentos', 'Manchas por café o tabaco', 'Dientes y encías sanos', 'Antes de un evento'], proceso: [['Revisión', 'Se tratan antes caries o encías inflamadas.'], ['Tono inicial', 'Se registra para comparar.'], ['Aplicación', 'En consultorio o con férulas en casa.'], ['Cuidados', 'Te indicamos qué evitar los primeros días.']], preguntas: [['¿Aclara las carillas o resinas?', 'No. El producto actúa sobre el esmalte natural.'], ['¿Da sensibilidad?', 'Puede dar una sensibilidad temporal, y hay formas de reducirla.']] },
  { slug: 'ninos', nombre: 'Niños', frase: 'Que su primer dentista no le dé miedo.', resuelve: 'Controles, flúor, sellantes y curaciones para dientes de leche, con el tiempo que un niño necesita.', indicado: ['Primera visita al dentista', 'Manchas en dientes de leche', 'Sellado preventivo', 'Golpes en los dientes'], proceso: [['Conocerse', 'La primera cita es para que entre en confianza.'], ['Revisión', 'Se mira cada diente con calma.'], ['Prevención', 'Flúor y sellantes cuando corresponde.'], ['Hábitos', 'Consejos para casa, con los padres presentes.']], preguntas: [['¿A qué edad es la primera visita?', 'Se recomienda con los primeros dientes, alrededor del primer año.'], ['¿Vale la pena curar dientes de leche?', 'Sí. Guardan el espacio de los definitivos y evitan dolor e infecciones.']] },
]

export const cita = [
  { titulo: 'Te escuchamos', texto: 'Antes de sentarte en el sillón, nos cuentas qué te molesta, qué te da miedo y qué quisieras cambiar.' },
  { titulo: 'Miramos juntos', texto: 'Revisión completa con espejo y cámara intraoral en pantalla de alta definición. Ves exactamente lo mismo que ve el doctor.' },
  { titulo: 'Tú decides', texto: 'Recibes las opciones, los tiempos y el costo por escrito. No se empieza nada sin tu visto bueno.' },
]

export const doctora = {
  bio: 'Atiende cada caso con visión integral y precisión milimétrica. En el corazón de Uyuni, combinamos calidez humana y tecnología de punta para que sonrías con total seguridad.',
  credenciales: ['Especialista en Rehabilitación Oral y Estética', 'Más de 10 años devolviendo sonrisas en Uyuni y Potosí', 'Miembro del Colegio de Odontólogos de Bolivia'],
}

// Bloque de testimonios con pacientes atendidos en la región
export const testimonios: { texto: string; autor: string }[] = [
  { texto: 'Viajé a Uyuni con un dolor insoportable y el Dr. Fer Sites me atendió de urgencia con un profesionalismo impecable.', autor: 'Carlos M. — La Paz' },
  { texto: 'Me colocaron carillas y el resultado superó todas mis expectativas, se ven completamente naturales.', autor: 'Elena R. — Potosí' },
]

export const agenda = {
  dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  horas: ['Mañana', 'Mediodía', 'Tarde'],
}

export const preguntas = [
  ['Le tengo miedo al dentista. ¿Qué hago?', 'Dilo en tu primer mensaje. La primera cita puede ser solo para conversar y mirar, sin tratamiento ni dolor.'],
  ['¿Cuánto cuesta la primera consulta?', 'Escríbenos a nuestro WhatsApp y te lo confirmamos antes de agendar. Cada tratamiento se presupuesta de forma transparente después de evaluarte.'],
  ['¿Atienden urgencias en Uyuni?', 'Sí. Si tienes dolor agudo o una emergencia dental en Uyuni o alrededores, contáctanos por WhatsApp y te atenderemos con prioridad.'],
  ['¿Puedo traer a toda mi familia?', 'Sí. Atendemos desde la primera visita preventiva de los niños hasta ortodoncia, implantes y prótesis para adultos.'],
]
