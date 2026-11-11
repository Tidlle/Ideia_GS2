import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { fontes, linhas, tamanhos } from '../theme/tipografia';

type Tom = 'andamento' | 'atencao' | 'sucesso' | 'perigo' | 'inativo';
type Icone = keyof typeof Ionicons.glyphMap;

/**
 * Cada status tem texto, tom e ícone. O tom diz o que o status significa para quem lê:
 * andamento (seguindo o fluxo), atenção (alguém precisa agir), sucesso (resolvido),
 * perigo (risco ou atraso) e inativo (saiu do fluxo).
 */
const MAPA: Record<string, { texto: string; tom: Tom; icone: Icone }> = {
  // ocorrência
  REPORTADA: { texto: 'Reportada', tom: 'andamento', icone: 'document-text-outline' },
  EM_TRIAGEM: { texto: 'Em triagem', tom: 'andamento', icone: 'sparkles-outline' },
  AGUARDANDO_CONFIRMACAO: {
    texto: 'Aguardando confirmação',
    tom: 'atencao',
    icone: 'people-outline',
  },
  CONFIRMADA: { texto: 'Confirmada', tom: 'andamento', icone: 'people' },
  EM_ATENDIMENTO: { texto: 'Em atendimento', tom: 'andamento', icone: 'construct-outline' },
  RESOLVIDA: { texto: 'Resolvida', tom: 'sucesso', icone: 'checkmark-circle' },
  URGENTE: { texto: 'Urgente', tom: 'perigo', icone: 'warning' },
  DESCARTADA: { texto: 'Descartada', tom: 'inativo', icone: 'close-circle-outline' },
  ENCAMINHADA: { texto: 'Encaminhada', tom: 'inativo', icone: 'arrow-redo-outline' },
  // OS
  EMITIDA: { texto: 'Emitida', tom: 'andamento', icone: 'paper-plane-outline' },
  ACEITA: { texto: 'Aceita', tom: 'andamento', icone: 'thumbs-up-outline' },
  RECUSADA: { texto: 'Recusada', tom: 'perigo', icone: 'close-circle' },
  EM_EXECUCAO: { texto: 'Em execução', tom: 'andamento', icone: 'hammer-outline' },
  CONCLUIDA: { texto: 'Concluída', tom: 'atencao', icone: 'checkmark-done-outline' },
  VALIDADA: { texto: 'Validada', tom: 'sucesso', icone: 'shield-checkmark-outline' },
  ENCERRADA: { texto: 'Encerrada', tom: 'inativo', icone: 'archive-outline' },
  REABERTA: { texto: 'Reaberta (retrabalho)', tom: 'atencao', icone: 'refresh-outline' },
  ESCALADA: { texto: 'Escalada', tom: 'perigo', icone: 'trending-up-outline' },
  ATRASADA: { texto: 'Atrasada', tom: 'perigo', icone: 'time-outline' },
};

export const TONS: Record<Tom, { fundo: string; cor: string; forte: string }> = {
  andamento: { fundo: cores.andamentoFundo, cor: cores.andamento, forte: cores.andamento },
  atencao: { fundo: cores.atencaoFundo, cor: cores.atencao, forte: cores.atencaoForte },
  sucesso: { fundo: cores.sucessoFundo, cor: cores.sucesso, forte: cores.marca },
  perigo: { fundo: cores.perigoFundo, cor: cores.perigo, forte: cores.perigo },
  inativo: { fundo: cores.inativoFundo, cor: cores.inativo, forte: cores.inativo },
};

/** Texto, ícone e cores de um status (usado pelo selo, pelo carimbo e pela linha do tempo). */
export function infoStatus(status: string) {
  const m = MAPA[status] ?? {
    texto: status,
    tom: 'inativo' as Tom,
    icone: 'ellipse-outline' as Icone,
  };
  return { texto: m.texto, icone: m.icone, ...TONS[m.tom] };
}

/** Selo de status: ícone e texto juntos, para que a cor nunca seja o único indicador. */
export function StatusBadge({ status }: { status: string }) {
  const t = infoStatus(status);
  return (
    <View
      style={[styles.badge, { backgroundColor: t.fundo }]}
      accessible
      accessibilityLabel={`Status: ${t.texto}`}
    >
      <Ionicons name={t.icone} size={13} color={t.cor} />
      <Text style={[styles.texto, { color: t.cor }]}>{t.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 4,
    borderRadius: raio.pilula,
  },
  texto: {
    fontFamily: fontes.textoNegrito,
    fontSize: tamanhos.legenda,
    lineHeight: linhas.legenda,
  },
});
