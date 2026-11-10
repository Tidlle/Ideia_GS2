import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes, tamanhos } from '../theme/tipografia';
import { Botao } from './Botao';

export function ErroCarga({ mensagem, onTentar }: { mensagem: string; onTentar: () => void }) {
  return (
    <View style={styles.centro} accessibilityLiveRegion="polite">
      <Text style={styles.texto}>{mensagem}</Text>
      <Botao titulo="Tentar de novo" onPress={onTentar} variante="contorno" />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', padding: 32, gap: 12 },
  texto: {
    fontFamily: fontes.texto,
    fontSize: tamanhos.corpo,
    color: cores.perigo,
    textAlign: 'center',
  },
});
