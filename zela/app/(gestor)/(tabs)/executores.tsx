import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../src/components/Card';
import { Estado } from '../../../src/components/Estado';
import { Metrica } from '../../../src/components/Metrica';
import { Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarExecutores } from '../../../src/services/ordens';
import { espacos } from '../../../src/theme/espacos';
import { textos } from '../../../src/theme/textos';
import { formatarHoras } from '../../../src/utils';

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
              <View style={styles.metricas}>
                <Metrica rotulo="Tempo médio" valor={formatarHoras(e.tempoMedioHoras)} />
                <Metrica
                  rotulo="No prazo"
                  valor={`${e.prazosCumpridosPct}%`}
                  ruim={e.prazosCumpridosPct < 80}
                />
              </View>
              <View style={styles.metricas}>
                <Metrica
                  rotulo="Retrabalho"
                  valor={`${e.retrabalhoPct}%`}
                  ruim={e.retrabalhoPct > 10}
                />
                <Metrica
                  rotulo="Avaliação dos cidadãos"
                  valor={`${e.avaliacao.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} de 5`}
                />
              </View>
            </Card>
          ))
        }
      </Estado>
    </Tela>
  );
}

const styles = StyleSheet.create({
  metricas: { flexDirection: 'row', gap: espacos.sm, marginTop: espacos.xs },
});
