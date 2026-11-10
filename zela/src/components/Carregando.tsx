import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { cores } from '../theme/cores';

export function Carregando() {
  return (
    <View style={styles.centro} accessibilityLabel="Carregando" accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={cores.marca} />
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: cores.claro,
  },
});
