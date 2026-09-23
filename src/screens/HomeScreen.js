import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.btnMenu}
          onPress={() => setMenuAberto(true)}
          accessibilityLabel="Abrir menu"
        >
          <Text style={s.menuIcone}>☰</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>PharmaCode</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>

      <Modal
        visible={menuAberto}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuAberto(false)}
      >
        <TouchableOpacity
          style={s.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuAberto(false)}
        >
          <View style={s.menuConteudo}>
            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuAberto(false); }}>
              <Text style={s.menuTexto}>🏠  Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuAberto(false); navigation.navigate('Perfil'); }}>
              <Text style={s.menuTexto}>👤  Meu perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuAberto(false); navigation.navigate('Config'); }}>
              <Text style={s.menuTexto}>⚙️  Configuracoes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.menuItem, s.menuSair]} onPress={() => { setMenuAberto(false); navigation.navigate('Login'); }}>
              <Text style={[s.menuTexto, { color: COLORS.danger }]}>🚪  Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={s.centro}>
        <Text style={s.logoIcone}>💊</Text>
        <Text style={s.logoTexto}>PharmaCode</Text>
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
          <Text style={s.botaoTexto}>📷  Escanear remedio</Text>
        </TouchableOpacity>
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
  btnMenu: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'center' },
  menuIcone: { fontSize: 28 },
  headerTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.primary },
  centro: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.lg,
  },
  logoIcone: { fontSize: 64, marginBottom: SPACING.sm },
  logoTexto: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.md },
  titulo: { fontSize: FONTS.title, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  descricao: { fontSize: FONTS.body, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26, marginBottom: SPACING.xl },
  botaoEscanear: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start' },
  menuConteudo: {
    backgroundColor: COLORS.white, marginTop: 80, marginHorizontal: SPACING.lg,
    borderRadius: 16, paddingVertical: SPACING.sm, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  menuItem: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, minHeight: MIN_TOUCH, justifyContent: 'center' },
  menuTexto: { fontSize: FONTS.button, color: COLORS.text, fontWeight: '600' },
  menuSair: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.xs },
});
