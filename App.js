import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InicioScreen from './src/screens/InicioScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import DigitarCodigoScreen from './src/screens/DigitarCodigoScreen';
import BulaScreen from './src/screens/BulaScreen';
import AlertaScreen from './src/screens/AlertaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import NaoEncontradoScreen from './src/screens/NaoEncontradoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
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
  );
}
