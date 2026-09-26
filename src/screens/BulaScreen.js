import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuBotao from '../components/MenuBotao';
import { encontrarAlergias } from '../utils/alergias';
import { encontrarCondicoesNoTexto } from '../utils/contraindicacoes';
import IconeVoltar from '../../assets/icons/arrow-left.svg';
import IconeOuvir from '../../assets/icons/ouvir.svg';
import IconeDosagem from '../../assets/icons/dosagem.svg';
import IconeHorario from '../../assets/icons/horario.svg';
import IconeAgua from '../../assets/icons/agua.svg';
import IconeAlerta from '../../assets/icons/alerta.svg';
import { useEstilos, useOpcoesVoz } from '../context/ConfigContext';
import { FONTS, FONT_FAMILY, SPACING, RADIUS, BUTTON_HEIGHT } from '../utils/theme';

// Icones do Figma para os emojis usados em data/medicamentos.js
const ICONES_COMO_TOMAR = {
  '💊': IconeDosagem,
  '⏰': IconeHorario,
  '🥛': IconeAgua,
};

export default function BulaScreen({ route, navigation }) {
  const s = useEstilos(criarEstilos);
  const opcoesVoz = useOpcoesVoz();
  const { medicamento } = route.params;
  const [falando, setFalando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const timerProgresso = useRef();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    verificarContraindicacoes();
  }, []);

  async function verificarContraindicacoes() {
    try {
      const perfil = await AsyncStorage.getItem('perfil');
      if (perfil) {
        const { condicoes = [], alergias = [] } = JSON.parse(perfil);
        // Remedios de exemplo: lista de ids. Remedios da API: busca no texto da bula.
        const daLista = medicamento.contraindicacoes.filter(c => condicoes.includes(c));
        const doTexto = encontrarCondicoesNoTexto(medicamento.textoContraindicacoes, condicoes);
        const condicoesEncontradas = [...new Set([...daLista, ...doTexto.condicoes])];
        const alergiasEncontradas = encontrarAlergias(medicamento, alergias);
        if (condicoesEncontradas.length > 0 || alergiasEncontradas.length > 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          navigation.navigate('Alerta', {
            medicamento,
            condicoes: condicoesEncontradas,
            alergias: alergiasEncontradas,
            trechos: doTexto.trechos,
          });
        }
      }
    } catch (e) {}
  }

  // Para o audio e o timer ao sair da tela (desmount ou perda de foco)
  useEffect(() => () => {
    Speech.stop();
    clearInterval(timerProgresso.current);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop();
        clearInterval(timerProgresso.current);
        setFalando(false);
        setProgresso(0);
      };
    }, [])
  );

  function pararAudio() {
    clearInterval(timerProgresso.current);
    setFalando(false);
    setProgresso(0);
  }

  function ouvirBula() {
    if (falando) {
      Speech.stop();
      pararAudio();
      return;
    }
    const partes = [
      medicamento.nomePopular,
      medicamento.paraQueServe,
      'Como tomar',
      ...medicamento.comoTomar.map(c => c.texto),
      ...medicamento.alertas,
      // "Para que serve" ja foi lido acima
      ...(medicamento.secoes || [])
        .filter(sec => sec.titulo !== 'Para que serve')
        .flatMap(sec => [sec.titulo, sec.texto]),
    ].filter(Boolean);
    const texto = partes.map(p => p.trim().replace(/[.;:]$/, '')).join('. ') + '.';

    // Progresso: estimativa pelo tempo (~10 letras por segundo na velocidade 0.8).
    // No iPhone, onBoundary informa a palavra lida e corrige a estimativa.
    const inicio = Date.now();
    const duracaoEstimada = (texto.length / 10) * 1000;
    let usandoBoundary = false;
    clearInterval(timerProgresso.current);
    timerProgresso.current = setInterval(() => {
      if (!usandoBoundary) setProgresso(Math.min((Date.now() - inicio) / duracaoEstimada, 0.95));
    }, 250);

    setFalando(true);
    setProgresso(0);
    Speech.speak(texto, {
      ...opcoesVoz, // idioma, velocidade e volume de Configuracoes
      onBoundary: ({ charIndex }) => {
        usandoBoundary = true;
        setProgresso(charIndex / texto.length);
      },
      onDone: pararAudio,
      onStopped: pararAudio,
      onError: pararAudio,
    });
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.navigate('Home')} accessibilityLabel="Voltar">
          <IconeVoltar width={20} height={20} />
        </TouchableOpacity>
        <MenuBotao />
      </View>
      <ScrollView contentContainerStyle={[s.conteudo, { paddingBottom: SPACING.xl + insets.bottom }]}>
        <View style={s.nomeBloco}>
          <Text style={s.nome}>{medicamento.nome}</Text>
          <Text style={s.subtitulo}>{medicamento.subtitulo}</Text>
        </View>

        <TouchableOpacity style={s.btnAudio} onPress={ouvirBula} accessibilityRole="button">
          <IconeOuvir width={24} height={24} />
          <Text style={s.btnAudioTexto}>{falando ? 'Parar áudio' : 'Ouvir a Bula'}</Text>
        </TouchableOpacity>

        <Text style={s.secaoTitulo}>Como tomar</Text>
        <View style={s.cards}>
          {medicamento.comoTomar.map((item, i) => {
            const Icone = ICONES_COMO_TOMAR[item.icone];
            return (
              <View key={i} style={s.card}>
                {Icone
                  ? <Icone width={28} height={28} />
                  : <Text style={s.cardEmoji}>{item.icone}</Text>}
                <Text style={s.cardTexto}>{item.texto}</Text>
              </View>
            );
          })}
          {medicamento.alertas.map((alerta, i) => (
            <View key={`alerta-${i}`} style={[s.card, s.alertaCard]}>
              <IconeAlerta width={28} height={28} />
              <Text style={[s.cardTexto, s.alertaTexto]}>{alerta}</Text>
            </View>
          ))}
        </View>

        {/* Secoes extras que vem da API (bulas cadastradas no painel) */}
        {(medicamento.secoes || []).map(secao => (
          <View key={secao.titulo} style={s.secao}>
            <Text style={s.secaoTitulo}>{secao.titulo}</Text>
            <View style={s.card}>
              <Text style={s.cardTexto}>{secao.texto}</Text>
            </View>
          </View>
        ))}

        <Text style={s.rodape}>Sempre siga também as orientações do seu médico.</Text>

        {falando && (
          <View style={s.audioIndicador} accessibilityLabel={`Reproduzindo áudio, ${Math.round(progresso * 100)}%`}>
            <Text style={s.audioStatus}>Reproduzindo áudio...</Text>
            <View style={s.audioBarra}>
              <View style={[s.audioProgresso, { width: `${Math.round(progresso * 100)}%` }]} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md,
  },
  btnVoltar: {
    width: 40, height: 40, borderRadius: RADIUS,
    borderWidth: 1, borderColor: cores.borderSubtle, backgroundColor: cores.white,
    justifyContent: 'center', alignItems: 'center',
  },
  conteudo: { paddingHorizontal: 20, paddingTop: SPACING.lg, gap: SPACING.lg },
  nomeBloco: { gap: 4 },
  nome: { fontFamily: FONT_FAMILY.titulo, fontSize: FONTS.title, lineHeight: 34, color: cores.text },
  subtitulo: { fontFamily: FONT_FAMILY.texto, fontSize: FONTS.body, lineHeight: 22, color: cores.textSecondary },
  btnAudio: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: BUTTON_HEIGHT, paddingHorizontal: 20, borderRadius: RADIUS, backgroundColor: cores.primary,
  },
  btnAudioTexto: { flex: 1, fontFamily: FONT_FAMILY.botao, fontSize: FONTS.button, lineHeight: 26, color: cores.white },
  secaoTitulo: { fontFamily: FONT_FAMILY.botao, fontSize: FONTS.button, lineHeight: 26, color: cores.textSecondary },
  cards: { gap: SPACING.sm },
  secao: { gap: SPACING.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: SPACING.md, borderRadius: RADIUS, backgroundColor: cores.background,
  },
  cardEmoji: { fontSize: 24, width: 28, textAlign: 'center' },
  cardTexto: { flex: 1, fontFamily: FONT_FAMILY.texto, fontSize: FONTS.subtitle, lineHeight: 26, color: cores.text },
  alertaCard: { backgroundColor: cores.dangerLight, borderWidth: 1.5, borderColor: cores.danger },
  alertaTexto: { color: cores.dangerText },
  rodape: { fontFamily: FONT_FAMILY.textoMedio, fontSize: FONTS.small, lineHeight: 18, color: cores.textSecondary },
  // minHeight (e nao height): a caixa cresce se a letra estiver maior em Configuracoes
  audioIndicador: { minHeight: 40, gap: 6, borderRadius: 8, backgroundColor: cores.audioBg, paddingHorizontal: SPACING.md, paddingTop: 6, paddingBottom: 6 },
  audioStatus: { fontFamily: FONT_FAMILY.legenda, fontSize: 14, color: cores.audioProgress },
  audioBarra: { height: 6, borderRadius: 3, backgroundColor: cores.audioTrack },
  audioProgresso: { height: 6, borderRadius: 3, backgroundColor: cores.audioProgress },
});