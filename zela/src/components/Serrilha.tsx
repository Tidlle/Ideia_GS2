import { StyleSheet, View } from 'react-native';

import { cores } from '../theme/cores';

const TRACOS = 40;

/**
 * Picote do comprovante: linha tracejada com dois recortes nas laterais, como o canhoto de um papel.
 * Os recortes usam a cor do fundo da tela para "furar" o cartão.
 */
export function Serrilha({ fundo = cores.claro }: { fundo?: string }) {
  return (
    <View style={styles.linha} importantForAccessibility="no-hide-descendants">
      <View style={[styles.recorte, styles.esquerda, { backgroundColor: fundo }]} />
      <View style={styles.tracos}>
        {Array.from({ length: TRACOS }, (_, i) => (
          <View key={i} style={styles.traco} />
        ))}
      </View>
      <View style={[styles.recorte, styles.direita, { backgroundColor: fundo }]} />
    </View>
  );
}

const R = 9;

const styles = StyleSheet.create({
  // Ocupa também a borda do cartão (margem -1) e corta o que passa dela: sobra o meio-círculo.
  linha: { height: 2 * R, justifyContent: 'center', overflow: 'hidden', marginHorizontal: -1 },
  tracos: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginHorizontal: R + 4,
    gap: 5,
  },
  traco: { width: 6, height: 1.5, backgroundColor: cores.borda },
  recorte: {
    position: 'absolute',
    top: 0,
    width: 2 * R,
    height: 2 * R,
    borderRadius: R,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  esquerda: { left: -R },
  direita: { right: -R },
});
