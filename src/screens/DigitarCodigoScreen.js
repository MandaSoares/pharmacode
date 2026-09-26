import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { buscarMedicamento } from '../services/medicamentos';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH, INPUT_HEIGHT } from '../utils/theme';

export default function DigitarCodigoScreen({ navigation }) {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const [ean, setEan] = useState('');
  const [buscando, setBuscando] = useState(false);

  async function buscar() {
    const limpo = ean.replace(/\D/g, '');
    if (limpo.length < 8 || buscando) return;
    Keyboard.dismiss();
    setBuscando(true);
    try {
      const resultado = await buscarMedicamento(limpo);
      if (resultado.status === 'ok') {
        navigation.navigate('Bula', { medicamento: resultado.medicamento });
      } else {
        navigation.navigate('NaoEncontrado', { ean: limpo, motivo: resultado.status, nome: resultado.nome });
      }
    } catch (e) {
      Alert.alert('Sem conexão com o servidor', 'Não foi possível buscar o remédio. Confira a internet e tente de novo.');
    } finally {
      setBuscando(false);
    }
  }

  function handleEanChange(t) {
    setEan(t);
    if (t.replace(/\D/g, '').length === 13) {
      Keyboard.dismiss();
    }
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Digitar código</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <ScrollView
        contentContainerStyle={s.conteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={s.campoGrupo}>
          <Text style={s.label}>Digite o código de barras</Text>
          <TextInput
            style={s.input} placeholder="0000000000000"
            placeholderTextColor={cores.textPlaceholder}
            value={ean} onChangeText={handleEanChange}
            keyboardType="numeric" maxLength={13}
          />
          <Text style={s.ajuda}>São os números embaixo do código de barras na caixa do remédio</Text>
        </View>
        <TouchableOpacity style={s.botao} onPress={buscar} disabled={buscando}>
          {buscando
            ? <ActivityIndicator color={cores.white} />
            : <Text style={s.botaoTexto}>Buscar remédio</Text>}
        </TouchableOpacity>
      </ScrollView>
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
  conteudo: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  campoGrupo: { marginBottom: SPACING.xl },
  label: { fontSize: FONTS.subtitle, fontWeight: '700', color: cores.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: cores.inputBg, height: INPUT_HEIGHT, borderRadius: 12,
    paddingHorizontal: SPACING.md, fontSize: FONTS.button, color: cores.text,
    borderWidth: 1, borderColor: cores.border, letterSpacing: 2,
  },
  ajuda: { fontSize: FONTS.small, color: cores.textSecondary, marginTop: SPACING.xs },
  botao: {
    backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
});