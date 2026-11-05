import { Categoria } from '../types';

export const categorias: Categoria[] = [
  {
    id: 1,
    nome: 'Iluminação',
    icone: 'bulb-outline',
    executorResponsavelId: 1,
    prazoHoras: 48,
    emissaoAutomatica: true,
    riscoBase: 2,
  },
  {
    id: 2,
    nome: 'Buraco',
    icone: 'alert-circle-outline',
    executorResponsavelId: 2,
    prazoHoras: 72,
    emissaoAutomatica: true,
    riscoBase: 3,
  },
  {
    id: 3,
    nome: 'Entulho',
    icone: 'trash-outline',
    executorResponsavelId: 3,
    prazoHoras: 48,
    emissaoAutomatica: true,
    riscoBase: 1,
  },
  {
    id: 4,
    nome: 'Calçada',
    icone: 'walk-outline',
    executorResponsavelId: 4,
    prazoHoras: 120,
    emissaoAutomatica: false,
    riscoBase: 2,
  },
  {
    id: 5,
    nome: 'Árvore',
    icone: 'leaf-outline',
    executorResponsavelId: 5,
    prazoHoras: 24,
    emissaoAutomatica: false,
    riscoBase: 4,
  },
];
