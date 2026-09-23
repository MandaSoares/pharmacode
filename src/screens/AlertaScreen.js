import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import CONDICOES from '../data/condicoes';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function AlertaScreen({ route, navigation }) {
  const { medicamento, condicoes } = route.params;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const nomesCondicoes = condicoes.map(c => {
    const found = CONDICOES.find(cd => cd.id === c);
    return found ? found.label : c;
  });

  function ouvirAlerta() {
    const texto = `Atencao! ${medicamento.nome} nao eh indicado para quem tem ${nomesCondicoes.join(' e ')}. Converse com seu medico antes de tomar.`;
    Speech.speak(texto, { language: 'pt-BR', rate: 0.8 });
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Alerta</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <View style={s.conteudo}>
        <View style={s.alertaBox}>
          <Text style={s.alertaIcone}>⚠️</Text>
          <Text style={s.alertaTitulo}>Atencao: contraindicacao encontrada</Text>
          <Text style={s.alertaDesc}>
            {medicamento.nome} nao eh indicado para quem tem {nomesCondicoes.join(' e ')}, de acordo com o seu perfil de saude.
          </Text>
          {nomesCondicoes.map((nome, i) => (
            <View key={i} style={s.tag}>
              <Text style={s.tagTexto}>🔴 {nome} (do seu perfil)</Text>
            </View>
          ))}
        </View>
        <Text style={s.orientacao}>Antes de tomar, converse com seu medico ou farmaceutico sobre essa contraindicacao.</Text>
        <TouchableOpacity style={s.btnOuvir} onPress={ouvirAlerta}>
          <Text style={s.btnOuvirTexto}>🔊  Ouvir alerta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnVer} onPress={() => navigation.goBack()}>
          <Text style={s.btnVerTexto}>Ver bula completa</Text>
        </TouchableOpacity>
        <Text style={s.vibTexto}>O celular ira vibrar neste alerta</Text>
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
  conteudo: { flex: 1, paddingHorizontal: SPACING.lg },
  alertaBox: { backgroundColor: COLORS.dangerLight, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.lg },
  alertaIcone: { fontSize: 48, marginBottom: SPACING.sm },
  alertaTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.danger, textAlign: 'center', marginBottom: SPACING.sm },
  alertaDesc: { fontSize: FONTS.body, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  tag: { backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginTop: SPACING.xs },
  tagTexto: { fontSize: FONTS.small, color: COLORS.danger, fontWeight: '600' },
  orientacao: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.lg },
  btnOuvir: { backgroundColor: COLORS.danger, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  btnOuvirTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
  btnVer: { borderWidth: 2, borderColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnVerTexto: { color: COLORS.primary, fontSize: FONTS.button, fontWeight: '700' },
  vibTexto: { fontSize: FONTS.small, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.lg },
});
