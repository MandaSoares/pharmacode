import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuBotao from '../components/MenuBotao';
import { useEstilos } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const s = useEstilos(criarEstilos);
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      {/* Como no Figma (tela Escanear): so o botao de menu, no canto direito */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <MenuBotao />
      </View>

      <View style={s.centro}>
        <Image source={require('../../assets/logo/logo.png')} style={s.logo} resizeMode="contain" accessibilityLabel="PharmaCode" />
        <Text style={s.titulo}>Escaneie um remedio</Text>
        <Text style={s.descricao}>
          Aponte a camera para o codigo de barras do remedio para ouvir as
          instrucoes de uso e verificar se ha alertas para sua saude.
        </Text>
        <TouchableOpacity
          style={s.botaoEscanear}
          onPress={() => navigation.navigate('Scanner')}
          accessibilityRole="button"
          accessibilityLabel="Escanear remedio"
        >
          <Text style={s.botaoTexto}>Escanear remédio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.white },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20 },
  centro: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg,
  },
  logo: { width: 200, height: undefined, aspectRatio: 864 / 511, marginBottom: SPACING.lg },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: cores.text, textAlign: 'center', marginBottom: SPACING.sm },
  descricao: { fontSize: FONTS.body, color: cores.textSecondary, textAlign: 'center', lineHeight: 26, marginBottom: SPACING.xl },
  botaoEscanear: {
    backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
});
