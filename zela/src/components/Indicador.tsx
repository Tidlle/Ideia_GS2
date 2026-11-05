import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { fontes } from '../theme/tipografia';

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
      <Text style={[styles.valor, alerta && { color: cores.laranjaEscuro }]}>{valor}</Text>
      <Text style={styles.rotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: cores.cartao,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
  },
  alerta: { borderColor: cores.laranja },
  valor: { fontFamily: fontes.titulo, fontSize: 30, color: cores.verdeEscuro },
  rotulo: { fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave },
});
