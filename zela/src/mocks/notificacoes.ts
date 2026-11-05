import { Notificacao } from '../types';
import { emHoras } from './datas';

export const notificacoes: Notificacao[] = [
  {
    id: 1,
    texto: 'Sua ocorrência virou OS: "Poste apagado na Rua Domingos de Morais".',
    data: emHoras(-29),
    lida: false,
  },
  {
    id: 2,
    texto: 'Confirme o problema perto de você: Lâmpada piscando na Praça da Árvore.',
    data: emHoras(-5),
    lida: false,
  },
  {
    id: 3,
    texto: 'Prazo estourado: OS #4 (árvore caída) foi escalada ao supervisor.',
    data: emHoras(-1),
    lida: false,
  },
  {
    id: 4,
    texto: 'O problema da Rua Cubatão foi concluído. Confirme a solução.',
    data: emHoras(-8),
    lida: true,
  },
];
