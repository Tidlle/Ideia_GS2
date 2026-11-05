export type Papel = 'CIDADAO' | 'GESTOR' | 'EXECUTOR' | 'SUPERVISOR';

export type StatusOcorrencia =
  | 'REPORTADA'
  | 'EM_TRIAGEM'
  | 'AGUARDANDO_CONFIRMACAO'
  | 'CONFIRMADA'
  | 'EM_ATENDIMENTO'
  | 'RESOLVIDA'
  | 'URGENTE'
  | 'DESCARTADA'
  | 'ENCAMINHADA';

export type StatusOS =
  | 'EMITIDA'
  | 'ACEITA'
  | 'RECUSADA'
  | 'EM_EXECUCAO'
  | 'CONCLUIDA'
  | 'VALIDADA'
  | 'ENCERRADA'
  | 'REABERTA'
  | 'ESCALADA'
  | 'ENCAMINHADA';

export type TipoExecutor = 'EQUIPE_PROPRIA' | 'EMPRESA' | 'CONCESSIONARIA';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
  bairro?: string;
  reputacao?: number;
  tipo?: TipoExecutor;
  /** Executor ao qual o usuário EXECUTOR pertence. */
  executorId?: number;
}

export interface Categoria {
  id: number;
  nome: string;
  icone: string;
  executorResponsavelId: number;
  prazoHoras: number;
  emissaoAutomatica: boolean;
  riscoBase: number;
}

export interface Executor {
  id: number;
  nome: string;
  tipo: TipoExecutor;
  regiao: string;
  contrato: string;
  tempoMedioHoras: number;
  prazosCumpridosPct: number;
  retrabalhoPct: number;
  avaliacao: number;
}

export interface Ocorrencia {
  id: number;
  autorId: number;
  categoriaId: number;
  titulo: string;
  descricaoIA: string;
  bairro: string;
  endereco: string;
  latitude: number;
  longitude: number;
  distanciaM: number;
  fotoAntesUrl?: string;
  urgente: boolean;
  status: StatusOcorrencia;
  prioridade: number;
  criadaEm: string;
  confirmacoesSim: number;
  confirmacoesNao: number;
  osId?: number;
  orgaoEncaminhado?: string;
  protocoloExterno?: string;
  motivoDescarte?: string;
}

export interface EventoOS {
  id: number;
  data: string;
  statusAnterior?: string;
  statusNovo: string;
  usuario: string;
  justificativa?: string;
}

export interface OrdemServico {
  id: number;
  ocorrenciaId: number;
  executorId: number;
  status: StatusOS;
  /** Prazo da etapa atual (ISO). */
  prazoEtapa: string;
  checkinLat?: number;
  checkinLng?: number;
  fotoDepoisUrl?: string;
  observacao?: string;
  confiancaIA?: number;
  protocoloExterno?: string;
  criadaEm: string;
  retrabalho: boolean;
  cidadaoConfirmou?: boolean;
  timeline: EventoOS[];
}

export interface Notificacao {
  id: number;
  texto: string;
  data: string;
  lida: boolean;
}
