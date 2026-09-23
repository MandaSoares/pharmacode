import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function ConfigScreen({ navigation }) {
  const [fontSize, setFontSize] = useState(18);
  const [altoContraste, setAltoContraste] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    (async () => {
      try {
        const config = await AsyncStorage.getItem('config');
        if (config) {
          const p = JSON.parse(config);
          setFontSize(p.fontSize || 18);
          setAltoContraste(p.altoContraste || false);
          setVolume(p.volume || 80);
        }
      } catch (e) {}
    })();
  }, []);

  async function salvarConfig() {
    try {
      await AsyncStorage.setItem('config', JSON.stringify({ fontSize, altoContraste, volume }));
      Alert.alert('Ajustes salvos', 'As configuracoes foram aplicadas.');
    } catch (e) {
      Alert.alert('Erro', 'Nao foi possivel salvar.');
    }
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()} accessibilityLabel="Voltar">
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Configuracoes</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>

      <View style={s.conteudo}>
        <Text style={s.subtitulo}>Ajuste para ler e ouvir melhor.</Text>

        <View style={s.configItem}>
          <Text style={s.configLabel}>Tamanho da letra</Text>
          <View style={s.sliderRow}>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>A</Text>
            <Slider
              style={s.slider}
              minimumValue={14} maximumValue={28} step={2}
              value={fontSize} onValueChange={setFontSize}
              minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            <Text style={{ fontSize: 28, fontWeight: '700', color: COLORS.text }}>A</Text>
          </View>
          <Text style={[s.preview, { fontSize }]}>Texto de exemplo com tamanho {Math.round(fontSize)}</Text>
        </View>

        <View style={s.configItem}>
          <Text style={s.configLabel}>Alto contraste</Text>
          <View style={s.toggleRow}>
            <Text style={s.toggleDesc}>Cores mais fortes</Text>
            <Switch
              value={altoContraste} onValueChange={setAltoContraste}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
              style={{ transform: [{ scale: 1.3 }] }}
            />
          </View>
        </View>

        <View style={s.configItem}>
          <Text style={s.configLabel}>Volume do audio</Text>
          <View style={s.sliderRow}>
            <Text style={{ fontSize: 24 }}>🔈</Text>
            <Slider
              style={s.slider}
              minimumValue={0} maximumValue={100} step={5}
              value={volume} onValueChange={setVolume}
              minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            <Text style={{ fontSize: 24 }}>🔊</Text>
          </View>
          <Text style={s.volumeTexto}>{Math.round(volume)}%</Text>
        </View>

        <TouchableOpacity style={s.botao} onPress={salvarConfig}>
          <Text style={s.botaoTexto}>Aplicar ajustes</Text>
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
  conteudo: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  subtitulo: { fontSize: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  configItem: { marginBottom: SPACING.xl },
  configLabel: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  slider: { flex: 1, height: MIN_TOUCH },
  preview: { color: COLORS.textSecondary, marginTop: SPACING.xs },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleDesc: { fontSize: FONTS.body, color: COLORS.textSecondary },
  volumeTexto: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs },
  botao: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg,
  },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
});
