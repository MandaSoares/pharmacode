import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEstilos } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function NaoEncontradoScreen({ route, navigation }) {
  const s = useEstilos(criarEstilos);
  const { ean, motivo, nome } = route.params || {};
  const emRevisao = motivo === 'em_revisao';

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.navigate('Home')}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Resultado</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <View style={s.centro}>
        <Text style={s.icone}>{emRevisao ? '⏳' : '🔍'}</Text>
        <Text style={s.titulo}>{emRevisao ? 'Bula em revisão' : 'Remédio não cadastrado'}</Text>
        <Text style={s.descricao}>
          {emRevisao
            ? `A bula simplificada${nome ? ` de ${nome}` : ''} ainda está sendo revisada por um farmacêutico. Enquanto isso, consulte a bula impressa ou um farmacêutico.`
            : 'Esse remédio ainda não está no banco de dados. Consulte a bula impressa ou um farmacêutico.'}
        </Text>
        {ean && <Text style={s.ean}>Código: {ean}</Text>}
        <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Scanner')}>
          <Text style={s.botaoTexto}>Tentar outro remédio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.botaoSec} onPress={() => navigation.navigate('Home')}>
          <Text style={s.botaoSecTexto}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm,
  },
  btnVoltar: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'center' },
  voltarTexto: { fontSize: 28, color: cores.text },
  headerTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: cores.text },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg },
  icone: { fontSize: 64, marginBottom: SPACING.lg },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: cores.text, textAlign: 'center', marginBottom: SPACING.md },
  descricao: { fontSize: FONTS.body, color: cores.textSecondary, textAlign: 'center', marginBottom: SPACING.sm },
  ean: { fontSize: FONTS.small, color: cores.textPlaceholder, marginBottom: SPACING.xl },
  botao: {
    backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: SPACING.md,
  },
  botaoTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
  botaoSec: {
    borderWidth: 2, borderColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoSecTexto: { color: cores.primary, fontSize: FONTS.button, fontWeight: '700' },
});