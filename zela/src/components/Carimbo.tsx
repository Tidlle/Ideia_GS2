import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text } from 'react-native';

import { raio } from '../theme/espacos';
import { fontes, tamanhos } from '../theme/tipografia';
import { infoStatus } from './StatusBadge';

/**
 * Carimbo de status do comprovante. Com `animar`, ele "bate" no papel uma vez
 * (é a única animação automática do app, e respeita a opção de reduzir movimento).
 */
export function Carimbo({
  status,
  data,
  animar,
}: {
  status: string;
  data?: string;
  animar?: boolean;
}) {
  const t = infoStatus(status);
  const [progresso] = useState(() => new Animated.Value(animar ? 0 : 1));

  useEffect(() => {
    if (!animar) return;
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduzir) => {
        if (!ativo) return;
        if (reduzir) {
          progresso.setValue(1);
          return;
        }
        Animated.spring(progresso, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }).start();
      });
    return () => {
      ativo = false;
    };
  }, [animar, progresso]);

  const escala = progresso.interpolate({ inputRange: [0, 1], outputRange: [1.9, 1] });
  const giro = progresso.interpolate({ inputRange: [0, 1], outputRange: ['-16deg', '-6deg'] });

  return (
    <Animated.View
      accessibilityLabel={`Carimbo: ${t.texto}${data ? `, ${data}` : ''}`}
      style={[
        styles.carimbo,
        {
          borderColor: t.forte,
          opacity: progresso,
          transform: [{ scale: escala }, { rotate: giro }],
        },
      ]}
    >
      {/* No carimbo vai só a palavra principal: "Reaberta (retrabalho)" vira "REABERTA". */}
      <Text style={[styles.texto, { color: t.cor }]}>{t.texto.split(' (')[0].toUpperCase()}</Text>
      {!!data && <Text style={[styles.data, { color: t.cor }]}>{data}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carimbo: {
    alignSelf: 'flex-start',
    borderWidth: 2.5,
    borderRadius: raio.folha,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  texto: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.apoio,
    letterSpacing: 1.2,
  },
  data: { fontFamily: fontes.textoMedio, fontSize: tamanhos.legenda },
});
