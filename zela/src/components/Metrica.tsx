import { Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';

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
          fontSize: 18,
          color: ruim ? cores.laranjaEscuro : cores.verdeEscuro,
        }}
      >
        {valor}
      </Text>
      <Text style={{ fontFamily: fontes.texto, fontSize: 11, color: cores.textoSuave }}>
        {rotulo}
      </Text>
    </View>
  );
}
