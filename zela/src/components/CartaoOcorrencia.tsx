import { useRouter } from 'expo-router';
import { Children, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { db } from '../services/store';
import { cores } from '../theme/cores';
import { espacos, raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { Ocorrencia } from '../types';
import { formatarDistancia, situacaoPrazo } from '../utils';
import { IconeCategoria } from './IconeCategoria';
import { ReguaPrazo } from './ReguaPrazo';
import { StatusBadge } from './StatusBadge';
import { comFoco } from '../theme/foco';

/**
 * Ocorrência como linha de lista. As listas do cidadão são leves (linhas num grupo só);
 * os cartões com comprovante ficam para quem gerencia as OS.
 */
export function CartaoOcorrencia({
  o,
  mostrarPrazo,
  mostrarDistancia,
}: {
  o: Ocorrencia;
  mostrarPrazo?: boolean;
  mostrarDistancia?: boolean;
}) {
  const router = useRouter();
  const categoria = db.categorias.find((c) => c.id === o.categoriaId);
  const os = db.ordens.find((x) => x.id === o.osId);
  const prazo = mostrarPrazo && os ? situacaoPrazo(os) : null;
  const detalhe = [
    categoria?.nome,
    mostrarDistancia && o.distanciaM > 0 ? `a ${formatarDistancia(o.distanciaM)}` : null,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ocorrência: ${o.titulo}`}
      onPress={() => router.push(`/(cidadao)/ocorrencia/${o.id}` as never)}
      style={(e) => [styles.linha, e.pressed && { backgroundColor: cores.claro }, comFoco(e)]}
    >
      <View style={styles.icone}>
        <IconeCategoria nome={categoria?.nome} tamanho={20} cor={cores.andamento} />
      </View>
      <View style={styles.textos}>
        <Text style={textos.tituloCartao}>{o.titulo}</Text>
        {!!detalhe && <Text style={textos.meta}>{detalhe}</Text>}
        <View style={{ marginTop: espacos.xs }}>
          <StatusBadge status={o.status} />
        </View>
        {prazo && (
          <View style={{ marginTop: espacos.xs }}>
            <ReguaPrazo {...prazo} compacta />
          </View>
        )}
      </View>
    </Pressable>
  );
}

/** Agrupa linhas num único bloco com divisórias finas. */
export function Grupo({ children }: { children: ReactNode }) {
  const itens = Children.toArray(children);
  return (
    <View style={styles.grupo}>
      {itens.map((filho, i) => (
        <View key={i} style={i > 0 && styles.divisoria}>
          {filho}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    backgroundColor: cores.cartao,
    borderRadius: raio.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    overflow: 'hidden',
  },
  divisoria: { borderTopWidth: 1, borderTopColor: cores.borda },
  linha: {
    flexDirection: 'row',
    gap: espacos.md,
    padding: espacos.lg,
    backgroundColor: cores.cartao,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: raio.pilula,
    backgroundColor: cores.andamentoFundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: 2 },
});
