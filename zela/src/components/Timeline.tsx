import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';
import { EventoOS } from '../types';
import { formatarData } from '../utils';
import { StatusBadge } from './StatusBadge';

export function Timeline({ eventos }: { eventos: EventoOS[] }) {
  const ordenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));
  return (
    <View accessibilityLabel="Linha do tempo da ordem de serviço">
      {ordenados.map((e, i) => (
        <View key={e.id} style={styles.linha}>
          <View style={styles.trilho}>
            <View style={styles.ponto} />
            {i < ordenados.length - 1 && <View style={styles.fio} />}
          </View>
          <View style={styles.conteudo}>
            <StatusBadge status={e.statusNovo} />
            <Text style={styles.meta}>
              {formatarData(e.data)} · {e.usuario}
            </Text>
            {!!e.justificativa && <Text style={styles.just}>{e.justificativa}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12 },
  trilho: { alignItems: 'center', width: 14 },
  ponto: { width: 12, height: 12, borderRadius: 6, backgroundColor: cores.verde, marginTop: 4 },
  fio: { flex: 1, width: 2, backgroundColor: cores.borda, marginVertical: 2 },
  conteudo: { flex: 1, paddingBottom: 14, gap: 3 },
  meta: { fontFamily: fontes.texto, fontSize: 12, color: cores.textoSuave },
  just: { fontFamily: fontes.texto, fontSize: 13, color: cores.texto },
});
