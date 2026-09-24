import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ban } from 'lucide-react-native';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONT_FAMILY, RADIUS } from '../utils/theme';
import { criarFormStyles } from '../utils/formStyles';

// Chips de alergia: tocar no chip remove, "+ Adicionar alergia" abre um campo de texto
export default function AlergiasEditor({ alergias, onChange }) {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const f = useEstilos(criarFormStyles);
  const [adicionando, setAdicionando] = useState(false);
  const [nova, setNova] = useState('');

  function adicionar() {
    const texto = nova.trim();
    if (texto && !alergias.some(a => a.toLowerCase() === texto.toLowerCase())) {
      onChange([...alergias, texto]);
    }
    setNova('');
    setAdicionando(false);
  }

  return (
    <View style={s.container}>
      <View style={s.chips}>
        {alergias.map(a => (
          <TouchableOpacity
            key={a}
            style={s.chip}
            onPress={() => onChange(alergias.filter(x => x !== a))}
            accessibilityLabel={`Remover alergia ${a}`}
          >
            <Text style={s.chipTexto}>{a}</Text>
            <Text style={s.chipRemover}>⊗</Text>
          </TouchableOpacity>
        ))}
        {!adicionando && (
          <TouchableOpacity style={[s.chip, s.chipAdicionar]} onPress={() => setAdicionando(true)}>
            <Text style={[s.chipTexto, s.chipAdicionarTexto]}>+  Adicionar alergia</Text>
          </TouchableOpacity>
        )}
      </View>
      {adicionando && (
        <View style={s.novaAlergia}>
          <TextInput
            style={[f.input, { flex: 1 }]}
            placeholder="Ex: Dipirona"
            placeholderTextColor={cores.textPlaceholder}
            value={nova}
            onChangeText={setNova}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={adicionar}
          />
          <TouchableOpacity style={s.btnOk} onPress={adicionar}>
            <Text style={s.btnOkTexto}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Chip so para leitura (tela Meu Perfil): rosado, com o simbolo ⊘ do Figma
export function AlergiaChip({ nome }) {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  return (
    <View style={s.chipLeitura} accessibilityLabel={`Alergia a ${nome}`}>
      <Ban size={14} color={cores.dangerText} strokeWidth={2.5} />
      <Text style={s.chipLeituraTexto}>{nome}</Text>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 36, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 18, backgroundColor: cores.background, borderWidth: 1, borderColor: cores.borderSubtle,
  },
  chipTexto: { fontFamily: FONT_FAMILY.texto, fontSize: 16, color: cores.text },
  chipRemover: { fontSize: 16, color: cores.textSecondary },
  chipAdicionar: { backgroundColor: cores.white, borderColor: cores.primary },
  chipAdicionarTexto: { color: cores.primary },
  novaAlergia: { flexDirection: 'row', gap: 8 },
  btnOk: {
    width: 64, height: 54, borderRadius: RADIUS, backgroundColor: cores.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  btnOkTexto: { fontFamily: FONT_FAMILY.botao, fontSize: 18, color: cores.white },
  chipLeitura: {
    flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 18, backgroundColor: cores.dangerLight, borderWidth: 1, borderColor: cores.dangerBorderSoft,
  },
  chipLeituraTexto: { fontFamily: FONT_FAMILY.link, fontSize: 15, color: cores.dangerText },
});
