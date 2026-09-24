// Deixa o texto comparavel: minusculo, sem acento e sem espacos extras
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
