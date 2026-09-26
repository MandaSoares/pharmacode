import { normalizar } from './texto';

// Retorna as alergias do usuario que batem com o remedio (nome ou alergenos).
// Compara nos dois sentidos para aceitar singular/plural: "sulfonamida" x "sulfonamidas".
export function encontrarAlergias(medicamento, alergiasUsuario = []) {
  const termos = [medicamento.nome, ...(medicamento.alergenos || [])].map(normalizar);
  return alergiasUsuario.filter(alergia => {
    const a = normalizar(alergia);
    if (a.length < 3) return false;
    return termos.some(t => t.includes(a) || a.includes(t));
  });
}
