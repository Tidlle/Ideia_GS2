import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { cores } from '../theme/cores';
import { raio, TOQUE_MIN } from '../theme/espacos';
import { fontes } from '../theme/tipografia';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo' | 'contorno' | 'contornoClaro';
  carregando?: boolean;
  desabilitado?: boolean;
  grande?: boolean;
  /** Texto lido pelo leitor de tela, quando difere do título visível. */
  rotuloAcessivel?: string;
}

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  carregando,
  desabilitado,
  grande,
  rotuloAcessivel,
}: Props) {
  const off = desabilitado || carregando;
  const estilo = estilos[variante];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? titulo}
      accessibilityState={{ disabled: !!off, busy: !!carregando }}
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        base.botao,
        grande && base.grande,
        estilo.caixa,
        off && base.off,
        pressed && base.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={estilo.cor} />
      ) : (
        <Text style={[base.texto, { color: estilo.cor }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const base = StyleSheet.create({
  botao: {
    minHeight: TOQUE_MIN,
    borderRadius: raio.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grande: { minHeight: 56 },
  texto: { fontFamily: fontes.textoNegrito, fontSize: 15, textAlign: 'center' },
  off: { opacity: 0.5 },
  pressionado: { opacity: 0.85 },
});

const estilos = {
  primario: { caixa: { backgroundColor: cores.verde }, cor: cores.escuro },
  secundario: { caixa: { backgroundColor: cores.escuro }, cor: cores.claro },
  perigo: { caixa: { backgroundColor: cores.urgente }, cor: cores.branco },
  contornoClaro: {
    caixa: { borderWidth: 1.5, borderColor: cores.verde, backgroundColor: 'transparent' },
    cor: cores.verde,
  },
  contorno: {
    caixa: { borderWidth: 1.5, borderColor: cores.verdeEscuro, backgroundColor: 'transparent' },
    cor: cores.verdeEscuro,
  },
};
