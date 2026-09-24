const MEDICAMENTOS = [
  {
    id: 'MED001',
    ean: '7896004800127',
    nome: 'Losartana Potassica 50mg',
    nomePopular: 'Remedio para pressao alta',
    subtitulo: 'Comprimido — Uso Oral',
    paraQueServe: 'Ajuda a baixar a pressao do sangue',
    comoTomar: [
      { icone: '💊', texto: '1 comprimido a cada 12 horas' },
      { icone: '⏰', texto: 'Tome sempre no mesmo horario' },
      { icone: '🥛', texto: 'Tome com 1 copo cheio de agua' },
    ],
    alertas: ['Nao tome se tiver alergia a sulfonamidas'],
    interacoes: ['Nao misturar com Ibuprofeno'],
    contraindicacoes: ['diabetes', 'insuficiencia_renal'],
    // Substancias que causam alergia (o nome do remedio ja e conferido automaticamente)
    alergenos: ['sulfonamidas'],
    horario: 'Manha e noite',
    dosagem: '50mg',
  },
  {
    id: 'MED002',
    ean: '7896382700012',
    nome: 'Metformina 850mg',
    nomePopular: 'Remedio para diabetes',
    subtitulo: 'Comprimido — Uso Oral',
    paraQueServe: 'Ajuda a controlar o acucar no sangue',
    comoTomar: [
      { icone: '💊', texto: '1 comprimido 2 vezes ao dia' },
      { icone: '🍽️', texto: 'Tome junto com a comida' },
      { icone: '🥛', texto: 'Tome com agua' },
    ],
    alertas: ['Pode causar dor de barriga no comeco'],
    interacoes: ['Cuidado com bebida alcoolica'],
    contraindicacoes: ['insuficiencia_renal', 'insuficiencia_hepatica'],
    alergenos: [],
    horario: 'Cafe da manha e jantar',
    dosagem: '850mg',
  },
  {
    id: 'MED003',
    ean: '7896015500015',
    nome: 'Omeprazol 20mg',
    nomePopular: 'Remedio para o estomago',
    subtitulo: 'Capsula — Uso Oral',
    paraQueServe: 'Protege o estomago e reduz a azia',
    comoTomar: [
      { icone: '💊', texto: '1 capsula por dia' },
      { icone: '⏰', texto: 'Tome de manha, em jejum' },
      { icone: '🚫', texto: 'Nao mastigue a capsula' },
    ],
    alertas: ['Nao use por mais de 8 semanas sem orientacao medica'],
    interacoes: ['Pode reduzir efeito do Clopidogrel'],
    contraindicacoes: [],
    alergenos: [],
    horario: 'Manha (jejum)',
    dosagem: '20mg',
  },
];

export function buscarPorEAN(ean) {
  return MEDICAMENTOS.find(m => m.ean === ean) || null;
}

export function buscarPorId(id) {
  return MEDICAMENTOS.find(m => m.id === id) || null;
}

export default MEDICAMENTOS;
