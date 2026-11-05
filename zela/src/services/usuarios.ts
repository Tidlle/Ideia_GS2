import { Usuario } from '../types';
import { atraso } from './atraso';
import { db, notificar, proximoId } from './store';

export async function autenticar(email: string, senha: string): Promise<Usuario> {
  await atraso(800);
  const u = db.usuarios.find(
    (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.senha === senha,
  );
  if (!u) throw new Error('E-mail ou senha inválidos');
  return u;
}

export async function cadastrarCidadao(dados: {
  nome: string;
  email: string;
  senha: string;
  bairro: string;
}) {
  await atraso(800);
  if (db.usuarios.some((u) => u.email.toLowerCase() === dados.email.trim().toLowerCase())) {
    throw new Error('Já existe uma conta com esse e-mail');
  }
  const novo: Usuario = {
    id: proximoId(db.usuarios),
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    senha: dados.senha,
    papel: 'CIDADAO',
    bairro: dados.bairro.trim(),
    reputacao: 50,
  };
  db.usuarios.push(novo);
  notificar();
  return novo;
}
