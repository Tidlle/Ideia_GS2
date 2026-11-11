import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { tamanhos } from '../theme/tipografia';

export function Indicador({
  valor,
  rotulo,
  alerta,
  contexto,
}: {
  valor: string | number;
  rotulo: string;
  alerta?: boolean;
  /** O que o número quer dizer ("de 7 abertas", "média dos contratos"). */
  contexto?: string;
}) {
  return (
    <View
      style={[styles.caixa, alerta && styles.alerta]}
      accessible
      accessibilityLabel={`${rotulo}: ${valor}${contexto ? `, ${contexto}` : ''}`}
    >
      <Text style={[styles.valor, alerta && { color: cores.atencao }]}>{valor}</Text>
      <Text style={styles.rotulo}>{rotulo}</Text>
      {!!contexto && <Text style={textos.legenda}>{contexto}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: cores.cartao,
    borderRadius: raio.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
  },
  alerta: { borderColor: cores.atencaoForte },
  valor: { ...textos.numero },
  rotulo: { ...textos.tituloCartao, fontSize: tamanhos.apoio },
});
