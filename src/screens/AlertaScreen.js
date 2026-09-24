import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import CONDICOES from '../data/condicoes';
import { useEstilos, useOpcoesVoz } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function AlertaScreen({ route, navigation }) {
  const s = useEstilos(criarEstilos);
  const opcoesVoz = useOpcoesVoz();
  // trechos: frases da bula (API) onde as condicoes do perfil foram encontradas
  const { medicamento, condicoes = [], alergias = [], trechos = [] } = route.params;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const nomesCondicoes = condicoes.map(c => {
    const found = CONDICOES.find(cd => cd.id === c);
    return found ? found.label : c;
  });

  const temCondicao = nomesCondicoes.length > 0;
  const temAlergia = alergias.length > 0;

  const titulo = temCondicao && temAlergia
    ? 'Atenção: contraindicação e alergia encontradas'
    : temAlergia ? 'Atenção: alergia encontrada' : 'Atenção: contraindicação encontrada';

  // Monta a explicacao com os motivos encontrados no perfil
  const motivos = [];
  if (temCondicao) motivos.push(`não é indicado para quem tem ${nomesCondicoes.join(' e ')}`);
  if (temAlergia) motivos.push(`pode causar reação em quem tem alergia a ${alergias.join(' e ')}`);
  const descricao = `${medicamento.nome} ${motivos.join(' e ')}, de acordo com o seu perfil de saúde.`;

  function ouvirAlerta() {
    const texto = `${titulo}. ${descricao} Converse com seu médico antes de tomar.`;
    Speech.speak(texto, opcoesVoz);
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
      <ScrollView contentContainerStyle={s.conteudo}>
        <View style={s.alertaBox}>
          <Text style={s.alertaIcone}>⚠️</Text>
          <Text style={s.alertaTitulo}>{titulo}</Text>
          <Text style={s.alertaDesc}>{descricao}</Text>
          {nomesCondicoes.map((nome, i) => (
            <View key={`c-${i}`} style={s.tag}>
              <Text style={s.tagTexto}>🔴 {nome} (do seu perfil)</Text>
            </View>
          ))}
          {alergias.map((nome, i) => (
            <View key={`a-${i}`} style={s.tag}>
              <Text style={s.tagTexto}>⊘ Alergia a {nome} (do seu perfil)</Text>
            </View>
          ))}
        </View>
        {trechos.length > 0 && (
          <View style={s.trechos}>
            <Text style={s.trechosTitulo}>O que diz a bula:</Text>
            {trechos.map((t, i) => (
              <Text key={i} style={s.trechoTexto}>“{t}”</Text>
            ))}
          </View>
        )}
        <Text style={s.orientacao}>Antes de tomar, converse com seu médico ou farmacêutico sobre esse alerta.</Text>
        <TouchableOpacity style={s.btnOuvir} onPress={ouvirAlerta}>
          <Text style={s.btnOuvirTexto}>🔊  Ouvir alerta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnVer} onPress={() => navigation.goBack()}>
          <Text style={s.btnVerTexto}>Ver bula completa</Text>
        </TouchableOpacity>
        <Text style={s.vibTexto}>O celular ira vibrar neste alerta</Text>
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
  conteudo: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  alertaBox: { backgroundColor: cores.dangerLight, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.lg },
  alertaIcone: { fontSize: 48, marginBottom: SPACING.sm },
  alertaTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: cores.danger, textAlign: 'center', marginBottom: SPACING.sm },
  alertaDesc: { fontSize: FONTS.body, color: cores.text, textAlign: 'center', marginBottom: SPACING.md },
  tag: { backgroundColor: cores.white, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginTop: SPACING.xs },
  tagTexto: { fontSize: FONTS.small, color: cores.danger, fontWeight: '600' },
  trechos: {
    marginTop: SPACING.md, padding: SPACING.md, gap: SPACING.xs, borderRadius: 12,
    backgroundColor: cores.background, borderLeftWidth: 4, borderLeftColor: cores.danger,
  },
  trechosTitulo: { fontSize: FONTS.small, fontWeight: '700', color: cores.textSecondary },
  trechoTexto: { fontSize: FONTS.body, lineHeight: 24, color: cores.text, fontStyle: 'italic' },
  orientacao: { fontSize: FONTS.body, color: cores.textSecondary, textAlign: 'center', marginVertical: SPACING.lg },
  btnOuvir: { backgroundColor: cores.danger, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  btnOuvirTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
  btnVer: { borderWidth: 2, borderColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnVerTexto: { color: cores.primary, fontSize: FONTS.button, fontWeight: '700' },
  vibTexto: { fontSize: FONTS.small, color: cores.textSecondary, textAlign: 'center', marginTop: SPACING.lg },
});
