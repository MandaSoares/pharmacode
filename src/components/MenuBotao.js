import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Modal, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { House, User, Settings, LogOut } from 'lucide-react-native';
import IconeMenu from '../../assets/icons/menu.svg';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONT_FAMILY, RADIUS, MIN_TOUCH } from '../utils/theme';

// cor: nome da cor na paleta (muda com o alto contraste)
const OPCOES = [
  { tela: 'Home', rotulo: 'Início', Icone: House, cor: 'primary' },
  { tela: 'Perfil', rotulo: 'Meu perfil', Icone: User, cor: 'iconMuted' },
  { tela: 'Config', rotulo: 'Configurações', Icone: Settings, cor: 'iconMuted' },
  { tela: 'Login', rotulo: 'Sair', Icone: LogOut, cor: 'iconMuted', sair: true },
];

// Botao de menu (48x48) + menu aberto (frame "Menu Aberto" do Figma, 280px de largura),
// que abre logo abaixo do botao, alinhado pela direita
export default function MenuBotao() {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const navigation = useNavigation();
  const { width: larguraTela } = useWindowDimensions();
  const botaoRef = useRef();
  const [posicao, setPosicao] = useState(null);

  function abrir() {
    botaoRef.current.measureInWindow((x, y, largura, altura) => {
      setPosicao({ top: y + altura + 1, right: larguraTela - (x + largura) - 4 });
    });
  }

  function ir(opcao) {
    setPosicao(null);
    if (opcao.sair) {
      // Sair: volta ao Login sem deixar as telas anteriores no "voltar"
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      navigation.navigate(opcao.tela);
    }
  }

  return (
    <>
      <TouchableOpacity ref={botaoRef} style={s.botao} onPress={abrir} accessibilityLabel="Abrir menu">
        <IconeMenu width={20} height={20} />
      </TouchableOpacity>

      <Modal visible={!!posicao} transparent animationType="fade" onRequestClose={() => setPosicao(null)}>
        {/* Tocar fora do menu fecha */}
        <Pressable style={s.fundo} onPress={() => setPosicao(null)} accessibilityLabel="Fechar menu">
          {posicao && (
            <View style={[s.menu, posicao]}>
              {OPCOES.map(opcao => (
                <TouchableOpacity key={opcao.tela} style={s.item} onPress={() => ir(opcao)} accessibilityRole="menuitem">
                  <opcao.Icone size={20} color={cores[opcao.cor]} strokeWidth={2} />
                  <Text style={s.texto}>{opcao.rotulo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  botao: {
    width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: RADIUS,
    borderWidth: 1, borderColor: cores.borderSubtle, backgroundColor: cores.white,
    justifyContent: 'center', alignItems: 'center',
  },
  fundo: { flex: 1 },
  menu: {
    position: 'absolute', width: 280, padding: 16, gap: 8,
    borderRadius: 16, borderWidth: 1, borderColor: cores.borderSubtle, backgroundColor: cores.background,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    minHeight: 56, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS, backgroundColor: cores.white,
  },
  texto: { flex: 1, fontFamily: FONT_FAMILY.botao, fontSize: 22, color: cores.text },
});
