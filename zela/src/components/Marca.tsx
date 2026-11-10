import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';

/**
 * Marca do Zela: um pino de localização com um "check" dentro, ou seja, "neste lugar, resolvido".
 * A mesma geometria gera os ícones do app (assets/) e aparece no login e no cabeçalho.
 */
export const PINO = 'M20 46C20 46 4 30.6 4 18a16 16 0 0 1 32 0c0 12.6-16 28-16 28Z';
export const CHECK = 'M12.5 18.5l5 5 10-10.5';

interface Props {
  /** Altura do pino em px. */
  tamanho?: number;
  /** Mostra o nome "zela" ao lado do pino. */
  comNome?: boolean;
  /** Fundo sobre o qual a marca está (o "check" é vazado nessa cor). */
  sobre?: 'escuro' | 'claro';
}

export function Marca({ tamanho = 32, comNome = false, sobre = 'escuro' }: Props) {
  const corCheck = sobre === 'escuro' ? cores.escuro : cores.cartao;
  const corNome = sobre === 'escuro' ? cores.claro : cores.texto;
  const largura = (tamanho * 40) / 48;
  return (
    <View style={styles.linha} accessible accessibilityRole="image" accessibilityLabel="Zela">
      <Svg width={largura} height={tamanho} viewBox="0 0 40 48">
        <Path d={PINO} fill={cores.marca} />
        <Path
          d={CHECK}
          fill="none"
          stroke={corCheck}
          strokeWidth={4.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {comNome && (
        <Text
          style={[
            styles.nome,
            { color: corNome, fontSize: tamanho * 0.92, lineHeight: tamanho * 1.05 },
          ]}
        >
          zela
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nome: { fontFamily: fontes.titulo, letterSpacing: -0.5, includeFontPadding: false },
});
