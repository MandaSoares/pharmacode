import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConfigProvider } from './src/context/ConfigContext';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
// Importa cada peso separado para o app nao carregar todas as variacoes da fonte
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { AtkinsonHyperlegibleNext_400Regular } from '@expo-google-fonts/atkinson-hyperlegible-next/400Regular';
import { AtkinsonHyperlegibleNext_500Medium } from '@expo-google-fonts/atkinson-hyperlegible-next/500Medium';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import FormCadastroScreen from './src/screens/FormCadastroScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import DigitarCodigoScreen from './src/screens/DigitarCodigoScreen';
import BulaScreen from './src/screens/BulaScreen';
import AlertaScreen from './src/screens/AlertaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import NaoEncontradoScreen from './src/screens/NaoEncontradoScreen';

const Stack = createStackNavigator();

// Mantem a tela de abertura enquanto as fontes carregam
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Nunito_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    AtkinsonHyperlegibleNext_400Regular,
    AtkinsonHyperlegibleNext_500Medium,
  });

  useEffect(() => {
    if (fontesCarregadas || erroFontes) SplashScreen.hideAsync();
  }, [fontesCarregadas, erroFontes]);

  if (!fontesCarregadas && !erroFontes) return null;

  return (
    <SafeAreaProvider>
      <ConfigProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Inicio"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
            <Stack.Screen name="FormCadastro" component={FormCadastroScreen} />
            <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="DigitarCodigo" component={DigitarCodigoScreen} />
            <Stack.Screen name="Bula" component={BulaScreen} />
            <Stack.Screen name="Alerta" component={AlertaScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="Config" component={ConfigScreen} />
            <Stack.Screen name="NaoEncontrado" component={NaoEncontradoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ConfigProvider>
    </SafeAreaProvider>
  );
}
