import { StyleSheet, Text, View } from 'react-native';

import { db } from '../services/store';
import { ehAtrasada } from '../services/ordens';
import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';
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
      <Text style={styles.id}>OS #{os.id}</Text>
      <Text style={styles.titulo}>{o?.titulo}</Text>
      {mostrarExecutor && <Text style={styles.meta}>{e?.nome}</Text>}
      <Text style={styles.meta}>
        {o?.bairro} · {o?.endereco}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <StatusBadge status={os.status} />
        {ehAtrasada(os) && os.status !== 'ESCALADA' && <StatusBadge status="ATRASADA" />}
        {os.retrabalho && <StatusBadge status="REABERTA" />}
      </View>
      {!['ENCERRADA', 'ENCAMINHADA', 'RECUSADA'].includes(os.status) && (
        <Text style={[styles.prazo, prazo.atrasado && { color: cores.urgente }]}>
          {prazo.texto}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  id: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.textoSuave },
  titulo: { fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto },
  meta: { fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave },
  prazo: { fontFamily: fontes.titulo, fontSize: 15, color: cores.laranjaEscuro },
});
