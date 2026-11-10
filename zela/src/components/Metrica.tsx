import { Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes, tamanhos } from '../theme/tipografia';

export function Metrica({
  rotulo,
  valor,
  ruim,
}: {
  rotulo: string;
  valor: string;
  ruim?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: fontes.titulo,
          fontSize: tamanhos.secao,
          color: ruim ? cores.atencao : cores.texto,
        }}
      >
        {valor}
      </Text>
      <Text
        numberOfLines={1}
        style={{ fontFamily: fontes.texto, fontSize: tamanhos.legenda, color: cores.textoSuave }}
      >
        {rotulo}
      </Text>
    </View>
  );
}
