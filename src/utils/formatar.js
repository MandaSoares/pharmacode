// Formata digitos como CPF: 000.000.000-00
export function formatCPF(value) {
  const nums = value.replace(/\D/g, '').slice(0, 11);
  return nums
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export const CPF_COMPLETO = 14; // tamanho com pontos e traco
