import { StyleSheet } from 'react-native';
import { FONT_FAMILY, RADIUS, BUTTON_HEIGHT } from './theme';

// Estilos das telas de formulario do Figma (Cadastro, Form de cadastro, Recuperar senha).
// Recebe as cores atuais (normal ou alto contraste): use com useEstilos(criarFormStyles)
export const criarFormStyles = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  conteudo: { flexGrow: 1, alignItems: 'center', gap: 20, paddingHorizontal: 20 },
  etapas: { flexDirection: 'row', gap: 8 },
  etapa: { width: 28, height: 6, borderRadius: 5, backgroundColor: cores.borderSubtle },
  etapaAtual: { width: 48, backgroundColor: cores.primary },
  logo: { width: 100, height: undefined, aspectRatio: 496 / 360 },
  titulo: { fontFamily: FONT_FAMILY.botao, fontSize: 28, color: cores.textStrong, textAlign: 'center' },
  descricao: { width: '100%', fontFamily: FONT_FAMILY.legenda, fontSize: 16, lineHeight: 22, color: cores.textSecondary },
  campos: { width: '100%', gap: 16 },
  campoGrupo: { gap: 6 },
  campoPin: { gap: 8 },
  label: { fontFamily: FONT_FAMILY.botao, fontSize: 18, color: cores.textLabel },
  input: {
    height: 54, paddingHorizontal: 16, borderRadius: RADIUS,
    backgroundColor: cores.inputBg, borderWidth: 1, borderColor: cores.border,
    fontFamily: FONT_FAMILY.legenda, fontSize: 18, color: cores.text,
  },
  botao: {
    width: '100%', height: BUTTON_HEIGHT, borderRadius: RADIUS, backgroundColor: cores.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoTexto: { fontFamily: FONT_FAMILY.botao, fontSize: 22, lineHeight: 26, color: cores.white },
  linkArea: { width: '100%', alignItems: 'center', paddingTop: 8, minHeight: 44, justifyContent: 'center' },
  link: { fontFamily: FONT_FAMILY.link, fontSize: 16, color: cores.primary, textDecorationLine: 'underline' },
});
