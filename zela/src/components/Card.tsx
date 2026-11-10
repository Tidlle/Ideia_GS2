import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio } from '../theme/espacos';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  escuro?: boolean;
  estilo?: ViewStyle;
  rotulo?: string;
}

export function Card({ children, onPress, escuro, estilo, rotulo }: Props) {
  const s = [styles.card, escuro && styles.escuro, estilo];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={rotulo}
        onPress={onPress}
        style={({ pressed }) => [...s, pressed && { opacity: 0.85 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={s}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.cartao,
    borderRadius: raio.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.lg,
    gap: espacos.sm,
  },
  escuro: { backgroundColor: cores.escuro, borderColor: cores.escuro },
});
