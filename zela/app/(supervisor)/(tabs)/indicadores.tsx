import { Text, View } from 'react-native';

import { Card } from '../../../src/components/Card';
import { Metrica } from '../../../src/components/Metrica';
import { Estado } from '../../../src/components/Estado';
import { Secao, Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { calcularIndicadores, listarExecutores } from '../../../src/services/ordens';
import { cores } from '../../../src/theme/cores';
import { raio } from '../../../src/theme/espacos';
import { textos } from '../../../src/theme/textos';
import { formatarHoras } from '../../../src/utils';

export default function Indicadores() {
  const c = useCarga(async () => [
    { exec: await listarExecutores(), ind: await calcularIndicadores() },
  ]);
  return (
    <Tela titulo="Indicadores" subtitulo="Executores, contratos e bairros">
      <Estado {...c} textoVazio="Os indicadores aparecem quando houver ordens de serviço.">
        {([{ exec, ind }]) => {
          const ranking = [...exec].sort((a, b) => b.prazosCumpridosPct - a.prazosCumpridosPct);
          const bairros = [...ind.bairros].sort((a, b) => a.horas - b.horas);
          const maxHoras = Math.max(...bairros.map((b) => b.horas));
          return (
            <>
              <Secao titulo="Ranking de executores">
                {ranking.map((e, i) => (
                  <Card key={e.id}>
                    <Text style={textos.tituloCartao}>
                      {i + 1}º {e.nome}
                    </Text>
                    <Text style={textos.meta}>{e.contrato}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <Metrica rotulo="Tempo médio" valor={formatarHoras(e.tempoMedioHoras)} />
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
                    </View>
                  </Card>
                ))}
              </Secao>
              <Secao titulo="Bairros por tempo de resolução">
                {bairros.map((b, i) => (
                  <Card key={b.bairro}>
                    <Text style={textos.tituloCartao}>
                      {i + 1}º {b.bairro} — {b.horas} h em média
                    </Text>
                    <View
                      style={{ height: 8, borderRadius: raio.pilula, backgroundColor: cores.borda }}
                    >
                      <View
                        style={{
                          height: 8,
                          borderRadius: raio.pilula,
                          width: `${Math.round((b.horas / maxHoras) * 100)}%`,
                          backgroundColor: b.horas > 72 ? cores.atencaoForte : cores.sucesso,
                        }}
                      />
                    </View>
                  </Card>
                ))}
              </Secao>
            </>
          );
        }}
      </Estado>
    </Tela>
  );
}
