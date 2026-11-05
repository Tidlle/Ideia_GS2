import { emHoras } from '../mocks/datas';
import { Categoria, EventoOS, Executor, Ocorrencia, OrdemServico, Usuario } from '../types';
import { atraso } from './atraso';
import { db, notificar, proximoId } from './store';

export const listarCategorias = async (): Promise<Categoria[]> => {
  await atraso(150);
  return db.categorias;
};

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  await atraso();
  return [...db.ocorrencias].sort((a, b) => a.distanciaM - b.distanciaM);
}

export async function listarMinhasOcorrencias(autorId: number): Promise<Ocorrencia[]> {
  await atraso();
  return db.ocorrencias
    .filter((o) => o.autorId === autorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export async function obterOcorrencia(id: number): Promise<Ocorrencia | undefined> {
  await atraso(250);
  return db.ocorrencias.find((o) => o.id === id);
}

/** IA simulada: devolve categoria e descrição sugeridas após ~1,5 s. */
export async function triarFoto(
  urlFoto: string | undefined,
): Promise<{ categoriaId: number; descricao: string }> {
  await atraso(1500);
  const sorteio = db.categorias[(urlFoto?.length ?? 0) % db.categorias.length];
  const descricoes: Record<number, string> = {
    1: 'Poste de iluminação pública apagado, deixando o trecho escuro à noite.',
    2: 'Buraco no asfalto com risco para veículos e motos.',
    3: 'Entulho acumulado na calçada, bloqueando a passagem de pedestres.',
    4: 'Calçada quebrada, com risco de queda para pedestres.',
    5: 'Árvore com galhos comprometidos próxima à via.',
  };
  return { categoriaId: sorteio.id, descricao: descricoes[sorteio.id] };
}

export async function criarOcorrencia(dados: {
  autor: Usuario;
  categoriaId: number;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  fotoAntesUrl?: string;
  urgente: boolean;
}): Promise<Ocorrencia> {
  await atraso(900);
  const categoria = db.categorias.find((c) => c.id === dados.categoriaId)!;
  const id = proximoId(db.ocorrencias);
  const o: Ocorrencia = {
    id,
    autorId: dados.autor.id,
    categoriaId: dados.categoriaId,
    titulo: `${categoria.nome}: ${dados.endereco || 'local informado'}`,
    descricaoIA: dados.descricao,
    bairro: dados.autor.bairro ?? 'Vila Mariana',
    endereco: dados.endereco || 'Localização por GPS',
    latitude: dados.latitude,
    longitude: dados.longitude,
    distanciaM: 0,
    fotoAntesUrl: dados.fotoAntesUrl,
    urgente: dados.urgente,
    status: dados.urgente ? 'URGENTE' : 'AGUARDANDO_CONFIRMACAO',
    prioridade: dados.urgente ? 5 : categoria.riscoBase,
    criadaEm: new Date().toISOString(),
    confirmacoesSim: 0,
    confirmacoesNao: 0,
  };
  db.ocorrencias.unshift(o);
  if (dados.urgente) {
    // Caminho de urgência: pula a confirmação e vai direto ao plantão.
    emitirOSInterna(o, 5, 'Sistema (urgência — plantão)', 4);
  }
  notificar();
  return o;
}

export function emitirOSInterna(
  o: Ocorrencia,
  executorId: number,
  quem: string,
  prazoHoras: number,
): OrdemServico {
  const evento: EventoOS = {
    id: Date.now(),
    data: new Date().toISOString(),
    statusNovo: 'EMITIDA',
    usuario: quem,
  };
  const os: OrdemServico = {
    id: proximoId(db.ordens),
    ocorrenciaId: o.id,
    executorId,
    status: 'EMITIDA',
    prazoEtapa: emHoras(prazoHoras),
    criadaEm: new Date().toISOString(),
    retrabalho: false,
    timeline: [evento],
  };
  db.ordens.push(os);
  o.osId = os.id;
  o.status = o.urgente ? 'URGENTE' : 'EM_ATENDIMENTO';
  return os;
}

export async function listarParaConfirmar(): Promise<Ocorrencia[]> {
  await atraso();
  return db.ocorrencias.filter(
    (o) => o.status === 'AGUARDANDO_CONFIRMACAO' && !db.respondidas.has(o.id),
  );
}

export async function responderConfirmacao(id: number, aindaExiste: boolean) {
  await atraso(300);
  const o = db.ocorrencias.find((x) => x.id === id);
  if (!o) return;
  db.respondidas.add(id);
  if (aindaExiste) {
    o.confirmacoesSim += 1;
    o.prioridade = Math.min(5, o.prioridade + 1);
    if (o.confirmacoesSim >= 3) o.status = 'CONFIRMADA';
  } else {
    o.confirmacoesNao += 1;
    if (o.confirmacoesNao >= 3) {
      o.status = 'DESCARTADA';
      o.motivoDescarte = 'Negada pelos vizinhos.';
    }
  }
  notificar();
}

/** Exceções: ocorrências confirmadas que não tiveram emissão automática. */
export async function listarExcecoes(): Promise<Ocorrencia[]> {
  await atraso();
  return db.ocorrencias.filter(
    (o) => !o.osId && !o.urgente && (o.status === 'CONFIRMADA' || o.status === 'EM_TRIAGEM'),
  );
}

export async function sugerirExecutor(categoriaId: number): Promise<Executor | undefined> {
  await atraso(200);
  const c = db.categorias.find((x) => x.id === categoriaId);
  return db.executores.find((e) => e.id === c?.executorResponsavelId);
}

export async function emitirOS(ocorrenciaId: number, executorId: number, gestor: string) {
  await atraso(600);
  const o = db.ocorrencias.find((x) => x.id === ocorrenciaId);
  if (!o) return;
  const c = db.categorias.find((x) => x.id === o.categoriaId)!;
  emitirOSInterna(o, executorId, gestor, c.prazoHoras);
  notificar();
}

export async function encaminharOcorrencia(ocorrenciaId: number, orgao: string, protocolo: string) {
  await atraso(600);
  const o = db.ocorrencias.find((x) => x.id === ocorrenciaId);
  if (!o) return;
  o.status = 'ENCAMINHADA';
  o.orgaoEncaminhado = orgao;
  o.protocoloExterno = protocolo;
  notificar();
}

export async function descartarOcorrencia(ocorrenciaId: number, justificativa: string) {
  await atraso(500);
  const o = db.ocorrencias.find((x) => x.id === ocorrenciaId);
  if (!o) return;
  o.status = 'DESCARTADA';
  o.motivoDescarte = justificativa;
  notificar();
}
