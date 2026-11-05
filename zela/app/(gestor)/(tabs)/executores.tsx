import { Text, View } from 'react-native';

import { Card } from '../../../src/components/Card';
import { Estado } from '../../../src/components/Estado';
import { Metrica } from '../../../src/components/Metrica';
import { Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarExecutores } from '../../../src/services/ordens';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';

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
              <Text style={{ fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto }}>
                {e.nome}
              </Text>
              <Text style={{ fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave }}>
                {TIPOS[e.tipo]} · {e.regiao}
              </Text>
              <Text style={{ fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave }}>
                {e.contrato}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <Metrica rotulo="Tempo médio" valor={`${e.tempoMedioHoras} h`} />
                <Metrica
                  rotulo="Prazos cumpridos"
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
