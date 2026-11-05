import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';

export function Vazio({
  texto,
  icone = 'file-tray-outline',
}: {
  texto: string;
  icone?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.centro}>
      <Ionicons name={icone} size={40} color={cores.borda} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', padding: 32, gap: 8 },
  texto: { fontFamily: fontes.texto, fontSize: 15, color: cores.textoSuave, textAlign: 'center' },
});
