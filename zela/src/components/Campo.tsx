import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio, TOQUE_MIN } from '../theme/espacos';
import { textos } from '../theme/textos';
import { fontes, tamanhos } from '../theme/tipografia';

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
    borderRadius: raio.controle,
    backgroundColor: cores.cartao,
    paddingHorizontal: espacos.md,
    fontFamily: fontes.texto,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  multi: { minHeight: 90, paddingTop: 10, textAlignVertical: 'top' },
  inputErro: { borderColor: cores.perigo },
  erro: { fontFamily: fontes.textoMedio, fontSize: tamanhos.legenda, color: cores.perigo },
});
