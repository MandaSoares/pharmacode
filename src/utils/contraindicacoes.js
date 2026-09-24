import CONDICOES from '../data/condicoes';
import { normalizar } from './texto';

// "diabet*" -> /\bdiabet[a-z]*\b/   "rim" -> /\brim\b/
function termoParaRegex(termo) {
  const prefixo = termo.endsWith('*');
  const base = (prefixo ? termo.slice(0, -1) : termo).replace(/\s+/g, '\\s+');
  return new RegExp(`\\b${base}${prefixo ? '[a-z]*' : ''}\\b`);
}

// Procura as condicoes do perfil no texto livre de contraindicacoes (bulas da API).
// Retorna os ids encontrados e as frases da bula onde apareceram, para mostrar no Alerta.
export function encontrarCondicoesNoTexto(texto, condicoesUsuario = []) {
  if (!texto) return { condicoes: [], trechos: [] };

  // Uma frase por linha: quebra depois de . ; ! ? e nas quebras de linha
  const frases = texto.replace(/([.;!?])\s+/g, '$1\n').split(/\n+/).map(f => f.trim()).filter(Boolean);
  const condicoes = [];
  const trechos = [];

  for (const id of condicoesUsuario) {
    const condicao = CONDICOES.find(c => c.id === id);
    if (!condicao?.termos) continue;
    const regexes = condicao.termos.map(termoParaRegex);
    const frase = frases.find(f => regexes.some(r => r.test(normalizar(f))));
    if (frase) {
      condicoes.push(id);
      if (!trechos.includes(frase)) trechos.push(frase);
    }
  }
  return { condicoes, trechos };
}
