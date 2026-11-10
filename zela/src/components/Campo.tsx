import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio, TOQUE_MIN } from '../theme/espacos';
import { textos } from '../theme/textos';
import { fontes } from '../theme/tipografia';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
  /** Use quando o campo estiver sobre um cartão escuro. */
  sobreEscuro?: boolean;
}

export function Campo({ rotulo, erro, sobreEscuro, style, ...resto }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={[textos.rotulo, sobreEscuro && { color: cores.claro }]}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.placeholder}
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
  erro: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.urgente },
});
