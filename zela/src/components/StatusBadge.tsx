import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { fontes } from '../theme/tipografia';

type Tom = 'verde' | 'laranja' | 'urgente' | 'neutro';

const MAPA: Record<string, { texto: string; tom: Tom }> = {
  // ocorrência
  REPORTADA: { texto: 'Reportada', tom: 'neutro' },
  EM_TRIAGEM: { texto: 'Em triagem', tom: 'neutro' },
  AGUARDANDO_CONFIRMACAO: { texto: 'Aguardando confirmação', tom: 'laranja' },
  CONFIRMADA: { texto: 'Confirmada', tom: 'verde' },
  EM_ATENDIMENTO: { texto: 'Em atendimento', tom: 'verde' },
  RESOLVIDA: { texto: 'Resolvida', tom: 'verde' },
  URGENTE: { texto: 'Urgente', tom: 'urgente' },
  DESCARTADA: { texto: 'Descartada', tom: 'neutro' },
  ENCAMINHADA: { texto: 'Encaminhada', tom: 'neutro' },
  // OS
  EMITIDA: { texto: 'Emitida', tom: 'laranja' },
  ACEITA: { texto: 'Aceita', tom: 'verde' },
  RECUSADA: { texto: 'Recusada', tom: 'urgente' },
  EM_EXECUCAO: { texto: 'Em execução', tom: 'verde' },
  CONCLUIDA: { texto: 'Concluída', tom: 'verde' },
  VALIDADA: { texto: 'Validada', tom: 'verde' },
  ENCERRADA: { texto: 'Encerrada', tom: 'neutro' },
  REABERTA: { texto: 'Reaberta (retrabalho)', tom: 'laranja' },
  ESCALADA: { texto: 'Escalada', tom: 'urgente' },
  ATRASADA: { texto: 'Atrasada', tom: 'urgente' },
};

export const TONS: Record<Tom, { fundo: string; cor: string; forte: string }> = {
  verde: { fundo: cores.verdeFundo, cor: cores.verdeEscuro, forte: cores.verde },
  laranja: { fundo: cores.laranjaFundo, cor: cores.laranjaEscuro, forte: cores.laranja },
  urgente: { fundo: cores.urgenteFundo, cor: cores.urgente, forte: cores.urgente },
  neutro: { fundo: cores.neutroFundo, cor: cores.textoSuave, forte: cores.textoSuave },
};

/** Texto e tom de um status (usado pelo selo e pela linha do tempo). */
export function infoStatus(status: string) {
  const m = MAPA[status] ?? { texto: status, tom: 'neutro' as Tom };
  return { texto: m.texto, ...TONS[m.tom] };
}

/** Sempre mostra o texto do status: a cor nunca é o único indicador. */
export function StatusBadge({ status }: { status: string }) {
  const t = infoStatus(status);
  return (
    <View
      style={[styles.badge, { backgroundColor: t.fundo }]}
      accessibilityLabel={`Status: ${t.texto}`}
    >
      <Text style={[styles.texto, { color: t.cor }]}>{t.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: raio.pill,
  },
  texto: { fontFamily: fontes.textoNegrito, fontSize: 12 },
});
