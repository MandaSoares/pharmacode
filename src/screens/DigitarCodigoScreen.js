import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { buscarPorEAN } from '../data/medicamentos';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH, INPUT_HEIGHT } from '../utils/theme';

export default function DigitarCodigoScreen({ navigation }) {
  const [ean, setEan] = useState('');

  function buscar() {
    const limpo = ean.replace(/\D/g, '');
    if (limpo.length < 8) return;
    const medicamento = buscarPorEAN(limpo);
    if (medicamento) {
      navigation.navigate('Bula', { medicamento });
    } else {
      navigation.navigate('NaoEncontrado', { ean: limpo });
    }
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Digitar codigo</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <View style={s.conteudo}>
        <View style={s.campoGrupo}>
          <Text style={s.label}>Digite o codigo de barras</Text>
          <TextInput
            style={s.input} placeholder="0000000000000"
            placeholderTextColor={COLORS.textPlaceholder}
            value={ean} onChangeText={setEan}
            keyboardType="numeric" maxLength={13}
          />
          <Text style={s.ajuda}>Sao os numeros embaixo do codigo de barras na caixa do remedio</Text>
        </View>
        <TouchableOpacity style={s.botao} onPress={buscar}>
          <Text style={s.botaoTexto}>Buscar remedio</Text>
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
  conteudo: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  campoGrupo: { marginBottom: SPACING.xl },
  label: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.inputBg, height: INPUT_HEIGHT, borderRadius: 12,
    paddingHorizontal: SPACING.md, fontSize: FONTS.button, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, letterSpacing: 2,
  },
  ajuda: { fontSize: FONTS.small, color: COLORS.textSecondary, marginTop: SPACING.xs },
  botao: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
});
