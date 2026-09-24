// Cores seguem as variaveis do Figma (nome da variavel no comentario)
export const COLORS = {
  primary: '#2F6FED',        // cor/marca/primaria
  primaryDark: '#2D4ABF',
  white: '#FFFFFF',          // cor/fundo/padrao, cor/texto/sobre-marca
  background: '#F7F8FA',     // cor/fundo/sutil
  card: '#FFFFFF',
  text: '#1A2027',           // cor/texto/primario
  textSecondary: '#404040',
  textStrong: '#262626',     // titulos das telas de Login/Cadastro
  textLabel: '#333333',      // rotulos dos campos
  textPlaceholder: '#8C8C8C',
  pinDot: '#666666',
  border: '#D1D1D1',
  borderSubtle: '#E5E7EB',   // borda dos botoes Voltar e Menu
  danger: '#D6293E',         // cor/icone/alerta, cor/alerta/borda
  dangerLight: '#FDECEC',    // cor/alerta/fundo
  dangerText: '#8F1626',     // cor/alerta/texto
  dangerBorderSoft: '#F5C2C8', // borda dos chips de alergia (Meu Perfil)
  success: '#28A745',
  warning: '#FFC107',
  inputBg: '#F5F5F5',
  iconHorario: '#F2A900',    // cor/icone/horario
  iconAgua: '#0EA5B7',       // cor/icone/agua
  iconMuted: '#6B7280',      // icones cinza do menu aberto
  audioBg: '#EBF2FF',
  audioTrack: '#D9D9D9',
  audioProgress: '#4164E0',
};

// Alto contraste (Configuracoes): texto preto, azul e vermelho mais escuros, bordas pretas.
// Todas as combinacoes de texto/fundo ficam acima de 7:1 (nivel AAA de acessibilidade).
export const COLORS_ALTO_CONTRASTE = {
  ...COLORS,
  primary: '#0B3FB5',
  primaryDark: '#082E85',
  background: '#E6E8EC',
  text: '#000000',
  textSecondary: '#000000',
  textStrong: '#000000',
  textLabel: '#000000',
  textPlaceholder: '#3D3D3D',
  pinDot: '#000000',
  border: '#000000',
  borderSubtle: '#000000',
  danger: '#A3001B',
  dangerLight: '#FFE3E3',
  dangerText: '#5C000F',
  dangerBorderSoft: '#A3001B',
  inputBg: '#FFFFFF',
  iconMuted: '#000000',
  audioBg: '#DCE6FF',
  audioTrack: '#6B6B6B',
  audioProgress: '#0B3FB5',
};

// Nomes registrados pelo useFonts no App.js
export const FONT_FAMILY = {
  titulo: 'Nunito_700Bold',
  texto: 'AtkinsonHyperlegibleNext_400Regular',
  textoMedio: 'AtkinsonHyperlegibleNext_500Medium',
  botao: 'Inter_700Bold',
  link: 'Inter_600SemiBold',
  legenda: 'Inter_400Regular',
};

export const FONTS = {
  small: 16,
  body: 18,
  subtitle: 20,
  title: 28,
  button: 22,
  icon: 32,
};

export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = 12;          // primitiva/raio-12
export const BUTTON_HEIGHT = 60;
export const INPUT_HEIGHT = 56;
export const MIN_TOUCH = 48;
