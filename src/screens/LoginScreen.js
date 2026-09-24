import React, { useRef, useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert,
  Keyboard, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinInput from '../components/PinInput';
import { formatCPF, CPF_COMPLETO } from '../utils/formatar';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONTS, FONT_FAMILY, SPACING, BUTTON_HEIGHT, INPUT_HEIGHT } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const [cpf, setCpf] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRef = useRef();

  function handleCpfChange(t) {
    const formatado = formatCPF(t);
    setCpf(formatado);
    // CPF completo: pula direto para a senha
    if (formatado.length === CPF_COMPLETO) {
      pinRef.current.focus();
    }
  }

  // Confere CPF e PIN com a conta salva no celular pelo Cadastro
  async function entrar() {
    Keyboard.dismiss();
    if (cpf.length !== CPF_COMPLETO || pin.join('').length !== 4) {
      return Alert.alert('Dados incompletos', 'Digite seu CPF e os 4 números da senha.');
    }
    try {
      const salva = await AsyncStorage.getItem('conta');
      if (!salva) {
        return Alert.alert('Nenhuma conta encontrada', 'Cadastre-se para usar o app.', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cadastrar', onPress: () => navigation.navigate('Cadastro') },
        ]);
      }
      const conta = JSON.parse(salva);
      if (conta.cpf !== cpf || conta.pin !== pin.join('')) {
        setPin(['', '', '', '']);
        return Alert.alert('CPF ou senha incorretos', 'Confira os números e tente de novo.');
      }
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível entrar. Tente de novo.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Tocar fora dos campos fecha o teclado; arrastar a tela tambem */}
      <ScrollView
        contentContainerStyle={s.scrollConteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={s.centro}>
          <Image source={require('../../assets/logo/logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
          <Text style={s.titulo}>Acesse sua conta</Text>

          <View style={s.campoGrupo}>
            <Text style={s.label}>Seu CPF</Text>
            <TextInput
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

          <View style={s.campoGrupo}>
            <Text style={s.label}>Sua senha (4 numeros)</Text>
            {/* Ultimo digito: fecha o teclado para o botao Entrar ficar visivel */}
            <PinInput ref={pinRef} value={pin} onChange={setPin} onComplete={Keyboard.dismiss} />
            <Text style={s.ajuda}>Igual a senha do cartao do banco</Text>
          </View>

          <TouchableOpacity
            style={s.botao}
            onPress={entrar}
            accessibilityRole="button"
            accessibilityLabel="Entrar no app"
          >
            <Text style={s.botaoTexto}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.linkArea} onPress={() => navigation.navigate('Cadastro')} accessibilityRole="link">
            <Text style={s.link}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.linkArea} onPress={() => navigation.navigate('RecuperarSenha')} accessibilityRole="link">
            <Text style={s.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  scrollConteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  centro: { alignItems: 'center' },
  logo: { width: 150, height: undefined, aspectRatio: 864 / 511, marginBottom: SPACING.md },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: cores.text, marginBottom: SPACING.xl },
  campoGrupo: { width: '100%', marginBottom: SPACING.lg },
  label: { fontSize: FONTS.subtitle, fontWeight: '700', color: cores.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: cores.inputBg, height: INPUT_HEIGHT, borderRadius: 12,
    paddingHorizontal: SPACING.md, fontSize: FONTS.button, color: cores.text,
    borderWidth: 1, borderColor: cores.border,
  },
  ajuda: { fontSize: FONTS.small, color: cores.textSecondary, marginTop: SPACING.xs },
  botao: {
    backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
  linkArea: { width: '100%', alignItems: 'center', paddingTop: SPACING.sm, minHeight: 44, justifyContent: 'center' },
  link: { fontFamily: FONT_FAMILY.link, fontSize: FONTS.small, color: cores.primary, textDecorationLine: 'underline' },
});
