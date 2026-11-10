import { StyleSheet, Text, View } from 'react-native';

import { db } from '../services/store';
import { cores } from '../theme/cores';
import { espacos } from '../theme/espacos';
import { textos } from '../theme/textos';
import { fontes, tamanhos } from '../theme/tipografia';
import { OrdemServico } from '../types';
import { formatarProtocolo, situacaoPrazo } from '../utils';
import { Card } from './Card';
import { ReguaPrazo } from './ReguaPrazo';
import { StatusBadge } from './StatusBadge';

interface Props {
  os: OrdemServico;
  onPress?: () => void;
  mostrarExecutor?: boolean;
}

/** OS na lista: a faixa do protocolo no topo e a régua do prazo embaixo, como um comprovante resumido. */
export function CartaoOS({ os, onPress, mostrarExecutor }: Props) {
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId);
  const e = db.executores.find((x) => x.id === os.executorId);
  const prazo = situacaoPrazo(os);
  return (
    <Card onPress={onPress} rotulo={`Abrir ordem de serviço ${os.id}: ${o?.titulo ?? ''}`}>
      <View style={styles.faixa}>
        <Text style={styles.protocolo}>
          {formatarProtocolo(os.ocorrenciaId, o?.criadaEm ?? os.criadaEm)}
        </Text>
        <Text style={textos.id}>OS {os.id}</Text>
      </View>
      <Text style={textos.tituloCartao}>{o?.titulo}</Text>
      {mostrarExecutor && !!e && <Text style={textos.meta}>{e.nome}</Text>}
      {!!o && (
        <Text style={textos.meta}>
          {o.endereco}, {o.bairro}
        </Text>
      )}
      <View style={styles.selos}>
        <StatusBadge status={os.status} />
        {os.retrabalho && os.status !== 'REABERTA' && <StatusBadge status="REABERTA" />}
      </View>
      {prazo && (
        <View style={{ marginTop: espacos.xs }}>
          <ReguaPrazo {...prazo} compacta />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  faixa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: espacos.sm,
    marginBottom: espacos.xs,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    borderStyle: 'dashed',
  },
  protocolo: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.corpo,
    color: cores.texto,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  selos: { flexDirection: 'row', gap: espacos.sm, flexWrap: 'wrap', alignItems: 'center' },
});
