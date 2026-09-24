import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import CONDICOES from '../data/condicoes';
import MenuBotao from '../components/MenuBotao';
import IconeCondicao from '../components/IconeCondicao';
import AlergiasEditor, { AlergiaChip } from '../components/AlergiasEditor';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONT_FAMILY, RADIUS, BUTTON_HEIGHT } from '../utils/theme';

// Frames "Perfil de Saude" e "Perfil de Saude (Editar)" do Figma
export default function PerfilScreen() {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [condicoes, setCondicoes] = useState([]);
  const [alergias, setAlergias] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nomeEdit, setNomeEdit] = useState('');
  const [condicoesEdit, setCondicoesEdit] = useState([]);
  const [alergiasEdit, setAlergiasEdit] = useState([]);

  useEffect(() => { carregarPerfil(); }, []);

  async function carregarPerfil() {
    try {
      const perfil = await AsyncStorage.getItem('perfil');
      if (perfil) {
        const p = JSON.parse(perfil);
        setNome(p.nome || '');
        setCondicoes(p.condicoes || []);
        setAlergias(p.alergias || []);
      }
    } catch (e) {}
  }

  function iniciarEdicao() {
    setNomeEdit(nome);
    setCondicoesEdit([...condicoes]);
    setAlergiasEdit([...alergias]);
    setEditando(true);
  }

  function toggleCondicao(id) {
    setCondicoesEdit(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  async function salvar() {
    try {
      // Le o perfil salvo antes para nao apagar campos que esta tela nao edita
      const salvo = await AsyncStorage.getItem('perfil');
      const perfil = salvo ? JSON.parse(salvo) : {};
      await AsyncStorage.setItem('perfil', JSON.stringify({
        ...perfil, nome: nomeEdit.trim(), condicoes: condicoesEdit, alergias: alergiasEdit,
      }));
      setNome(nomeEdit.trim());
      setCondicoes(condicoesEdit);
      setAlergias(alergiasEdit);
      setEditando(false);
      Alert.alert('Perfil salvo', 'Suas informações foram atualizadas.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente de novo.');
    }
  }

  const condicoesDoPerfil = condicoes.map(id => CONDICOES.find(c => c.id === id)).filter(Boolean);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <MenuBotao />
      </View>

      <ScrollView
        contentContainerStyle={[s.conteudo, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <Avatar cores={cores} />
        <Text style={s.titulo}>Meu Perfil</Text>

        {editando ? (
          <>
            <View style={s.bloco}>
              <Text style={s.rotulo}>Nome</Text>
              <TextInput
                style={[s.caixa, s.caixaTexto]}
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholder="Digite seu nome"
                placeholderTextColor={cores.textPlaceholder}
                autoCapitalize="words"
                accessibilityLabel="Nome"
              />
            </View>

            <View style={s.bloco}>
              <Text style={s.rotulo}>Condições</Text>
              <Text style={s.descricao}>
                Marque suas condições. Assim, avisamos se algum remédio não for indicado para você.
              </Text>
              {CONDICOES.map(c => {
                const marcado = condicoesEdit.includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.caixa, s.linhaCondicao, s.linhaEditavel]}
                    onPress={() => toggleCondicao(c.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: marcado }}
                  >
                    <IconeCondicao condicao={c} />
                    <Text style={[s.caixaTexto, { flex: 1 }]}>{c.label}</Text>
                    <View style={[s.checkbox, marcado && s.checkboxMarcado]}>
                      {marcado && <Check size={20} color={cores.white} strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.bloco}>
              <Text style={s.rotulo}>Alergias</Text>
              <AlergiasEditor alergias={alergiasEdit} onChange={setAlergiasEdit} />
            </View>

            <TouchableOpacity style={s.botao} onPress={salvar} accessibilityRole="button">
              <Text style={s.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.linkArea} onPress={() => setEditando(false)} accessibilityRole="button">
              <Text style={s.link}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={s.bloco}>
              <Text style={s.rotulo}>Nome</Text>
              <View style={s.caixa}>
                <Text style={[s.caixaTexto, !nome && s.vazio]}>{nome || 'Não informado'}</Text>
              </View>
            </View>

            <View style={s.bloco}>
              <Text style={s.rotulo}>Condições</Text>
              {condicoesDoPerfil.length === 0 ? (
                <View style={s.caixa}>
                  <Text style={[s.caixaTexto, s.vazio]}>Nenhuma condição cadastrada</Text>
                </View>
              ) : condicoesDoPerfil.map(c => (
                <View key={c.id} style={[s.caixa, s.linhaCondicao]}>
                  <IconeCondicao condicao={c} />
                  <Text style={[s.caixaTexto, { flex: 1 }]}>{c.label}</Text>
                </View>
              ))}
            </View>

            <View style={[s.bloco, s.blocoAlergias]}>
              <Text style={s.rotulo}>Alergias a medicamentos</Text>
              {alergias.length === 0 ? (
                <Text style={[s.caixaTexto, s.vazio]}>Nenhuma alergia cadastrada</Text>
              ) : (
                <View style={s.chips}>
                  {alergias.map(a => <AlergiaChip key={a} nome={a} />)}
                </View>
              )}
            </View>

            <TouchableOpacity style={s.botao} onPress={iniciarEdicao} accessibilityRole="button">
              <Text style={s.botaoTexto}>Alterar perfil</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Avatar do Figma: circulo de 96px com anel azul e silhueta cinza
function Avatar({ cores }) {
  return (
    <View
      style={{
        width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: cores.primary,
        backgroundColor: cores.white, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
      }}
      accessibilityLabel="Foto do perfil"
    >
      <Svg width={88} height={88} viewBox="0 0 88 88">
        <Circle cx={44} cy={33} r={13} fill={cores.textPlaceholder} />
        <Rect x={24} y={51} width={40} height={22} rx={11} fill={cores.textPlaceholder} />
      </Svg>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12 },
  conteudo: { paddingHorizontal: 20, paddingTop: 18, gap: 20 },
  titulo: { fontFamily: FONT_FAMILY.titulo, fontSize: 28, lineHeight: 34, color: cores.text, textAlign: 'center' },
  bloco: { gap: 12 },
  blocoAlergias: { gap: 20 },
  rotulo: { fontFamily: FONT_FAMILY.texto, fontSize: 20, lineHeight: 26, color: cores.text },
  descricao: { fontFamily: FONT_FAMILY.texto, fontSize: 16, lineHeight: 22, color: cores.textSecondary },
  // Caixa cinza-clara do Figma (58px) usada no nome e nas condicoes
  caixa: {
    minHeight: 58, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: RADIUS, backgroundColor: cores.background,
  },
  caixaTexto: { fontFamily: FONT_FAMILY.texto, fontSize: 20, lineHeight: 26, color: cores.text },
  vazio: { color: cores.textSecondary },
  linhaCondicao: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  linhaEditavel: { minHeight: 68 },
  checkbox: {
    width: 36, height: 36, borderRadius: 8, borderWidth: 2, borderColor: cores.border,
    backgroundColor: cores.white, justifyContent: 'center', alignItems: 'center',
  },
  checkboxMarcado: { backgroundColor: cores.primary, borderColor: cores.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  botao: {
    height: BUTTON_HEIGHT, borderRadius: RADIUS, backgroundColor: cores.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoTexto: { fontFamily: FONT_FAMILY.botao, fontSize: 22, lineHeight: 26, color: cores.white },
  linkArea: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  link: { fontFamily: FONT_FAMILY.link, fontSize: 16, color: cores.primary, textDecorationLine: 'underline' },
});
