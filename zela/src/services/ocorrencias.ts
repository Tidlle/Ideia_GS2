import { Categoria, Executor, Ocorrencia, Usuario } from '../types';
import { api, ehArquivoLocal, enviarFoto, ErroApi, Pagina } from './api';
import {
  ExecutorApi,
  OcorrenciaApi,
  paraCategoria,
  paraExecutor,
  paraOcorrencia,
} from './mapeadores';
import { db, guardar, notificar } from './store';

/**
 * Centro usado nas buscas por proximidade enquanto o app não envia o GPS do cidadão
 * (Vila Mariana, bairro da carga de demonstração).
 */
const CENTRO_PADRAO = { lat: -23.5893, lng: -46.6347 };
const RAIO_BUSCA_M = 5000;

/** Fotos já enviadas na triagem: URI local → URL na API (evita enviar a mesma foto duas vezes). */
const fotosEnviadas = new Map<string, string>();

export const listarCategorias = async (): Promise<Categoria[]> => {
  const r = await api.get<Pagina<Categoria>>('/categorias?size=100&sort=id');
  const lista = r.content.map(paraCategoria);
  guardar(db.categorias, lista);
  return lista;
};

/** Ocorrências do bairro, da mais próxima para a mais distante. */
export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const r = await api.get<Pagina<OcorrenciaApi>>(
    `/ocorrencias?lat=${CENTRO_PADRAO.lat}&lng=${CENTRO_PADRAO.lng}&raio=${RAIO_BUSCA_M}&size=100`,
  );
  return r.content.map(paraOcorrencia);
}

export async function listarMinhasOcorrencias(_autorId?: number): Promise<Ocorrencia[]> {
  const r = await api.get<Pagina<OcorrenciaApi>>('/ocorrencias/minhas?size=100');
  return r.content.map(paraOcorrencia);
}

export async function obterOcorrencia(id: number): Promise<Ocorrencia | undefined> {
  try {
    return paraOcorrencia(await api.get<OcorrenciaApi>(`/ocorrencias/${id}`));
  } catch (e) {
    if (e instanceof ErroApi && e.status === 404) return undefined;
    throw e;
  }
}

/**
 * IA de verdade (Spring AI + Gemini na API): envia a foto e recebe categoria, descrição e urgência.
 * Se a IA não reconhecer o problema, categoriaId vem vazio e o cidadão escolhe.
 */
export async function triarFoto(uri: string | undefined): Promise<{
  categoriaId: number | null;
  descricao: string;
  urgente: boolean;
  aviso?: string;
}> {
  if (!uri) return { categoriaId: null, descricao: '', urgente: false };
  const r = await enviarFoto<{
    fotoUrl: string;
    categoriaId: number | null;
    descricao: string;
    urgente: boolean;
    aviso: string | null;
  }>('/ocorrencias/triagem', uri);
  fotosEnviadas.set(uri, r.fotoUrl);
  return {
    categoriaId: r.categoriaId,
    descricao: r.descricao,
    urgente: r.urgente,
    aviso: r.aviso ?? undefined,
  };
}

/** Garante que a foto está na API e devolve a URL dela (envia se ainda estiver só no aparelho). */
async function fotoNaApi(uri?: string): Promise<string | undefined> {
  if (!uri) return undefined;
  if (!ehArquivoLocal(uri)) return uri;
  const enviada = fotosEnviadas.get(uri);
  if (enviada) return enviada;
  const r = await enviarFoto<{ url: string }>('/fotos', uri);
  fotosEnviadas.set(uri, r.url);
  return r.url;
}

export async function criarOcorrencia(dados: {
  autor?: Usuario;
  categoriaId: number;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  fotoAntesUrl?: string;
  urgente: boolean;
}): Promise<Ocorrencia> {
  const fotoAntesUrl = await fotoNaApi(dados.fotoAntesUrl);
  const r = await api.post<OcorrenciaApi>('/ocorrencias', {
    categoriaId: dados.categoriaId,
    descricao: dados.descricao,
    endereco: dados.endereco,
    latitude: dados.latitude,
    longitude: dados.longitude,
    fotoAntesUrl,
    urgente: dados.urgente,
  });
  const o = paraOcorrencia(r);
  notificar();
  return o;
}

export async function listarParaConfirmar(): Promise<Ocorrencia[]> {
  const r = await api.get<OcorrenciaApi[]>(
    `/ocorrencias/para-confirmar?lat=${CENTRO_PADRAO.lat}&lng=${CENTRO_PADRAO.lng}`,
  );
  return r.map(paraOcorrencia);
}

export async function responderConfirmacao(id: number, aindaExiste: boolean) {
  await api.post(`/ocorrencias/${id}/confirmacoes`, { aindaExiste });
  notificar();
}

/** Exceções: confirmadas que não tiveram emissão automática (gestor). */
export async function listarExcecoes(): Promise<Ocorrencia[]> {
  const r = await api.get<Pagina<OcorrenciaApi>>('/ocorrencias/excecoes?size=100');
  return r.content.map(paraOcorrencia);
}

export async function sugerirExecutor(categoriaId: number): Promise<Executor | undefined> {
  return paraExecutor(await api.get<ExecutorApi>(`/categorias/${categoriaId}/executor-sugerido`));
}

export async function emitirOS(ocorrenciaId: number, executorId: number, _gestor?: string) {
  await api.post(`/ocorrencias/${ocorrenciaId}/emitir-os`, { executorId });
  notificar();
}

export async function encaminharOcorrencia(ocorrenciaId: number, orgao: string, protocolo: string) {
  await api.post(`/ocorrencias/${ocorrenciaId}/encaminhar`, { orgao, protocolo });
  notificar();
}

export async function descartarOcorrencia(ocorrenciaId: number, justificativa: string) {
  await api.post(`/ocorrencias/${ocorrenciaId}/descartar`, { justificativa });
  notificar();
}
