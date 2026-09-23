import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING, BUTTON_HEIGHT, MIN_TOUCH } from '../utils/theme';
import { buscarPorEAN } from '../data/medicamentos';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  if (!permission) return <View style={s.container} />;

  if (!permission.granted) {
    return (
      <View style={s.container}>
        <View style={s.permissao}>
          <Text style={s.permissaoTexto}>
            O app precisa de acesso a camera para escanear o codigo de barras do remedio.
          </Text>
          <TouchableOpacity style={s.botao} onPress={requestPermission}>
            <Text style={s.botaoTexto}>Permitir camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleBarCodeScanned({ data }) {
    if (escaneado) return;
    setEscaneado(true);

    const medicamento = buscarPorEAN(data);
    if (medicamento) {
      navigation.navigate('Bula', { medicamento });
    } else {
      navigation.navigate('NaoEncontrado', { ean: data });
    }

    setTimeout(() => setEscaneado(false), 2000);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()} accessibilityLabel="Voltar">
          <Text style={s.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Escanear Codigo</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>

      <Text style={s.instrucao}>Aponte a camera para o codigo de barras do remedio</Text>

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
      </View>

      <View style={s.rodape}>
        <Text style={s.dica}>Nao esta conseguindo escanear?</Text>
        <TouchableOpacity style={s.botaoSec} onPress={() => navigation.navigate('DigitarCodigo')}>
          <Text style={s.botaoSecTexto}>⌨️  Digitar codigo de barras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.xxl, paddingBottom: SPACING.sm,
  },
  btnVoltar: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center', alignItems: 'center' },
  voltarTexto: { fontSize: 28, color: COLORS.white },
  headerTitulo: { fontSize: FONTS.subtitle, fontWeight: '700', color: COLORS.white },
  instrucao: { fontSize: FONTS.body, color: COLORS.white, textAlign: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  cameraContainer: { flex: 1, marginHorizontal: SPACING.lg, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  scanGuide: { position: 'absolute', top: '30%', left: '10%', right: '10%', height: 120 },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: COLORS.primary },
  rodape: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, alignItems: 'center' },
  dica: { fontSize: FONTS.small, color: '#AAAAAA', marginBottom: SPACING.sm },
  botaoSec: {
    backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', width: '100%',
  },
  botaoSecTexto: { color: COLORS.white, fontSize: FONTS.body, fontWeight: '600' },
  permissao: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg },
  permissaoTexto: { fontSize: FONTS.body, color: COLORS.white, textAlign: 'center', marginBottom: SPACING.lg },
  botao: { backgroundColor: COLORS.primary, height: BUTTON_HEIGHT, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  botaoTexto: { color: COLORS.white, fontSize: FONTS.button, fontWeight: '700' },
});
