import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio, TOQUE_MIN } from '../theme/espacos';
import { fontes } from '../theme/tipografia';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
}

export function Campo({ rotulo, erro, style, ...resto }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor="#7A857F"
        style={[styles.input, !!erro && styles.inputErro, resto.multiline && styles.multi, style]}
        {...resto}
      />
      {!!erro && (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: 4 },
  rotulo: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.texto },
  input: {
    minHeight: TOQUE_MIN,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.md,
    backgroundColor: cores.cartao,
    paddingHorizontal: 12,
    fontFamily: fontes.texto,
    fontSize: 15,
    color: cores.texto,
  },
  multi: { minHeight: 90, paddingTop: 10, textAlignVertical: 'top' },
  inputErro: { borderColor: cores.urgente },
  erro: { fontFamily: fontes.texto, fontSize: 12, color: cores.urgente },
});
