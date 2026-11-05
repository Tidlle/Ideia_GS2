import { Usuario } from '../types';

export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: 'Ana Souza',
    email: 'cidadao@zela.com',
    senha: '123456',
    papel: 'CIDADAO',
    bairro: 'Vila Mariana',
    reputacao: 82,
  },
  {
    id: 2,
    nome: 'Carlos Lima',
    email: 'gestor@zela.com',
    senha: '123456',
    papel: 'GESTOR',
    bairro: 'Subprefeitura Vila Mariana',
  },
  {
    id: 3,
    nome: 'Equipe Luz Norte',
    email: 'executor@zela.com',
    senha: '123456',
    papel: 'EXECUTOR',
    tipo: 'EMPRESA',
    executorId: 1,
  },
  {
    id: 4,
    nome: 'Marina Costa',
    email: 'supervisor@zela.com',
    senha: '123456',
    papel: 'SUPERVISOR',
  },
];
