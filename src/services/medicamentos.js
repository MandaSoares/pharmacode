import { buscarPorEAN } from '../data/medicamentos';
import { normalizar } from '../utils/texto';

// Endereco da API (backend PharmaCode-UPX2026), definido no arquivo .env:
//   EXPO_PUBLIC_API_URL=http://<endereco-no-tailscale>:8080
// Sem essa variavel, o app usa os dados de exemplo de src/data/medicamentos.js.
const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
const TEMPO_LIMITE_MS = 10000;

export class ErroConexao extends Error {}

// Resultado:
//   { status: 'ok', medicamento }        -> abrir a Bula
//   { status: 'nao_encontrado' }         -> EAN nao cadastrado
//   { status: 'em_revisao', nome }       -> remedio cadastrado, bula ainda nao revisada
// Lanca ErroConexao se o servidor nao responder.
export async function buscarMedicamento(ean) {
  if (!API_URL) {
    if (__DEV__) console.log('[API] EXPO_PUBLIC_API_URL vazio: usando os remedios de exemplo');
    const medicamento = buscarPorEAN(ean);
    return medicamento ? { status: 'ok', medicamento } : { status: 'nao_encontrado' };
  }

  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  const url = `${API_URL}/drugs/ean/${encodeURIComponent(ean)}`;
  // __DEV__: so aparece no terminal do "npx expo start", nunca no app publicado
  if (__DEV__) console.log('[API] GET', url);
  let resposta;
  try {
    resposta = await fetch(url, { signal: controle.signal });
  } catch (e) {
    if (__DEV__) console.log('[API] falhou:', e.name === 'AbortError' ? `sem resposta em ${TEMPO_LIMITE_MS / 1000}s` : e.message);
    throw new ErroConexao('Servidor fora do ar ou sem conexao');
  } finally {
    clearTimeout(timer);
  }
  if (__DEV__) console.log('[API] resposta', resposta.status);

  if (resposta.status === 404) return { status: 'nao_encontrado' };
  if (!resposta.ok) throw new ErroConexao(`Erro ${resposta.status} no servidor`);

  const dados = await resposta.json();
  // A API usa LEFT JOIN: sem bula revisada, as secoes chegam como null
  if (!dados.what_is_it_for && !dados.posology) {
    return { status: 'em_revisao', nome: dados.brand_name || dados.active_ingredient };
  }
  return { status: 'ok', medicamento: converterDaApi(dados) };
}

// Quebra um texto da bula em itens (uma linha = um card), tirando marcadores como "-" e "•"
function emItens(texto) {
  if (!texto) return [];
  return texto
    .split(/\n+/)
    .map(linha => linha.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);
}

// Escolhe o icone do card "Como tomar" pelo assunto do texto (icones do Figma: pilula, relogio, copo)
function iconePara(texto) {
  const t = normalizar(texto);
  if (/\b(agua|copo|liquido)/.test(t)) return '🥛';
  // Como no Figma: "1 comprimido a cada 12 horas" e dosagem (pilula), mesmo citando horas
  if (/\b(comprimido|capsula|dragea|gota|mg|ml|dose|colher|sache|envelope)/.test(t)) return '💊';
  if (/\b(hora|horas|horario|manha|tarde|noite|jejum|dia|dias|diariamente|refeic)/.test(t)) return '⏰';
  return '💊';
}

// Converte a resposta de GET /drugs/ean/{ean} para o formato usado pelas telas
function converterDaApi(d) {
  const nome = d.brand_name || d.active_ingredient;
  return {
    id: d.registration_number,
    ean: d.ean,
    nome,
    nomePopular: nome,
    subtitulo: [d.active_ingredient, d.description].filter(Boolean).join(' — '),
    paraQueServe: d.what_is_it_for || '',
    comoTomar: emItens(d.posology).map(texto => ({ icone: iconePara(texto), texto })),
    alertas: [...emItens(d.contraindications), ...emItens(d.warnings)],
    // Contraindicacoes vem em texto livre, sem os ids de condicoes do perfil:
    // a Bula procura as condicoes nesse texto (utils/contraindicacoes.js)
    contraindicacoes: [],
    textoContraindicacoes: d.contraindications || '',
    // Principio ativo para conferir alergias (ex: "ibuprofeno + cafeina" vira dois itens)
    alergenos: d.active_ingredient.split(/\s*[+,;]\s*/).filter(Boolean),
    secoes: [
      { titulo: 'Para que serve', texto: d.what_is_it_for },
      { titulo: 'Se esquecer uma dose', texto: d.missed_dose },
      { titulo: 'Pode interagir com', texto: d.drug_interactions },
      { titulo: 'Efeitos colaterais', texto: d.adverse_effects || d.side_effects },
      { titulo: 'Quando procurar ajuda', texto: d.when_to_seek_help },
      { titulo: 'Como guardar', texto: d.storage },
    ].filter(s => s.texto),
  };
}
