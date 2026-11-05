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

const TONS: Record<Tom, { fundo: string; texto: string }> = {
  verde: { fundo: '#DDF3E6', texto: cores.verdeEscuro },
  laranja: { fundo: '#FBE8D6', texto: cores.laranjaEscuro },
  urgente: { fundo: '#F7DDD8', texto: cores.urgente },
  neutro: { fundo: '#E8E5DA', texto: cores.textoSuave },
};

/** Sempre mostra o texto do status: a cor nunca é o único indicador. */
export function StatusBadge({ status }: { status: string }) {
  const m = MAPA[status] ?? { texto: status, tom: 'neutro' as Tom };
  const t = TONS[m.tom];
  return (
    <View
      style={[styles.badge, { backgroundColor: t.fundo }]}
      accessibilityLabel={`Status: ${m.texto}`}
    >
      <Text style={[styles.texto, { color: t.texto }]}>{m.texto}</Text>
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
