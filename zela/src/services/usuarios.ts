import { Categoria, Papel, Usuario } from '../types';
import { api, Pagina } from './api';
import { ExecutorApi, paraCategoria, paraExecutor } from './mapeadores';
import { db, guardar, notificar } from './store';

interface LoginResposta {
  token: string;
  tipo: string;
  expiraEm: string;
  usuario: Usuario;
}

/** Login real na API (POST /auth/login): devolve o JWT e os dados do usuário. */
export async function autenticar(
  email: string,
  senha: string,
): Promise<{ token: string; usuario: Usuario }> {
  const r = await api.post<LoginResposta>('/auth/login', { email: email.trim(), senha });
  return { token: r.token, usuario: limpar(r.usuario) };
}

/** Cadastro público (POST /auth/cadastro): a conta nasce com o papel CIDADAO. */
export async function cadastrarCidadao(dados: {
  nome: string;
  email: string;
  senha: string;
  bairro: string;
}): Promise<Usuario> {
  return limpar(
    await api.post<Usuario>('/auth/cadastro', {
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      senha: dados.senha,
      bairro: dados.bairro.trim(),
    }),
  );
}

/**
 * Carrega os catálogos usados pelas telas (categorias para todos; executores para gestor e supervisor)
 * logo depois do login ou da restauração da sessão.
 */
export async function carregarCatalogos(papel: Papel) {
  const categorias = await api.get<Pagina<Categoria>>('/categorias?size=100&sort=id');
  guardar(db.categorias, categorias.content.map(paraCategoria));
  if (papel === 'GESTOR' || papel === 'SUPERVISOR') {
    const executores = await api.get<ExecutorApi[]>('/indicadores/executores');
    guardar(db.executores, executores.map(paraExecutor));
  }
  notificar();
}

/** Remove campos vazios (a API manda null; o app usa campos opcionais). */
function limpar(u: Usuario): Usuario {
  return Object.fromEntries(Object.entries(u).filter(([, v]) => v !== null)) as unknown as Usuario;
}
