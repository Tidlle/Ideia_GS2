import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { db } from '../services/store';
import { cores } from '../theme/cores';
import { textos } from '../theme/textos';
import { fontes, tamanhos } from '../theme/tipografia';
import { Ocorrencia } from '../types';
import { descreverPrazo, formatarDistancia } from '../utils';
import { Card } from './Card';
import { IconeCategoria } from './IconeCategoria';
import { StatusBadge } from './StatusBadge';

export function CartaoOcorrencia({ o, mostrarPrazo }: { o: Ocorrencia; mostrarPrazo?: boolean }) {
  const router = useRouter();
  const categoria = db.categorias.find((c) => c.id === o.categoriaId);
  const os = db.ordens.find((x) => x.id === o.osId);
  const prazo = os ? descreverPrazo(os.prazoEtapa) : null;
  return (
    <Card
      onPress={() => router.push(`/(cidadao)/ocorrencia/${o.id}` as never)}
      rotulo={`Abrir ocorrência: ${o.titulo}`}
    >
      <View style={styles.topo}>
        <IconeCategoria nome={categoria?.nome} />
        <Text style={styles.categoria}>{categoria?.nome}</Text>
        <Text style={styles.dist}>{formatarDistancia(o.distanciaM)}</Text>
      </View>
      <Text style={textos.tituloCartao}>{o.titulo}</Text>
      <StatusBadge status={o.status} />
      {mostrarPrazo && prazo && (
        <Text style={[textos.prazo, prazo.atrasado && textos.atrasado]}>{prazo.texto}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoria: {
    flex: 1,
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.legenda,
    color: cores.link,
  },
  dist: { fontFamily: fontes.texto, fontSize: tamanhos.legenda, color: cores.textoSuave },
});
