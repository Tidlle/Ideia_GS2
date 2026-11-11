import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { fontes, linhas, tamanhos } from '../theme/tipografia';
import { EventoOS } from '../types';
import { formatarData } from '../utils';
import { infoStatus } from './StatusBadge';

const MARCO = 24;

/** Linha do tempo da OS: cada evento com o ícone do status, quem fez, quando e por quê. */
export function Timeline({ eventos }: { eventos: EventoOS[] }) {
  const ordenados = [...eventos].sort((a, b) => a.data.localeCompare(b.data));
  return (
    <View accessibilityLabel="Linha do tempo da ordem de serviço">
      {ordenados.map((e, i) => {
        const t = infoStatus(e.statusNovo);
        return (
          <View key={e.id} style={styles.linha}>
            <View style={styles.trilho}>
              <View style={[styles.marco, { backgroundColor: t.fundo }]}>
                <Ionicons name={t.icone} size={13} color={t.cor} />
              </View>
              {i < ordenados.length - 1 && <View style={styles.fio} />}
            </View>
            <View style={styles.conteudo}>
              <Text style={[styles.status, { color: t.cor }]}>{t.texto}</Text>
              <Text style={textos.legenda}>
                {formatarData(e.data)}, por {e.usuario}
              </Text>
              {!!e.justificativa && (
                <Text style={[textos.meta, { color: cores.texto }]}>{e.justificativa}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: espacos.md },
  trilho: { alignItems: 'center', width: MARCO },
  marco: {
    width: MARCO,
    height: MARCO,
    borderRadius: raio.pilula,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fio: { flex: 1, width: 2, backgroundColor: cores.borda, marginVertical: 2 },
  conteudo: { flex: 1, paddingBottom: espacos.lg, gap: 2, paddingTop: 2 },
  status: {
    fontFamily: fontes.textoNegrito,
    fontSize: tamanhos.apoio,
    lineHeight: linhas.apoio,
  },
});
