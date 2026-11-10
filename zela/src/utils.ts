export const formatarData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export function descreverPrazo(iso: string) {
  const h = Math.round((new Date(iso).getTime() - Date.now()) / 3600000);
  if (h < 0) return { texto: `Atrasada há ${Math.abs(h)} h`, atrasado: true };
  if (h >= 48) return { texto: `Prazo em ${Math.round(h / 24)} dias`, atrasado: false };
  return { texto: `Prazo em ${h} h`, atrasado: false };
}

export const formatarDistancia = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;

export const horasDeAtraso = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 3600000));

/** Horas em formato brasileiro, sem casas decimais a partir de 10 h ("9,5 h", "89 h"). */
export const formatarHoras = (h: number) =>
  `${h.toLocaleString('pt-BR', { maximumFractionDigits: h >= 10 ? 0 : 1 })} h`;

/** Protocolo da ocorrência, no formato usado nos canais da prefeitura: ano + número ("2026-000123"). */
export const formatarProtocolo = (id: number, criadaEm?: string) =>
  `${criadaEm ? new Date(criadaEm).getFullYear() : new Date().getFullYear()}-${String(id).padStart(6, '0')}`;

export type EstadoPrazo = 'ok' | 'perto' | 'atrasado';

/** Status em que a OS já saiu do fluxo e o prazo não conta mais. */
const SEM_PRAZO = ['ENCERRADA', 'ENCAMINHADA', 'RECUSADA', 'VALIDADA'];

/**
 * Situação do prazo da etapa atual: texto, quanto do prazo já passou (0 a 1) e estado.
 * A etapa começa no último evento da linha do tempo; "perto" é quando resta menos de 25% do prazo.
 */
export function situacaoPrazo(os: {
  status: string;
  prazoEtapa: string;
  criadaEm: string;
  timeline?: { data: string }[];
}): { texto: string; fracao: number; estado: EstadoPrazo } | null {
  if (SEM_PRAZO.includes(os.status)) return null;
  const fim = new Date(os.prazoEtapa).getTime();
  const datas = (os.timeline ?? []).map((e) => new Date(e.data).getTime()).filter((t) => t < fim);
  const inicio = datas.length ? Math.max(...datas) : new Date(os.criadaEm).getTime();
  const total = Math.max(1, fim - inicio);
  const fracao = Math.min(1, Math.max(0, (Date.now() - inicio) / total));
  const { texto, atrasado } = descreverPrazo(os.prazoEtapa);
  const estado: EstadoPrazo = atrasado ? 'atrasado' : fracao >= 0.75 ? 'perto' : 'ok';
  return { texto, fracao: atrasado ? 1 : fracao, estado };
}

/** Confirmações dos vizinhos em frase ("6 vizinhos confirmaram; 1 disse que não existe mais"). */
export function textoConfirmacoes(sim: number, nao: number) {
  const a =
    sim === 0
      ? 'Nenhum vizinho confirmou ainda'
      : sim === 1
        ? '1 vizinho confirmou'
        : `${sim} vizinhos confirmaram`;
  if (nao === 0) return a;
  return `${a}; ${nao === 1 ? '1 disse' : `${nao} disseram`} que não existe mais`;
}
