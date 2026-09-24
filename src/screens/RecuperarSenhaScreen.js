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

function mesmoNome(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

// Sem servidor ainda: confirma a identidade com nome + CPF da conta salva no celular
export default function RecuperarSenhaScreen({ navigation }) {
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

  async function redefinir() {
    Keyboard.dismiss();
    if (!nome.trim() || cpf.length !== CPF_COMPLETO) {
      return Alert.alert('Dados incompletos', 'Digite seu nome completo e os 11 números do CPF.');
    }
    if (pin.join('').length !== 4) return Alert.alert('Senha incompleta', 'Digite os 4 números da nova senha.');
    if (pin.join('') !== pinRepetido.join('')) {
      setPinRepetido(PIN_VAZIO);
      return Alert.alert('As senhas não são iguais', 'Digite a mesma senha nos dois campos.');
    }

    try {
      const salva = await AsyncStorage.getItem('conta');
      const conta = salva ? JSON.parse(salva) : null;
      if (!conta || conta.cpf !== cpf || !mesmoNome(conta.nome, nome)) {
        return Alert.alert('Conta não encontrada', 'O nome ou o CPF não conferem com a conta cadastrada neste celular.');
      }
      await AsyncStorage.setItem('conta', JSON.stringify({ ...conta, pin: pin.join('') }));
      Alert.alert('Senha alterada', 'Agora entre com a sua nova senha.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível alterar a senha. Tente de novo.');
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[s.conteudo, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Image source={require('../../assets/logo/logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
        <Text style={s.titulo}>Esqueceu a senha?</Text>
        <Text style={s.descricao}>Confirme seus dados e crie uma senha nova.</Text>

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
            <Text style={s.label}>Nova senha (PIN de 4 números)</Text>
            <PinInput ref={pinRef} value={pin} onChange={setPin} onComplete={() => pinRepetidoRef.current.focus()} rotulo="nova senha" />
          </View>

          <View style={[s.campoGrupo, s.campoPin]}>
            <Text style={s.label}>Repita a nova senha</Text>
            <PinInput ref={pinRepetidoRef} value={pinRepetido} onChange={setPinRepetido} onComplete={Keyboard.dismiss} rotulo="nova senha repetida" />
          </View>
        </View>

        <TouchableOpacity style={s.botao} onPress={redefinir} accessibilityRole="button">
          <Text style={s.botaoTexto}>Alterar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.linkArea} onPress={() => navigation.navigate('Login')} accessibilityRole="link">
          <Text style={s.link}>Lembrei a senha. Voltar ao Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

