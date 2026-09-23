import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONDICOES from '../data/condicoes';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function PerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [condicoes, setCondicoes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nomeEdit, setNomeEdit] = useState('');
  const [condicoesEdit, setCondicoesEdit] = useState([]);

  useEffect(() => { carregarPerfil(); }, []);

  async function carregarPerfil() {
    try {
      const perfil = await AsyncStorage.getItem('perfil');
      if (perfil) {
        const p = JSON.parse(perfil);
        setNome(p.nome || '');
        setCondicoes(p.condicoes || []);
      }
    } catch (e) {}
  }

  function iniciarEdicao() {
    setNomeEdit(nome);
    setCondicoesEdit([...condicoes]);
    setEditando(true);
  }

  function toggleCondicao(id) {
    setCondicoesEdit(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  async function salvar() {
    try {
      await AsyncStorage.setItem('perfil', JSON.stringify({ nome: nomeEdit, condicoes: condicoesEdit }));
      setNome(nomeEdit);
      setCondicoes(condicoesEdit);
      setEditando(false);
      Alert.alert('Perfil salvo', 'Suas informacoes foram atualizadas.');
    } catch (e) { Alert.alert('Erro', 'Nao foi possivel salvar.'); }
  }

  if (editando) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity style={s.btnVoltar} onPress={() => setEditando(false)}>
            <Text style={s.voltarTexto}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitulo}>Editar Perfil</Text>
          <View style={{ width: MIN_TOUCH }} />
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent}>
          <View style={s.campoGrupo}>
            <Text style={s.label}>Nome</Text>
            <TextInput style={s.input} value={nomeEdit} onChangeText={setNomeEdit} />
          </View>
          <View style={s.campoGrupo}>
            <Text style={s.label}>Condicoes</Text>
            <Text style={s.ajuda}>Marque as condicoes que voce tem. Assim, avisamos se algum remedio nao for indicado pra voce.</Text>
            {CONDICOES.map(c => (
              <TouchableOpacity key={c.id} style={s.condicaoRow} onPress={() => toggleCondicao(c.id)}>
                <Text style={s.condicaoIcone}>{c.icone}</Text>
                <Text style={s.condicaoLabel}>{c.label}</Text>
                <View style={[s.checkbox, condicoesEdit.includes(c.id) && s.checkboxAtivo]}>
                  {condicoesEdit.includes(c.id) && <Text style={s.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.botao} onPress={salvar}>
            <Text style={s.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Meu Perfil</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={s.scrollContent}>
          <View style={{ alignSelf: 'center', marginVertical: SPACING.lg }}><Text style={{ fontSize: 64 }}>👤</Text></View>
          <View style={s.campoGrupo}>
            <Text style={s.label}>Nome</Text>
            <Text style={s.valor}>{nome || 'Nao informado'}</Text>
          </View>
          <View style={s.campoGrupo}>
            <Text style={s.label}>Condicoes</Text>
            {condicoes.length === 0 ? (
              <Text style={s.valor}>Nenhuma condicao cadastrada</Text>
            ) : condicoes.map(cId => {
              const c = CONDICOES.find(cd => cd.id === cId);
              return c ? (
                <View key={c.id} style={s.condicaoTag}>
                  <Text style={s.condicaoTagTexto}>{c.icone} {c.label}</Text>
                </View>
              ) : null;
            })}
          </View>
          <TouchableOpacity style={s.botao} onPress={iniciarEdicao}>
            <Text style={s.botaoTexto}>Alterar perfil</Text>
          </TouchableOpacity>
        </View>
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
  scrollContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  campoGrupo: { marginBottom: SPACING.lg },
  label: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  valor: { fontSize: FONTS.body, color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.inputBg, height: 56, borderRadius: 12,
    paddingHorizontal: SPACING.md, fontSize: FONTS.body, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  ajuda: { fontSize: FONTS.small, color: COLORS.textSecondary, marginBottom: SPACING.md },
  condicaoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm,
    minHeight: MIN_TOUCH, borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  condicaoIcone: { fontSize: 24, marginRight: SPACING.sm },
  condicaoLabel: { fontSize: FONTS.body, color: COLORS.text, flex: 1 },
  checkbox: { width: 32, height: 32, borderRadius: 8, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  checkboxAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  condicaoTag: { backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginTop: SPACING.xs, alignSelf: 'flex-start' },
  condicaoTagTexto: { fontSize: FONTS.body, color: COLORS.text },
  botao: { backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
});
