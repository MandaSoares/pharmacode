import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCores, useEstilos } from '../context/ConfigContext';
import { FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';
import { buscarMedicamento } from '../services/medicamentos';

export default function ScannerScreen({ navigation }) {
  const cores = useCores();
  const s = useEstilos(criarEstilos);
  const [permission, requestPermission] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  if (!permission) return <View style={s.container} />;

  if (!permission.granted) {
    return (
      <View style={s.container}>
        <View style={s.permissao}>
          <Text style={s.permissaoTexto}>
            O app precisa de acesso à câmera para escanear o código de barras do remédio.
          </Text>
          <TouchableOpacity style={s.botao} onPress={requestPermission}>
            <Text style={s.botaoTexto}>Permitir câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleBarCodeScanned({ data }) {
    if (escaneado) return;
    setEscaneado(true);
    abrirResultado(data);
  }

  async function abrirResultado(ean) {
    try {
      const resultado = await buscarMedicamento(ean);
      if (resultado.status === 'ok') {
        navigation.navigate('Bula', { medicamento: resultado.medicamento });
      } else {
        navigation.navigate('NaoEncontrado', { ean, motivo: resultado.status, nome: resultado.nome });
      }
      setTimeout(() => setEscaneado(false), 2000);
    } catch (e) {
      Alert.alert(
        'Sem conexão com o servidor',
        'Não foi possível buscar o remédio. Confira a internet e tente de novo.',
        [{ text: 'OK', onPress: () => setEscaneado(false) }],
      );
    }
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()} accessibilityLabel="Voltar">
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Escanear Código</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>

      <Text style={s.instrucao}>Aponte a câmera para o código de barras do remédio</Text>

      <View style={s.cameraContainer}>
        <CameraView
          style={s.camera}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a'] }}
          onBarcodeScanned={escaneado ? undefined : handleBarCodeScanned}
        />
        <View style={s.scanGuide}>
          <View style={[s.corner, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }]} />
          <View style={[s.corner, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }]} />
          <View style={[s.corner, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
          <View style={[s.corner, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }]} />
        </View>
        {escaneado && (
          <View style={s.buscando}>
            <ActivityIndicator size="large" color={cores.white} />
            <Text style={s.buscandoTexto}>Buscando remédio...</Text>
          </View>
        )}
      </View>

      <View style={s.rodape}>
        <Text style={s.dica}>Não está conseguindo escanear?</Text>
        <TouchableOpacity style={s.botaoSec} onPress={() => navigation.navigate('DigitarCodigo')}>
          <Text style={s.botaoSecTexto}>⌨️  Digitar código de barras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const criarEstilos = (cores) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm,
  },
  btnVoltar: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'center' },
  voltarTexto: { fontSize: 28, color: cores.white },
  headerTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: cores.white },
  instrucao: { fontSize: FONTS.body, color: cores.white, textAlign: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  cameraContainer: { flex: 1, marginHorizontal: SPACING.lg, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  scanGuide: { position: 'absolute', top: '30%', left: '10%', right: '10%', height: 120 },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: cores.primary },
  buscando: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', gap: SPACING.sm,
  },
  buscandoTexto: { fontSize: FONTS.body, color: cores.white, fontWeight: '600' },
  rodape: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, alignItems: 'center' },
  dica: { fontSize: FONTS.small, color: '#AAAAAA', marginBottom: SPACING.sm },
  botaoSec: {
    backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoSecTexto: { color: cores.white, fontSize: FONTS.body, fontWeight: '600' },
  permissao: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg },
  permissaoTexto: { fontSize: FONTS.body, color: cores.white, textAlign: 'center', marginBottom: SPACING.lg },
  botao: { backgroundColor: cores.primary, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  botaoTexto: { color: cores.white, fontSize: FONTS.button, fontWeight: '700' },
});