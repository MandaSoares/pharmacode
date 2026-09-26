import React from 'react';
import { Text } from 'react-native';
import { Droplet, Heart, Hexagon } from 'lucide-react-native';
import { useCores } from '../context/ConfigContext';

// Icones do Figma (Icone/Gota, Icone/Coracao, Icone/Hexagono), preenchidos.
// cor: nome da cor na paleta, para mudar junto com o alto contraste.
const ICONES = {
  diabetes: { Icone: Droplet, cor: 'primary' },
  hipertensao: { Icone: Heart, cor: 'danger' },
  colesterol_alto: { Icone: Hexagon, cor: 'iconHorario' },
};

// Condicoes sem icone no Figma usam o emoji de data/condicoes.js
export default function IconeCondicao({ condicao, tamanho = 26 }) {
  const cores = useCores();
  const item = ICONES[condicao.id];
  if (!item) {
    return <Text style={{ fontSize: tamanho * 0.85, width: tamanho, textAlign: 'center' }}>{condicao.icone}</Text>;
  }
  const cor = cores[item.cor];
  return <item.Icone size={tamanho} color={cor} fill={cor} strokeWidth={1.5} />;
}
