import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function BulaScreen({ route, navigation }) {
  const { medicamento } = route.params;
  const [falando, setFalando] = useState(false);

  useEffect(() => {
    verificarContraindicacoes();
  }, []);

  async function verificarContraindicacoes() {
    try {
      const perfil = await AsyncStorage.getItem('perfil');
      if (perfil) {
        const { condicoes } = JSON.parse(perfil);
        const encontradas = medicamento.contraindicacoes.filter(c => condicoes.includes(c));
        if (encontradas.length > 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          navigation.navigate('Alerta', { medicamento, condicoes: encontradas });
        }
      }
    } catch (e) {}
  }

  function ouvirBula() {
    if (falando) {
      Speech.stop();
      setFalando(false);
      return;
    }
    const texto = `${medicamento.nomePopular}. ${medicamento.paraQueServe}. ` +
      medicamento.comoTomar.map(c => c.texto).join('. ') + '. ' +
      medicamento.alertas.join('. ');
    setFalando(true);
    Speech.speak(texto, {
      language: 'pt-BR', rate: 0.8,
      onDone: () => setFalando(false),
      onStopped: () => setFalando(false),
    });
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.navigate('Home')}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Bula</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        <Text style={s.nome}>{medicamento.nome}</Text>
        <Text style={s.subtitulo}>{medicamento.subtitulo}</Text>
        <TouchableOpacity style={[s.btnAudio, falando && s.btnAudioAtivo]} onPress={ouvirBula}>
          <Text style={s.btnAudioTexto}>{falando ? '⏹  Parar audio' : '🔊  Ouvir a Bula'}</Text>
        </TouchableOpacity>
        {falando && (
          <View style={s.audioIndicador}>
            <Text style={s.audioStatus}>Reproduzindo audio...</Text>
            <View style={s.audioBarra}><View style={s.audioProgresso} /></View>
          </View>
        )}
        <Text style={s.secaoTitulo}>Como tomar</Text>
        {medicamento.comoTomar.map((item, i) => (
          <View key={i} style={s.card}>
            <Text style={s.cardIcone}>{item.icone}</Text>
            <Text style={s.cardTexto}>{item.texto}</Text>
          </View>
        ))}
        {medicamento.alertas.map((alerta, i) => (
          <View key={i} style={s.alertaCard}>
            <Text style={s.alertaIcone}>⚠️</Text>
            <Text style={s.alertaTexto}>{alerta}</Text>
          </View>
        ))}
        <Text style={s.rodape}>Sempre siga tambem as orientacoes do seu medico.</Text>
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  nome: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  subtitulo: { fontSize: FONTS.body, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  btnAudio: { backgroundColor: '#00A86B', height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  btnAudioAtivo: { backgroundColor: '#CC0000' },
  btnAudioTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
  audioIndicador: { backgroundColor: '#EEF4FF', borderRadius: 8, padding: SPACING.sm, marginBottom: SPACING.md },
  audioStatus: { fontSize: 14, color: COLORS.primary, marginBottom: SPACING.xs },
  audioBarra: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  audioProgresso: { height: 6, width: '60%', backgroundColor: COLORS.primary, borderRadius: 3 },
  secaoTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm },
  cardIcone: { fontSize: FONTS.icon, marginRight: SPACING.md },
  cardTexto: { fontSize: FONTS.body, color: COLORS.text, flex: 1 },
  alertaCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dangerLight, borderRadius: 12,
    padding: SPACING.md, marginTop: SPACING.sm, borderLeftWidth: 4, borderLeftColor: COLORS.danger,
  },
  alertaIcone: { fontSize: FONTS.icon, marginRight: SPACING.md },
  alertaTexto: { fontSize: FONTS.body, color: COLORS.danger, flex: 1, fontWeight: '600' },
  rodape: { fontSize: FONTS.small, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl, fontStyle: 'italic' },
});
