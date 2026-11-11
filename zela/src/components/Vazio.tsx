import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos } from '../theme/espacos';
import { textos } from '../theme/textos';
import { Botao } from './Botao';

export interface AcaoVazio {
  titulo: string;
  onPress: () => void;
}

/** Estado vazio: diz o que está acontecendo e, quando há, qual é o próximo passo. */
export function Vazio({
  texto,
  icone = 'file-tray-outline',
  acao,
}: {
  texto: string;
  icone?: keyof typeof Ionicons.glyphMap;
  acao?: AcaoVazio;
}) {
  return (
    <View style={styles.centro}>
      <Ionicons name={icone} size={40} color={cores.textoSuave} />
      <Text style={[textos.corpo, styles.texto]}>{texto}</Text>
      {!!acao && <Botao titulo={acao.titulo} onPress={acao.onPress} variante="contorno" />}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', padding: espacos.xxl, gap: espacos.md },
  texto: { color: cores.textoSuave, textAlign: 'center' },
});
