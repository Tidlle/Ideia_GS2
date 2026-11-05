import { emHoras } from '../mocks/datas';
import { Executor, Notificacao, OrdemServico, StatusOS } from '../types';
import { atraso } from './atraso';
import { db, notificar, proximoId } from './store';

export const RAIO_CHECKIN_M = 100;

export const listarExecutores = async (): Promise<Executor[]> => {
  await atraso();
  return db.executores;
};

export async function listarOrdens(): Promise<OrdemServico[]> {
  await atraso();
  return [...db.ordens].sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export async function listarOrdensDoExecutor(executorId: number): Promise<OrdemServico[]> {
  await atraso();
  return db.ordens.filter((o) => o.executorId === executorId);
}

export async function obterOrdem(id: number): Promise<OrdemServico | undefined> {
  await atraso(250);
  return db.ordens.find((o) => o.id === id);
}

function mudarStatus(os: OrdemServico, novo: StatusOS, usuario: string, justificativa?: string) {
  os.timeline.push({
    id: proximoId(os.timeline),
    data: new Date().toISOString(),
    statusAnterior: os.status,
    statusNovo: novo,
    usuario,
    justificativa,
  });
  os.status = novo;
}

function avisar(texto: string) {
  const n: Notificacao = {
    id: proximoId(db.notificacoes),
    texto,
    data: new Date().toISOString(),
    lida: false,
  };
  db.notificacoes.unshift(n);
}

const achar = (id: number) => db.ordens.find((o) => o.id === id)!;
const ocorrenciaDa = (os: OrdemServico) => db.ocorrencias.find((o) => o.id === os.ocorrenciaId)!;

export async function aceitarOS(id: number, quem: string) {
  await atraso(500);
  const os = achar(id);
  mudarStatus(os, 'ACEITA', quem);
  os.prazoEtapa = emHoras(24);
  notificar();
}

export async function recusarOS(id: number, quem: string, motivo: string) {
  await atraso(500);
  const os = achar(id);
  mudarStatus(os, 'RECUSADA', quem, motivo);
  notificar();
}

/** Distância em metros (fórmula de Haversine). */
export function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function iniciarExecucao(
  id: number,
  quem: string,
  lat: number,
  lng: number,
  distancia: number,
) {
  await atraso(500);
  const os = achar(id);
  os.checkinLat = lat;
  os.checkinLng = lng;
  mudarStatus(os, 'EM_EXECUCAO', quem, `Check-in a ${Math.round(distancia)} m do local`);
  notificar();
}

/** IA simulada: compara antes e depois e devolve a confiança (0 a 1). */
export async function compararAntesDepois(): Promise<number> {
  await atraso(1500);
  return Math.round((0.78 + Math.random() * 0.2) * 100) / 100;
}

export async function concluirOS(
  id: number,
  quem: string,
  fotoDepoisUrl: string | undefined,
  observacao: string,
  confianca: number,
) {
  await atraso(600);
  const os = achar(id);
  os.fotoDepoisUrl = fotoDepoisUrl;
  os.observacao = observacao;
  os.confiancaIA = confianca;
  mudarStatus(os, 'CONCLUIDA', quem, 'Foto do depois enviada');
  os.prazoEtapa = emHoras(48); // janela de validação / aceite tácito
  avisar(`O problema "${ocorrenciaDa(os).titulo}" foi concluído. Confirme a solução.`);
  notificar();
}

export async function aprovarOS(id: number, quem: string) {
  await atraso(500);
  const os = achar(id);
  mudarStatus(os, 'VALIDADA', quem);
  mudarStatus(os, 'ENCERRADA', 'Sistema');
  ocorrenciaDa(os).status = 'RESOLVIDA';
  notificar();
}

export async function reprovarOS(id: number, quem: string, motivo: string) {
  await atraso(500);
  const os = achar(id);
  os.retrabalho = true;
  mudarStatus(os, 'REABERTA', quem, motivo);
  os.prazoEtapa = emHoras(24);
  notificar();
}

export async function responderSolucao(
  id: number,
  quem: string,
  confirmou: boolean,
  comentario?: string,
) {
  await atraso(500);
  const os = achar(id);
  os.cidadaoConfirmou = confirmou;
  if (confirmou) {
    mudarStatus(os, 'VALIDADA', quem, 'Cidadão confirmou a solução');
    mudarStatus(os, 'ENCERRADA', 'Sistema');
    ocorrenciaDa(os).status = 'RESOLVIDA';
  } else {
    os.retrabalho = true;
    mudarStatus(os, 'REABERTA', quem, comentario || 'Cidadão contestou a solução');
    os.prazoEtapa = emHoras(24);
  }
  notificar();
}

export async function editarPrazoOS(id: number, quem: string, horas: number) {
  await atraso(400);
  const os = achar(id);
  os.prazoEtapa = emHoras(horas);
  os.timeline.push({
    id: proximoId(os.timeline),
    data: new Date().toISOString(),
    statusNovo: os.status,
    usuario: quem,
    justificativa: `Prazo da etapa alterado para ${horas} h`,
  });
  notificar();
}

export async function cancelarOS(id: number, quem: string, motivo: string) {
  await atraso(500);
  const os = achar(id);
  mudarStatus(os, 'ENCERRADA', quem, `Cancelada: ${motivo}`);
  const o = ocorrenciaDa(os);
  o.osId = undefined;
  o.status = 'CONFIRMADA';
  notificar();
}

export async function listarEscalonadas(): Promise<OrdemServico[]> {
  await atraso();
  const ativas: StatusOS[] = [
    'ESCALADA',
    'EMITIDA',
    'ACEITA',
    'EM_EXECUCAO',
    'CONCLUIDA',
    'REABERTA',
  ];
  return db.ordens.filter(
    (o) =>
      o.status === 'ESCALADA' || (ativas.includes(o.status) && new Date(o.prazoEtapa) < new Date()),
  );
}

export async function cobrarExecutor(id: number, quem: string) {
  await atraso(500);
  const os = achar(id);
  os.timeline.push({
    id: proximoId(os.timeline),
    data: new Date().toISOString(),
    statusNovo: os.status,
    usuario: quem,
    justificativa: 'Supervisor cobrou o executor',
  });
  notificar();
}

export async function reatribuirOS(id: number, quem: string, executorId: number) {
  await atraso(500);
  const os = achar(id);
  os.executorId = executorId;
  mudarStatus(os, 'EMITIDA', quem, 'Reatribuída pelo supervisor');
  os.prazoEtapa = emHoras(12);
  notificar();
}

export async function listarNotificacoes(): Promise<Notificacao[]> {
  await atraso(250);
  return db.notificacoes;
}

export async function marcarNotificacoesLidas() {
  db.notificacoes.forEach((n) => (n.lida = true));
  notificar();
}

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

export async function calcularIndicadores() {
  await atraso();
  const abertas = db.ordens.filter(
    (o) => !['ENCERRADA', 'ENCAMINHADA', 'RECUSADA'].includes(o.status),
  );
  const atrasadas = db.ordens.filter(ehAtrasada);
  const totalExec = db.executores.length;
  const prazos = Math.round(
    db.executores.reduce((s, e) => s + e.prazosCumpridosPct, 0) / totalExec,
  );
  const retrabalho = Math.round(db.executores.reduce((s, e) => s + e.retrabalhoPct, 0) / totalExec);
  const bairros = [
    { bairro: 'Vila Mariana', horas: 38 },
    { bairro: 'Saúde', horas: 52 },
    { bairro: 'Ipiranga', horas: 74 },
    { bairro: 'Jabaquara', horas: 96 },
  ];
  return {
    abertas: abertas.length,
    atrasadas: atrasadas.length,
    prazosCumpridosPct: prazos,
    retrabalhoPct: retrabalho,
    bairros,
    excecoes: db.ocorrencias.filter((o) => !o.osId && !o.urgente && o.status === 'CONFIRMADA')
      .length,
  };
}
