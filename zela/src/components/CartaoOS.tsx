import { StyleSheet, Text, View } from 'react-native';

import { db } from '../services/store';
import { ehAtrasada } from '../services/ordens';
import { textos } from '../theme/textos';
import { OrdemServico } from '../types';
import { descreverPrazo } from '../utils';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

interface Props {
  os: OrdemServico;
  onPress?: () => void;
  mostrarExecutor?: boolean;
}

export function CartaoOS({ os, onPress, mostrarExecutor }: Props) {
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId);
  const e = db.executores.find((x) => x.id === os.executorId);
  const prazo = descreverPrazo(os.prazoEtapa);
  return (
    <Card onPress={onPress} rotulo={`Abrir OS ${os.id}: ${o?.titulo}`}>
      <Text style={textos.id}>OS #{os.id}</Text>
      <Text style={textos.tituloCartao}>{o?.titulo}</Text>
      {mostrarExecutor && <Text style={textos.meta}>{e?.nome}</Text>}
      <Text style={textos.meta}>
        {o?.bairro} · {o?.endereco}
      </Text>
      <View style={styles.selos}>
        <StatusBadge status={os.status} />
        {ehAtrasada(os) && os.status !== 'ESCALADA' && <StatusBadge status="ATRASADA" />}
        {os.retrabalho && <StatusBadge status="REABERTA" />}
      </View>
      {!['ENCERRADA', 'ENCAMINHADA', 'RECUSADA'].includes(os.status) && (
        <Text style={[textos.prazo, prazo.atrasado && textos.atrasado]}>{prazo.texto}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  selos: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
});
