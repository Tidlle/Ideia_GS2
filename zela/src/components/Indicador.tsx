import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { fontes, tamanhos } from '../theme/tipografia';

export function Indicador({
  valor,
  rotulo,
  alerta,
}: {
  valor: string | number;
  rotulo: string;
  alerta?: boolean;
}) {
  return (
    <View
      style={[styles.caixa, alerta && styles.alerta]}
      accessibilityLabel={`${rotulo}: ${valor}`}
    >
      <Text style={[styles.valor, alerta && { color: cores.atencao }]}>{valor}</Text>
      <Text style={styles.rotulo}>{rotulo}</Text>
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
  rotulo: { fontFamily: fontes.texto, fontSize: tamanhos.apoio, color: cores.textoSuave },
});
