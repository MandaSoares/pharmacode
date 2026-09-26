import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useEstilos } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT } from '../utils/theme';

export default function InicioScreen({ navigation }) {
  const s = useEstilos(criarEstilos);
  return (
    <View style={s.container}>
      <View style={s.centro}>
        <Image source={require('../../assets/logo/logo-title.png')} style={s.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
        <Text style={s.subtitulo}>A sua bula fácil e ao seu alcance</Text>
        <Text style={s.descricao}>
          Aponte a câmera para a caixa do medicamento e pronto! Receba uma bula
          simplificada, adaptada com fácil leitura ou áudio, garantindo que você
          tome o remédio certo, na hora certa e sem dúvidas.
        </Text>
        <TouchableOpacity
          style={s.botao}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Começar a usar o app"
        >
          <Text style={s.botaoTexto}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.white,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  centro: { alignItems: 'center' },
  logo: { width: 200, height: undefined, aspectRatio: 864 / 511, marginBottom: SPACING.lg },
  subtitulo: {
    fontSize: FONTS.subtitle,
    fontWeight: '600',
    color: cores.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  descricao: {
    fontSize: FONTS.body,
    color: cores.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  botao: {
    backgroundColor: cores.primary,
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  botaoTexto: {
    color: cores.white,
    fontSize: FONTS.button,
    fontWeight: '700',
  },
});