import { Categoria, EventoOS, Executor, Ocorrencia, OrdemServico, StatusOS } from '../types';
import { urlFoto } from './api';
import { db, guardar } from './store';

/** Formatos devolvidos pela API (Java) e conversão para os tipos do app. */

export interface OcorrenciaApi {
  id: number;
  autorId: number;
  categoriaId: number;
  categoriaNome: string;
  titulo: string;
  descricaoIA: string;
  bairro: string;
  endereco: string;
  latitude: number;
  longitude: number;
  distanciaM: number | null;
  fotoAntesUrl: string | null;
  urgente: boolean;
  status: Ocorrencia['status'];
  prioridade: number;
  criadaEm: string;
  confirmacoesSim: number;
  confirmacoesNao: number;
  osId: number | null;
  orgaoEncaminhado: string | null;
  protocoloExterno: string | null;
  motivoDescarte: string | null;
}

export interface OrdemApi {
  id: number;
  ocorrenciaId: number;
  executorId: number;
  executorNome: string;
  status: StatusOS;
  prazoEtapa: string;
  checkinLat: number | null;
  checkinLng: number | null;
  fotoDepoisUrl: string | null;
  observacao: string | null;
  confiancaIA: number | null;
  protocoloExterno: string | null;
  criadaEm: string;
  retrabalho: boolean;
  cidadaoConfirmou: boolean | null;
  ocorrencia: {
    id: number;
    titulo: string;
    categoriaId: number;
    categoriaNome: string;
    descricaoIA: string;
    bairro: string;
    endereco: string;
    latitude: number;
    longitude: number;
    fotoAntesUrl: string | null;
    urgente: boolean;
    autorId: number;
  };
  timeline?: EventoOS[];
}

export interface ExecutorApi {
  id: number;
  nome: string;
  tipo: Executor['tipo'];
  regiao: string;
  contrato: string;
  tempoMedioHoras?: number | null;
  prazosCumpridosPct?: number | null;
  retrabalhoPct?: number | null;
  avaliacao?: number | null;
}

const opcional = <T>(v: T | null | undefined) => v ?? undefined;

export function paraOcorrencia(r: OcorrenciaApi): Ocorrencia {
  const o: Ocorrencia = {
    id: r.id,
    autorId: r.autorId,
    categoriaId: r.categoriaId,
    titulo: r.titulo,
    descricaoIA: r.descricaoIA,
    bairro: r.bairro,
    endereco: r.endereco,
    latitude: r.latitude,
    longitude: r.longitude,
    distanciaM: r.distanciaM ?? 0,
    fotoAntesUrl: urlFoto(r.fotoAntesUrl),
    urgente: r.urgente,
    status: r.status,
    prioridade: r.prioridade,
    criadaEm: r.criadaEm,
    confirmacoesSim: r.confirmacoesSim,
    confirmacoesNao: r.confirmacoesNao,
    osId: opcional(r.osId),
    orgaoEncaminhado: opcional(r.orgaoEncaminhado),
    protocoloExterno: opcional(r.protocoloExterno),
    motivoDescarte: opcional(r.motivoDescarte),
  };
  guardar(db.ocorrencias, [o]);
  return o;
}

/** Converte a OS e guarda no cache o resumo da ocorrência e o executor (usados pelos cards). */
export function paraOrdem(r: OrdemApi): OrdemServico {
  const resumo = r.ocorrencia;
  const existente = db.ocorrencias.find((x) => x.id === resumo.id);
  guardar(db.ocorrencias, [
    {
      ...(existente ?? {
        status: 'EM_ATENDIMENTO',
        prioridade: 0,
        criadaEm: r.criadaEm,
        confirmacoesSim: 0,
        confirmacoesNao: 0,
        distanciaM: 0,
      }),
      id: resumo.id,
      autorId: resumo.autorId,
      categoriaId: resumo.categoriaId,
      titulo: resumo.titulo,
      descricaoIA: resumo.descricaoIA,
      bairro: resumo.bairro,
      endereco: resumo.endereco,
      latitude: resumo.latitude,
      longitude: resumo.longitude,
      fotoAntesUrl: urlFoto(resumo.fotoAntesUrl),
      urgente: resumo.urgente,
      osId: r.id,
    } as Ocorrencia,
  ]);
  if (!db.executores.some((e) => e.id === r.executorId)) {
    guardar(db.executores, [
      paraExecutor({ id: r.executorId, nome: r.executorNome } as ExecutorApi),
    ]);
  }
  const os: OrdemServico = {
    id: r.id,
    ocorrenciaId: r.ocorrenciaId,
    executorId: r.executorId,
    status: r.status,
    prazoEtapa: r.prazoEtapa,
    checkinLat: opcional(r.checkinLat),
    checkinLng: opcional(r.checkinLng),
    fotoDepoisUrl: urlFoto(r.fotoDepoisUrl),
    observacao: opcional(r.observacao),
    confiancaIA: opcional(r.confiancaIA),
    protocoloExterno: opcional(r.protocoloExterno),
    criadaEm: r.criadaEm,
    retrabalho: r.retrabalho,
    cidadaoConfirmou: opcional(r.cidadaoConfirmou),
    timeline: r.timeline ?? db.ordens.find((x) => x.id === r.id)?.timeline ?? [],
  };
  guardar(db.ordens, [os]);
  return os;
}

export function paraExecutor(r: ExecutorApi): Executor {
  const e: Executor = {
    id: r.id,
    nome: r.nome,
    tipo: r.tipo,
    regiao: r.regiao ?? '',
    contrato: r.contrato ?? '',
    tempoMedioHoras: r.tempoMedioHoras ?? 0,
    prazosCumpridosPct: r.prazosCumpridosPct ?? 0,
    retrabalhoPct: r.retrabalhoPct ?? 0,
    avaliacao: r.avaliacao ?? 0,
  };
  return e;
}

export function paraCategoria(r: Categoria): Categoria {
  return {
    id: r.id,
    nome: r.nome,
    icone: r.icone,
    executorResponsavelId: r.executorResponsavelId,
    prazoHoras: r.prazoHoras,
    emissaoAutomatica: r.emissaoAutomatica,
    riscoBase: r.riscoBase,
  };
}
