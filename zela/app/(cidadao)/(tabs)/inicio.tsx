import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { CartaoOcorrencia } from '../../../src/components/CartaoOcorrencia';
import { Estado } from '../../../src/components/Estado';
import { Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarOcorrencias } from '../../../src/services/ocorrencias';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';

export default function Inicio() {
  const { usuario } = useAuth();
  const router = useRouter();
  const c = useCarga(listarOcorrencias);
  return (
    <Tela
      titulo={`Olá, ${usuario?.nome.split(' ')[0]}`}
      subtitulo={`Ocorrências em ${usuario?.bairro}`}
    >
      <Botao
        titulo="Reportar problema"
        onPress={() => router.push('/(cidadao)/nova-ocorrencia')}
        grande
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="location-outline" size={16} color={cores.textoSuave} />
        <Text style={{ fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave }}>
          Ordenadas por distância (mapa em breve)
        </Text>
      </View>
      <Estado {...c} textoVazio="Nenhuma ocorrência no seu bairro. Que bom!">
        {(lista) => lista.map((o) => <CartaoOcorrencia key={o.id} o={o} />)}
      </Estado>
    </Tela>
  );
}
