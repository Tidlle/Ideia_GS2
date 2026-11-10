import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { raio } from '../theme/espacos';
import { fontes, tamanhos } from '../theme/tipografia';

interface Props {
  uri?: string;
  rotulo: string;
  altura?: number;
}

/** Foto real (câmera/galeria) ou, nos mocks, um quadro com o rótulo "Antes"/"Depois". */
export function Foto({ uri, rotulo, altura = 160 }: Props) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { height: altura }]}
        accessibilityLabel={`Foto ${rotulo}`}
      />
    );
  }
  return (
    <View
      style={[styles.base, styles.placeholder, { height: altura }]}
      accessibilityLabel={`Foto ${rotulo} (exemplo)`}
    >
      <Ionicons name="image-outline" size={32} color={cores.textoSuave} />
      <Text style={styles.texto}>{rotulo} (exemplo)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%', borderRadius: raio.foto },
  placeholder: {
    backgroundColor: cores.fotoVazia,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  texto: { fontFamily: fontes.textoMedio, fontSize: tamanhos.legenda, color: cores.textoSuave },
});
