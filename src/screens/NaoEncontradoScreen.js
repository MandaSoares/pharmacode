import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function NaoEncontradoScreen({ route, navigation }) {
  const { ean } = route.params || {};

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
        <Text style={s.icone}>🔍</Text>
        <Text style={s.titulo}>Remedio nao cadastrado</Text>
        <Text style={s.descricao}>
          Esse remedio ainda nao esta no banco de dados. Consulte a bula impressa ou um farmaceutico.
        </Text>
        {ean && <Text style={s.ean}>Codigo: {ean}</Text>}
        <TouchableOpacity style={s.botao} onPress={() => navigation.navigate('Scanner')}>
          <Text style={s.botaoTexto}>Tentar outro remedio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.botaoSec} onPress={() => navigation.navigate('Home')}>
          <Text style={s.botaoSecTexto}>Voltar ao inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm,
  },
  btnVoltar: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'center' },
  voltarTexto: { fontSize: 28, color: COLORS.text },
  headerTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg },
  icone: { fontSize: 64, marginBottom: SPACING.lg },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  descricao: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.sm },
  ean: { fontSize: FONTS.small, color: COLORS.textPlaceholder, marginBottom: SPACING.xl },
  botao: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: SPACING.md,
  },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
  botaoSec: {
    borderWidth: 2, borderColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoSecTexto: { color: COLORS.primary, fontSize: FONTS.button, fontWeight: '700' },
});
