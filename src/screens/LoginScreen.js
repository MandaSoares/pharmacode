import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, INPUT_HEIGHT } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  function formatCPF(value) {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function handlePinChange(text, index) {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);
    if (text && index < 3) {
      pinRefs[index + 1].current.focus();
    }
  }

  function handlePinBackspace(index) {
    if (!pin[index] && index > 0) {
      pinRefs[index - 1].current.focus();
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
    }
  }

  return (
    <View style={s.container}>
      <View style={s.centro}>
        <Text style={s.logoIcone}>💊</Text>
        <Text style={s.logoTexto}>PharmaCode</Text>
        <Text style={s.titulo}>Acesse sua conta</Text>

        <View style={s.campoGrupo}>
          <Text style={s.label}>Seu CPF</Text>
          <TextInput
            style={s.input}
            placeholder="000.000.000-00"
            placeholderTextColor={COLORS.textPlaceholder}
            value={cpf}
            onChangeText={(t) => setCpf(formatCPF(t))}
            keyboardType="numeric"
            maxLength={14}
            accessibilityLabel="Campo para digitar o CPF"
          />
        </View>

        <View style={s.campoGrupo}>
          <Text style={s.label}>Sua senha (4 numeros)</Text>
          <View style={s.pinContainer}>
            {pin.map((digit, i) => (
              <TextInput
                key={i}
                ref={pinRefs[i]}
                style={s.pinBox}
                value={digit}
                onChangeText={(t) => handlePinChange(t.replace(/\D/g, ''), i)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') handlePinBackspace(i);
                }}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry
                accessibilityLabel={`Digito ${i + 1} da senha`}
              />
            ))}
          </View>
          <Text style={s.ajuda}>Igual a senha do cartao do banco</Text>
        </View>

        <TouchableOpacity
          style={s.botao}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Entrar no app"
        >
          <Text style={s.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={s.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  centro: { alignItems: 'center' },
  logoIcone: { fontSize: 48, marginBottom: SPACING.xs },
  logoTexto: { fontSize: 24, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.md },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xl },
  campoGrupo: { width: '100%', marginBottom: SPACING.lg },
  label: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.inputBg, height: INPUT_HEIGHT, borderRadius: 12,
    paddingHorizontal: SPACING.md, fontSize: FONTS.button, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  pinContainer: { flexDirection: 'row', gap: 16 },
  pinBox: {
    width: 65, height: 65, backgroundColor: COLORS.inputBg, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, textAlign: 'center',
    fontSize: 28, fontWeight: '700', color: COLORS.text,
  },
  ajuda: { fontSize: FONTS.small, color: COLORS.textSecondary, marginTop: SPACING.xs },
  botao: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: SPACING.md,
  },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
  link: { color: COLORS.primary, fontSize: FONTS.body, marginTop: SPACING.sm },
});
