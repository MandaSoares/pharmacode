// termos: palavras (sem acento) procuradas no texto de contraindicacoes das bulas da API.
// Sem *, precisa ser a palavra inteira ("sulfa" nao acha "sulfato").
// Com * no fim, aceita qualquer final ("diabet*" acha diabetes, diabetico, diabetica).
const CONDICOES = [
  { id: 'diabetes', label: 'Diabetes', icone: '🔵', termos: ['diabet*'] },
  { id: 'hipertensao', label: 'Hipertensao (pressao alta)', icone: '❤️', termos: ['hipertens*', 'pressao alta'] },
  { id: 'colesterol_alto', label: 'Colesterol alto', icone: '🟡', termos: ['colesterol', 'hipercolesterolemia', 'dislipidemia*'] },
  { id: 'insuficiencia_renal', label: 'Problema nos rins', icone: '🟣', termos: ['renal', 'renais', 'rins', 'rim', 'nefropatia*'] },
  { id: 'insuficiencia_hepatica', label: 'Problema no figado', icone: '🟤', termos: ['hepat*', 'figado', 'cirrose'] },
  { id: 'asma', label: 'Asma ou bronquite', icone: '🫁', termos: ['asma', 'asmatic*', 'bronquite', 'broncoespasmo'] },
  { id: 'gastrite', label: 'Gastrite ou ulcera', icone: '🟠', termos: ['gastrite', 'ulcera*', 'sangramento gastr*'] },
  { id: 'alergia_sulfa', label: 'Alergia a sulfonamidas', icone: '⚪', termos: ['sulfonamida*', 'sulfa'] },
];

export default CONDICOES;
