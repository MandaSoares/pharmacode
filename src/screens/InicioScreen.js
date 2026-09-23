import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT } from '../utils/theme';

export default function InicioScreen({ navigation }) {
  return (
    <View style={s.container}>
      <View style={s.centro}>
        <Text style={s.logoIcone}>💊</Text>
        <Text style={s.logoTexto}>PharmaCode</Text>
        <Text style={s.subtitulo}>A sua bula facil e ao seu alcance</Text>
        <Text style={s.descricao}>
          Aponte a camera para a caixa do medicamento e pronto! Receba uma bula
          simplificada, adaptada com facil leitura ou audio, garantindo que voce
          tome o remedio certo, na hora certa e sem duvidas.
        </Text>
        <TouchableOpacity
          style={s.botao}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Comecar a usar o app"
        >
          <Text style={s.botaoTexto}>Comecar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  centro: { alignItems: 'center' },
  logoIcone: { fontSize: 64, marginBottom: SPACING.sm },
  logoTexto: {
    fontSize: FONTS.title,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  subtitulo: {
    fontSize: FONTS.subtitle,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  descricao: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  botao: {
    backgroundColor: COLORS.primary,
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  botaoTexto: {
    color: COLORS.white,
    fontSize: FONTS.button,
    fontWeight: '700',
  },
});
