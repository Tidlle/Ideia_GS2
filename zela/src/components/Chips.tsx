import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio, TOQUE_MIN } from '../theme/espacos';
import { fontes, tamanhos } from '../theme/tipografia';
import { comFoco } from '../theme/foco';

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
      contentContainerStyle={{ gap: espacos.sm, padding: 3 }}
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
            style={(e) => [styles.chip, ativo && styles.ativo, comFoco(e)]}
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
    minHeight: TOQUE_MIN,
    paddingHorizontal: 14,
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    justifyContent: 'center',
  },
  ativo: { backgroundColor: cores.escuro, borderColor: cores.escuro },
  texto: { fontFamily: fontes.textoMedio, fontSize: tamanhos.apoio, color: cores.texto },
});
