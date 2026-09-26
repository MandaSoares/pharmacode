import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONDICOES from '../data/condicoes';
import AlergiasEditor from '../components/AlergiasEditor';
import IconeCondicao from '../components/IconeCondicao';
import { useEstilos } from '../context/ConfigContext';
import { FONT_FAMILY, RADIUS } from '../utils/theme';
import { criarFormStyles } from '../utils/formStyles';

// Etapa 2 do cadastro (frame "Form de cadastro" do Figma): condicoes de saude e alergias
export default function FormCadastroScreen({ navigation }) {
  const f = useEstilos(criarFormStyles);
  const s = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const [condicoes, setCondicoes] = useState([]);
  const [alergias, setAlergias] = useState([]);

  function toggleCondicao(id) {
    setCondicoes(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  function irParaHome() {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  async function salvar() {
    try {
      const perfilSalvo = await AsyncStorage.getItem('perfil');
      const perfil = perfilSalvo ? JSON.parse(perfilSalvo) : {};
      await AsyncStorage.setItem('perfil', JSON.stringify({ ...perfil, condicoes, alergias }));
      irParaHome();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente de novo.');
    }
  }

  return (
    <KeyboardAvoidingView style={f.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[f.conteudo, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Etapa 2 de 2 do cadastro */}
        <View style={f.etapas}>
          <View style={f.etapa} />
          <View style={[f.etapa, f.etapaAtual]} />
        </View>

        <Image source={require('../../assets/logo/logo.png')} style={f.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
        <Text style={f.titulo}>Preencha seus dados</Text>
        <Text style={f.descricao}>
          Preencha suas informações. Para avisarmos se o remédio não for indicado para você.
        </Text>

        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Condições de Saúde</Text>
          {CONDICOES.map(c => {
            const marcado = condicoes.includes(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                style={s.linha}
                onPress={() => toggleCondicao(c.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: marcado }}
              >
                <IconeCondicao condicao={c} tamanho={32} />
                <Text style={s.linhaTexto}>{c.label}</Text>
                <View style={[s.checkbox, marcado && s.checkboxMarcado]}>
                  {marcado && <Text style={s.check}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Alergias a Medicamentos</Text>
          <AlergiasEditor alergias={alergias} onChange={setAlergias} />
          <Text style={s.ajuda}>
            Isso nos ajuda a alertar sobre remédios que podem causar reação alérgica em você.
          </Text>
        </View>

        <View style={s.acoes}>
          <TouchableOpacity style={f.botao} onPress={salvar} accessibilityRole="button">
            <Text style={f.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={f.linkArea} onPress={irParaHome} accessibilityRole="link">
            <Text style={f.link}>Pular por agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  secao: { width: '100%', gap: 12 },
  secaoTitulo: { fontFamily: FONT_FAMILY.botao, fontSize: 19, color: cores.textLabel },
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: RADIUS, backgroundColor: cores.background,
  },
  linhaTexto: { flex: 1, fontFamily: FONT_FAMILY.texto, fontSize: 19, color: cores.text },
  checkbox: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: cores.border,
    backgroundColor: cores.white, justifyContent: 'center', alignItems: 'center',
  },
  checkboxMarcado: { backgroundColor: cores.primary, borderColor: cores.primary },
  check: { color: cores.white, fontSize: 16, fontWeight: '700' },
  ajuda: { fontFamily: FONT_FAMILY.legenda, fontSize: 14, lineHeight: 18, color: cores.textSecondary },
  acoes: { width: '100%', gap: 8, paddingTop: 8 },
});
