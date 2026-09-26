import React, { useRef, useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, Alert,
  Keyboard, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinInput from '../components/PinInput';
import { formatCPF, CPF_COMPLETO } from '../utils/formatar';
import { useCores, useEstilos } from '../context/ConfigContext';
import { criarFormStyles } from '../utils/formStyles';

const PIN_VAZIO = ['', '', '', ''];

export default function CadastroScreen({ navigation }) {
  const cores = useCores();
  const s = useEstilos(criarFormStyles);
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [pin, setPin] = useState(PIN_VAZIO);
  const [pinRepetido, setPinRepetido] = useState(PIN_VAZIO);
  const cpfRef = useRef();
  const pinRef = useRef();
  const pinRepetidoRef = useRef();

  function handleCpfChange(t) {
    const formatado = formatCPF(t);
    setCpf(formatado);
    if (formatado.length === CPF_COMPLETO) pinRef.current.focus();
  }

  async function criarConta() {
    Keyboard.dismiss();
    if (!nome.trim()) return Alert.alert('Falta o nome', 'Digite seu nome completo.');
    if (cpf.length !== CPF_COMPLETO) return Alert.alert('CPF incompleto', 'Digite os 11 números do seu CPF.');
    if (pin.join('').length !== 4) return Alert.alert('Senha incompleta', 'Digite os 4 números da sua senha.');
    if (pin.join('') !== pinRepetido.join('')) {
      setPinRepetido(PIN_VAZIO);
      return Alert.alert('As senhas não são iguais', 'Digite a mesma senha nos dois campos.');
    }

    try {
      await AsyncStorage.setItem('conta', JSON.stringify({ nome: nome.trim(), cpf, pin: pin.join('') }));
      // Leva o nome para o perfil de saude, mantendo condicoes que ja existam
      const perfilSalvo = await AsyncStorage.getItem('perfil');
      const perfil = perfilSalvo ? JSON.parse(perfilSalvo) : { condicoes: [] };
      await AsyncStorage.setItem('perfil', JSON.stringify({ ...perfil, nome: nome.trim() }));
      navigation.navigate('FormCadastro');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente de novo.');
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Tocar fora dos campos fecha o teclado; arrastar a tela tambem */}
      <ScrollView
        contentContainerStyle={[s.conteudo, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Etapa 1 de 2 do cadastro */}
        <View style={s.etapas}>
          <View style={[s.etapa, s.etapaAtual]} />
          <View style={s.etapa} />
        </View>

        <Image source={require('../../assets/logo/logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
        <Text style={s.titulo}>Crie sua conta</Text>

        <View style={s.campos}>
          <View style={s.campoGrupo}>
            <Text style={s.label}>Nome completo</Text>
            <TextInput
              style={s.input}
              placeholder="Digite seu nome"
              placeholderTextColor={cores.textPlaceholder}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => cpfRef.current.focus()}
              submitBehavior="submit"
            />
          </View>

          <View style={s.campoGrupo}>
            <Text style={s.label}>Seu CPF</Text>
            <TextInput
              ref={cpfRef}
              style={s.input}
              placeholder="000.000.000-00"
              placeholderTextColor={cores.textPlaceholder}
              value={cpf}
              onChangeText={handleCpfChange}
              keyboardType="number-pad"
              maxLength={CPF_COMPLETO}
              accessibilityLabel="Campo para digitar o CPF"
            />
          </View>

          <View style={[s.campoGrupo, s.campoPin]}>
            <Text style={s.label}>Sua senha (PIN de 4 números)</Text>
            <PinInput ref={pinRef} value={pin} onChange={setPin} onComplete={() => pinRepetidoRef.current.focus()} />
          </View>

          <View style={[s.campoGrupo, s.campoPin]}>
            <Text style={s.label}>Repita o PIN</Text>
            <PinInput ref={pinRepetidoRef} value={pinRepetido} onChange={setPinRepetido} onComplete={Keyboard.dismiss} rotulo="senha repetida" />
          </View>
        </View>

        <TouchableOpacity style={s.botao} onPress={criarConta} accessibilityRole="button">
          <Text style={s.botaoTexto}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.linkArea} onPress={() => navigation.navigate('Login')} accessibilityRole="link">
          <Text style={s.link}>Já tem uma conta? Faça Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

