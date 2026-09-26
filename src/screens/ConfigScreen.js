import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import { VolumeX, Volume2 } from 'lucide-react-native';
import MenuBotao from '../components/MenuBotao';
import { useConfig, escalaDaFonte, escalarFontes } from '../context/ConfigContext';
import { COLORS, COLORS_ALTO_CONTRASTE, FONT_FAMILY, SPACING, RADIUS, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function ConfigScreen() {
  const insets = useSafeAreaInsets();
  const { config, salvarConfig } = useConfig();
  // Rascunho: so vale para o app todo depois de "Aplicar ajustes"
  const [fontSize, setFontSize] = useState(config.fontSize);
  const [altoContraste, setAltoContraste] = useState(config.altoContraste);
  const [volume, setVolume] = useState(config.volume);

  // Se os ajustes salvos carregarem depois de a tela abrir, atualiza o rascunho
  useEffect(() => {
    setFontSize(config.fontSize);
    setAltoContraste(config.altoContraste);
    setVolume(config.volume);
  }, [config]);

  // Esta tela ja mostra o contraste e o tamanho de letra escolhidos, antes de aplicar,
  // para a pessoa ver como fica
  const cores = altoContraste ? COLORS_ALTO_CONTRASTE : COLORS;
  const escala = escalaDaFonte(fontSize);
  const s = useMemo(() => escalarFontes(criarEstilos(cores), escala), [cores, escala]);

  useEffect(() => () => Speech.stop(), []);

  function testarVolume() {
    Speech.stop();
    Speech.speak('Este é o volume do áudio das bulas.', { language: 'pt-BR', rate: 0.8, volume: volume / 100 });
  }

  async function aplicar() {
    try {
      await salvarConfig({ fontSize, altoContraste, volume });
      Alert.alert('Ajustes aplicados', 'As configurações foram salvas.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente de novo.');
    }
  }

  const porcentagemLetra = Math.round(((fontSize - 14) / (28 - 14)) * 100);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <MenuBotao />
      </View>

      <ScrollView contentContainerStyle={[s.conteudo, { paddingBottom: insets.bottom + SPACING.xl }]}>
        <View style={s.tituloBloco}>
          <Text style={s.titulo}>Configurações</Text>
          <Text style={s.subtitulo}>Ajuste para ler e ouvir melhor.</Text>
        </View>

        <View style={s.cartao}>
          <View style={s.linhaTopo}>
            <Text style={s.rotulo}>Tamanho da letra</Text>
            <Text style={s.valor}>{porcentagemLetra}%</Text>
          </View>
          <View style={s.linhaTopo}>
            <Text style={[s.letraA, { fontSize: 16 }]}>A</Text>
            <Text style={[s.letraA, { fontSize: 24 }]}>A</Text>
          </View>
          <Slider
            style={s.slider}
            minimumValue={14} maximumValue={28} step={2}
            value={fontSize} onValueChange={setFontSize}
            minimumTrackTintColor={cores.primary} maximumTrackTintColor={cores.border}
            thumbTintColor={cores.primary}
            accessibilityLabel="Tamanho da letra"
          />
          <Text style={s.exemplo}>Texto de exemplo: tome 1 comprimido a cada 12 horas.</Text>
        </View>

        <View style={s.cartao}>
          <View style={s.linhaSwitch}>
            <View style={{ flex: 1 }}>
              <Text style={s.rotulo}>Alto contraste</Text>
              <Text style={s.descricao}>Cores mais fortes</Text>
            </View>
            <Switch
              value={altoContraste} onValueChange={setAltoContraste}
              trackColor={{ false: cores.border, true: cores.primary }}
              thumbColor={cores.white}
              accessibilityLabel="Alto contraste"
            />
          </View>
        </View>

        <View style={s.cartao}>
          <View style={s.linhaTopo}>
            <Text style={s.rotulo}>Volume do áudio</Text>
            <Text style={s.valor}>{Math.round(volume)}%</Text>
          </View>
          <View style={s.linhaVolume}>
            <VolumeX size={18} color={cores.iconMuted} />
            <Slider
              style={[s.slider, { flex: 1 }]}
              minimumValue={0} maximumValue={100} step={5}
              value={volume} onValueChange={setVolume}
              minimumTrackTintColor={cores.primary} maximumTrackTintColor={cores.border}
              thumbTintColor={cores.primary}
              accessibilityLabel="Volume do áudio"
            />
            <Volume2 size={18} color={cores.iconMuted} />
          </View>
          <TouchableOpacity style={s.botaoTestar} onPress={testarVolume} accessibilityRole="button">
            <Volume2 size={20} color={cores.primary} />
            <Text style={s.botaoTestarTexto}>Testar volume</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.botao} onPress={aplicar} accessibilityRole="button">
          <Text style={s.botaoTexto}>Aplicar ajustes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: SPACING.md, paddingTop: 12 },
  conteudo: { paddingHorizontal: 16, paddingTop: 20, gap: 20 },
  tituloBloco: { gap: 4, paddingHorizontal: 4 },
  titulo: { fontFamily: FONT_FAMILY.titulo, fontSize: 28, lineHeight: 34, color: cores.text },
  subtitulo: { fontFamily: FONT_FAMILY.texto, fontSize: 18, lineHeight: 22, color: cores.textSecondary },
  cartao: {
    padding: 12, gap: 12, borderRadius: RADIUS,
    backgroundColor: cores.background, borderWidth: 1, borderColor: cores.borderSubtle,
  },
  linhaTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  linhaSwitch: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  linhaVolume: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rotulo: { fontFamily: FONT_FAMILY.botao, fontSize: 18, lineHeight: 22, color: cores.text },
  valor: { fontFamily: FONT_FAMILY.botao, fontSize: 18, lineHeight: 22, color: cores.primary },
  descricao: { fontFamily: FONT_FAMILY.texto, fontSize: 16, lineHeight: 22, color: cores.textSecondary },
  letraA: { fontFamily: FONT_FAMILY.botao, color: cores.text },
  slider: { height: MIN_TOUCH },
  exemplo: { fontFamily: FONT_FAMILY.texto, fontSize: 18, lineHeight: 24, color: cores.textSecondary },
  botaoTestar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs,
    height: MIN_TOUCH, borderRadius: RADIUS, borderWidth: 2, borderColor: cores.primary, backgroundColor: cores.white,
  },
  botaoTestarTexto: { fontFamily: FONT_FAMILY.botao, fontSize: 18, color: cores.primary },
  botao: {
    height: BUTTON_HEIGHT, borderRadius: RADIUS, backgroundColor: cores.primary,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 4,
  },
  botaoTexto: { fontFamily: FONT_FAMILY.botao, fontSize: 22, lineHeight: 26, color: cores.white },
});
