import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useEstilos } from '../context/ConfigContext';
import { FONT_FAMILY, RADIUS } from '../utils/theme';

// 4 quadrados de PIN (70x70 no Figma). O cursor pula sozinho entre eles.
// value: array com 4 digitos, ex: ['1', '2', '', '']
// onComplete: chamado quando o 4o digito e preenchido
// ref.focus(): coloca o cursor no primeiro quadrado
const PinInput = forwardRef(function PinInput({ value, onChange, onComplete, rotulo = 'senha' }, ref) {
  const s = useEstilos(criarEstilos);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useImperativeHandle(ref, () => ({
    focus: () => refs[0].current?.focus(),
  }));

  function handleChange(text, index) {
    const digito = text.replace(/\D/g, '');
    const novo = [...value];
    novo[index] = digito;
    onChange(novo);
    if (digito && index < 3) refs[index + 1].current.focus();
    if (digito && index === 3) onComplete?.(novo);
  }

  function handleBackspace(index) {
    if (!value[index] && index > 0) {
      refs[index - 1].current.focus();
      const novo = [...value];
      novo[index - 1] = '';
      onChange(novo);
    }
  }

  return (
    <View style={s.container}>
      {value.map((digito, i) => (
        <TextInput
          key={i}
          ref={refs[i]}
          style={s.caixa}
          value={digito}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') handleBackspace(i);
          }}
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry
          accessibilityLabel={`Digito ${i + 1} da ${rotulo}`}
        />
      ))}
    </View>
  );
});

export default PinInput;

const criarEstilos = (cores) => StyleSheet.create({
  container: { flexDirection: 'row', gap: 16 },
  caixa: {
    width: 70, height: 70, borderRadius: RADIUS,
    backgroundColor: cores.inputBg, borderWidth: 1, borderColor: cores.border,
    textAlign: 'center', fontFamily: FONT_FAMILY.botao, fontSize: 36, color: cores.pinDot,
  },
});
