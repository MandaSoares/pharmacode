import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, COLORS_ALTO_CONTRASTE } from '../utils/theme';

// Ajustes da tela Configuracoes, compartilhados com o app inteiro.
// Ao salvar, todas as telas que usam useCores/useEstilos/useConfig mudam na hora.
const PADRAO = { fontSize: 18, altoContraste: false, volume: 80 };

const ConfigContext = createContext({ config: PADRAO, salvarConfig: async () => {} });

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(PADRAO);

  useEffect(() => {
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem('config');
        // ?? (e nao ||) para o volume 0% nao virar o valor padrao
        if (salvo) setConfig(atual => ({ ...atual, ...JSON.parse(salvo) }));
      } catch (e) {}
    })();
  }, []);

  async function salvarConfig(novo) {
    const completo = { ...config, ...novo };
    await AsyncStorage.setItem('config', JSON.stringify(completo));
    setConfig(completo);
  }

  return (
    <ConfigContext.Provider value={{ config, salvarConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}

// Paleta atual: normal ou alto contraste
export function useCores() {
  const { config } = useConfig();
  return config.altoContraste ? COLORS_ALTO_CONTRASTE : COLORS;
}

// Escala das letras: 18 (padrao) = 1x, 14 = ~0.8x, 28 = ~1.6x
export function escalaDaFonte(fontSize) {
  return (fontSize ?? PADRAO.fontSize) / PADRAO.fontSize;
}

// Multiplica fontSize e lineHeight de todos os estilos pela escala
export function escalarFontes(estilos, escala) {
  if (escala === 1) return estilos;
  const resultado = {};
  for (const [nome, estilo] of Object.entries(estilos)) {
    resultado[nome] = { ...estilo };
    if (typeof estilo.fontSize === 'number') resultado[nome].fontSize = Math.round(estilo.fontSize * escala);
    if (typeof estilo.lineHeight === 'number') resultado[nome].lineHeight = Math.round(estilo.lineHeight * escala);
  }
  return resultado;
}

// Cria os estilos da tela com a paleta e o tamanho de letra atuais. criarEstilos recebe as cores:
//   const criarEstilos = (cores) => StyleSheet.create({ texto: { color: cores.text, fontSize: 18 } });
//   const s = useEstilos(criarEstilos);
// Os tamanhos de letra sao ajustados sozinhos pela escala de Configuracoes.
export function useEstilos(criarEstilos) {
  const cores = useCores();
  const { config } = useConfig();
  const escala = escalaDaFonte(config.fontSize);
  return useMemo(() => escalarFontes(criarEstilos(cores), escala), [cores, escala, criarEstilos]);
}

// Opcoes de voz com o volume escolhido em Configuracoes (0 a 100% -> 0.0 a 1.0)
export function useOpcoesVoz() {
  const { config } = useConfig();
  return { language: 'pt-BR', rate: 0.8, volume: (config.volume ?? PADRAO.volume) / 100 };
}
