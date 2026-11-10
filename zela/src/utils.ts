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
