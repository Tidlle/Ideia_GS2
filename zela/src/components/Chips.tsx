import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { cores } from '../theme/cores';
import { raio, TOQUE_MIN } from '../theme/espacos';
import { fontes } from '../theme/tipografia';

interface Props {
  opcoes: { valor: string; rotulo: string }[];
  selecionado: string;
  onChange: (v: string) => void;
}

export function Chips({ opcoes, selecionado, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {opcoes.map((o) => {
        const ativo = o.valor === selecionado;
        return (
          <Pressable
            key={o.valor}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Filtro ${o.rotulo}`}
            onPress={() => onChange(o.valor)}
            style={[styles.chip, ativo && styles.ativo]}
          >
            <Text style={[styles.texto, ativo && { color: cores.claro }]}>{o.rotulo}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: TOQUE_MIN - 4,
    paddingHorizontal: 14,
    borderRadius: raio.pill,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    justifyContent: 'center',
  },
  ativo: { backgroundColor: cores.escuro, borderColor: cores.escuro },
  texto: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.texto },
});
