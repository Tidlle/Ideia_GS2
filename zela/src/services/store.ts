import { categorias } from '../mocks/categorias';
import { executores } from '../mocks/executores';
import { notificacoes } from '../mocks/notificacoes';
import { ocorrencias } from '../mocks/ocorrencias';
import { ordens } from '../mocks/ordens';
import { usuarios } from '../mocks/usuarios';

/**
 * Banco de dados em memória do MVP visual. Os mocks são copiados para cá para que uma ação
 * de um papel (ex.: executor conclui a OS) apareça para os demais ao trocar de usuário.
 * Quando a API Java existir, este arquivo deixa de ser usado e só `services/` muda.
 */
export const db = {
  usuarios: structuredClone(usuarios),
  categorias: structuredClone(categorias),
  executores: structuredClone(executores),
  ocorrencias: structuredClone(ocorrencias),
  ordens: structuredClone(ordens),
  notificacoes: structuredClone(notificacoes),
  /** IDs de ocorrências que o usuário já respondeu em "Confirmar problemas". */
  respondidas: new Set<number>(),
};

let versao = 0;
const ouvintes = new Set<() => void>();

export function notificar() {
  versao += 1;
  ouvintes.forEach((o) => o());
}
export function assinar(o: () => void) {
  ouvintes.add(o);
  return () => {
    ouvintes.delete(o);
  };
}
export const obterVersao = () => versao;

export const proximoId = (lista: { id: number }[]) => Math.max(0, ...lista.map((i) => i.id)) + 1;
