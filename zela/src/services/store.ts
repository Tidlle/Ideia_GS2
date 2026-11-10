import { Categoria, Executor, Ocorrencia, OrdemServico } from '../types';

/**
 * Cache local dos dados vindos da API Java. Os services gravam aqui o que a API devolve, e as telas
 * consultam nomes e detalhes (categoria de uma ocorrência, executor de uma OS) sem nova chamada.
 * A fonte da verdade é sempre a API: nada é criado ou alterado só no aparelho.
 */
export const db = {
  categorias: [] as Categoria[],
  executores: [] as Executor[],
  ocorrencias: [] as Ocorrencia[],
  ordens: [] as OrdemServico[],
};

/** Insere ou atualiza itens no cache (pelo id), mesclando com o que já se sabe deles. */
export function guardar<T extends { id: number }>(lista: T[], itens: T[]) {
  for (const item of itens) {
    const i = lista.findIndex((x) => x.id === item.id);
    if (i >= 0) lista[i] = { ...lista[i], ...item };
    else lista.push(item);
  }
}

/** Esvazia o cache (logout). */
export function limparCache() {
  db.categorias.length = 0;
  db.executores.length = 0;
  db.ocorrencias.length = 0;
  db.ordens.length = 0;
  notificar();
}

let versao = 0;
const ouvintes = new Set<() => void>();

/** Avisa as telas que os dados mudaram (elas recarregam pela API). */
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
