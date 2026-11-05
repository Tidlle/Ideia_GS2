import { Text, View } from 'react-native';

import { Card } from '../../../src/components/Card';
import { Metrica } from '../../../src/components/Metrica';
import { Estado } from '../../../src/components/Estado';
import { Secao, Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { calcularIndicadores, listarExecutores } from '../../../src/services/ordens';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';

export default function Indicadores() {
  const c = useCarga(async () => [
    { exec: await listarExecutores(), ind: await calcularIndicadores() },
  ]);
  return (
    <Tela titulo="Indicadores" subtitulo="Executores, contratos e bairros">
      <Estado {...c} textoVazio="Sem dados.">
        {([{ exec, ind }]) => {
          const ranking = [...exec].sort((a, b) => b.prazosCumpridosPct - a.prazosCumpridosPct);
          const bairros = [...ind.bairros].sort((a, b) => a.horas - b.horas);
          return (
            <>
              <Secao titulo="Executores e contratos (por prazos cumpridos)">
                {ranking.map((e, i) => (
                  <Card key={e.id}>
                    <Text
                      style={{ fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto }}
                    >
                      {i + 1}º {e.nome}
                    </Text>
                    <Text
                      style={{ fontFamily: fontes.texto, fontSize: 12, color: cores.textoSuave }}
                    >
                      {e.contrato}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Metrica
                        rotulo="Prazos"
                        valor={`${e.prazosCumpridosPct}%`}
                        ruim={e.prazosCumpridosPct < 80}
                      />
                      <Metrica rotulo="Tempo médio" valor={`${e.tempoMedioHoras} h`} />
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
                    <Text
                      style={{ fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto }}
                    >
                      {i + 1}º {b.bairro} — {b.horas} h em média
                    </Text>
                    <View style={{ height: 8, borderRadius: 4, backgroundColor: cores.borda }}>
                      <View
                        style={{
                          height: 8,
                          borderRadius: 4,
                          width: `${Math.min(100, b.horas)}%`,
                          backgroundColor: b.horas > 72 ? cores.laranja : cores.verde,
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
