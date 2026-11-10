import { Executor, Notificacao, OrdemServico, StatusOS } from '../types';
import { api, ehArquivoLocal, enviarFoto, ErroApi, Pagina } from './api';
import { ExecutorApi, OrdemApi, paraExecutor, paraOrdem } from './mapeadores';
import { db, guardar, notificar } from './store';

/** Raio do check-in (a API confere de novo: o app só antecipa o aviso ao executor). */
export const RAIO_CHECKIN_M = 100;

/** Desempenho dos executores (gestor e supervisor). */
export const listarExecutores = async (): Promise<Executor[]> => {
  const r = await api.get<ExecutorApi[]>('/indicadores/executores');
  const lista = r.map(paraExecutor);
  guardar(db.executores, lista);
  return lista;
};

export async function listarOrdens(): Promise<OrdemServico[]> {
  const r = await api.get<Pagina<OrdemApi>>('/ordens?size=100&sort=criadaEm,desc');
  return r.content.map(paraOrdem);
}

/** OS da equipe do executor logado (a API descobre a equipe pelo token). */
export async function listarOrdensDoExecutor(_executorId?: number): Promise<OrdemServico[]> {
  const r = await api.get<Pagina<OrdemApi>>('/ordens/minhas?size=100');
  return r.content.map(paraOrdem);
}

/** Detalhe com timeline. Devolve vazio se a OS não existe ou não pode ser vista por este usuário. */
export async function obterOrdem(id: number): Promise<OrdemServico | undefined> {
  try {
    return paraOrdem(await api.get<OrdemApi>(`/ordens/${id}`));
  } catch (e) {
    if (e instanceof ErroApi && (e.status === 404 || e.status === 403)) return undefined;
    throw e;
  }
}

async function acao(caminho: string, corpo?: unknown): Promise<OrdemServico> {
  const os = paraOrdem(await api.post<OrdemApi>(caminho, corpo));
  notificar();
  return os;
}

export const aceitarOS = (id: number, _quem?: string) => acao(`/ordens/${id}/aceitar`);

export const recusarOS = (id: number, _quem: string, motivo: string) =>
  acao(`/ordens/${id}/recusar`, { justificativa: motivo });

/** Distância em metros (fórmula de Haversine), para o aviso antecipado no app. */
export function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Check-in: a API confere a distância (até 100 m) e libera a execução. */
export const iniciarExecucao = (
  id: number,
  _quem: string,
  lat: number,
  lng: number,
  _distancia?: number,
) => acao(`/ordens/${id}/checkin`, { latitude: lat, longitude: lng });

/**
 * Conclusão: envia a foto do depois e conclui. A API compara antes e depois com a IA (Gemini)
 * e devolve a confiança em `confiancaIA` (vazia se a comparação não foi possível).
 */
export async function concluirOS(
  id: number,
  _quem: string,
  fotoDepoisUrl: string | undefined,
  observacao: string,
): Promise<OrdemServico> {
  let url = fotoDepoisUrl;
  if (url && ehArquivoLocal(url)) {
    url = (await enviarFoto<{ url: string }>('/fotos', url)).url;
  }
  return acao(`/ordens/${id}/concluir`, { fotoDepoisUrl: url, observacao });
}

export const aprovarOS = (id: number, _quem?: string) => acao(`/ordens/${id}/aprovar`);

export const reprovarOS = (id: number, _quem: string, motivo: string) =>
  acao(`/ordens/${id}/reprovar`, { justificativa: motivo });

/** O cidadão confirma (encerra) ou contesta (reabre como retrabalho) a solução. */
export const responderSolucao = (
  id: number,
  _quem: string,
  confirmou: boolean,
  comentario?: string,
  nota?: number,
) =>
  acao(`/ordens/${id}/avaliacao`, {
    aprovada: confirmou,
    comentario: comentario || undefined,
    nota,
  });

export async function editarPrazoOS(id: number, _quem: string, horas: number) {
  const os = paraOrdem(await api.patch<OrdemApi>(`/ordens/${id}/prazo`, { horas }));
  notificar();
  return os;
}

export const cancelarOS = (id: number, _quem: string, motivo: string) =>
  acao(`/ordens/${id}/cancelar`, { justificativa: motivo });

export async function listarEscalonadas(): Promise<OrdemServico[]> {
  const r = await api.get<OrdemApi[]>('/ordens/escalonadas');
  return r.map(paraOrdem);
}

export const cobrarExecutor = (id: number, _quem?: string) => acao(`/ordens/${id}/cobrar`);

export const reatribuirOS = (id: number, _quem: string, executorId: number) =>
  acao(`/ordens/${id}/reatribuir`, { executorId });

export async function listarNotificacoes(): Promise<Notificacao[]> {
  const r = await api.get<Pagina<Notificacao>>('/notificacoes?size=50');
  return r.content;
}

export async function marcarNotificacoesLidas() {
  await api.post('/notificacoes/lidas');
  notificar();
}

/** Etapa aberta com o prazo vencido (mesma regra da API). */
export function ehAtrasada(os: OrdemServico) {
  const aberta: StatusOS[] = [
    'EMITIDA',
    'ACEITA',
    'EM_EXECUCAO',
    'CONCLUIDA',
    'REABERTA',
    'ESCALADA',
  ];
  return aberta.includes(os.status) && new Date(os.prazoEtapa) < new Date();
}

interface IndicadoresApi {
  abertas: number;
  atrasadas: number;
  prazosCumpridosPct: number | null;
  retrabalhoPct: number | null;
  excecoes: number;
  bairros: { bairro: string; ocorrencias: number; resolvidas: number; horas: number | null }[];
}

/** Painel do gestor e do supervisor (GET /indicadores). */
export async function calcularIndicadores() {
  const r = await api.get<IndicadoresApi>('/indicadores');
  return {
    abertas: r.abertas,
    atrasadas: r.atrasadas,
    prazosCumpridosPct: r.prazosCumpridosPct ?? 0,
    retrabalhoPct: r.retrabalhoPct ?? 0,
    excecoes: r.excecoes,
    bairros: r.bairros
      .filter((b) => b.horas !== null)
      .map((b) => ({ bairro: b.bairro, horas: Math.round(b.horas as number) })),
  };
}
