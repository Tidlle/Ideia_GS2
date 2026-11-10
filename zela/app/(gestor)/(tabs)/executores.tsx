import { Text, View } from 'react-native';

import { Card } from '../../../src/components/Card';
import { Estado } from '../../../src/components/Estado';
import { Metrica } from '../../../src/components/Metrica';
import { Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarExecutores } from '../../../src/services/ordens';
import { textos } from '../../../src/theme/textos';

const TIPOS = {
  EQUIPE_PROPRIA: 'Equipe própria',
  EMPRESA: 'Empresa',
  CONCESSIONARIA: 'Concessionária',
};

export default function Executores() {
  const c = useCarga(listarExecutores);
  return (
    <Tela titulo="Executores e contratos">
      <Estado {...c} textoVazio="Nenhum executor cadastrado.">
        {(lista) =>
          lista.map((e) => (
            <Card key={e.id}>
              <Text style={textos.tituloCartao}>{e.nome}</Text>
              <Text style={textos.meta}>
                {TIPOS[e.tipo]} · {e.regiao}
              </Text>
              <Text style={textos.meta}>{e.contrato}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <Metrica rotulo="Tempo médio" valor={`${e.tempoMedioHoras} h`} />
                <Metrica
                  rotulo="No prazo"
                  valor={`${e.prazosCumpridosPct}%`}
                  ruim={e.prazosCumpridosPct < 80}
                />
                <Metrica
                  rotulo="Retrabalho"
                  valor={`${e.retrabalhoPct}%`}
                  ruim={e.retrabalhoPct > 10}
                />
                <Metrica rotulo="Avaliação" valor={`${e.avaliacao.toFixed(1)} ★`} />
              </View>
            </Card>
          ))
        }
      </Estado>
    </Tela>
  );
}
