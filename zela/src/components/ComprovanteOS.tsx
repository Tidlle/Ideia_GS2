import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { Categoria, Executor, Ocorrencia, OrdemServico } from '../types';
import { formatarData, formatarProtocolo, situacaoPrazo } from '../utils';
import { Carimbo } from './Carimbo';
import { IconeCategoria } from './IconeCategoria';
import { ReguaPrazo } from './ReguaPrazo';
import { Serrilha } from './Serrilha';
import { StatusBadge } from './StatusBadge';

/** Status que encerram um ciclo e por isso aparecem como carimbo, com data. */
const DECISIVOS = [
  'RESOLVIDA',
  'VALIDADA',
  'ENCERRADA',
  'DESCARTADA',
  'ENCAMINHADA',
  'RECUSADA',
  'URGENTE',
  'ESCALADA',
  'REABERTA',
];

interface Props {
  ocorrencia: Ocorrencia;
  os?: OrdemServico;
  categoria?: Categoria;
  executor?: Executor;
  /** Status mostrado no canhoto: o da ocorrência (cidadão) ou o da OS (gestor e executor). */
  status: string;
  /** Faz o carimbo "bater" ao aparecer (usado quando o cidadão acaba de confirmar a solução). */
  animarCarimbo?: boolean;
  /** Selos extras ao lado do status (ex.: retrabalho). */
  extras?: ReactNode;
}

/**
 * Comprovante de zeladoria: o protocolo do problema, o prazo do contrato como régua e,
 * no canhoto, quem executa e o carimbo do status. É a peça central da identidade do app.
 */
export function ComprovanteOS({
  ocorrencia: o,
  os,
  categoria,
  executor,
  status,
  animarCarimbo,
  extras,
}: Props) {
  const prazo = os ? situacaoPrazo(os) : null;
  const decisivo = DECISIVOS.includes(status);
  const ultimoEvento = os?.timeline.length
    ? [...os.timeline].sort((a, b) => b.data.localeCompare(a.data))[0]
    : undefined;
  const dataCarimbo = formatarData(ultimoEvento?.data ?? o.criadaEm).split(',')[0];

  return (
    <View style={styles.papel}>
      <View style={styles.corpo}>
        <View style={styles.topo}>
          <Text style={textos.rotuloInfo}>Protocolo</Text>
          {!!categoria && (
            <View style={styles.categoriaLinha}>
              <IconeCategoria nome={categoria.nome} tamanho={16} />
              <Text style={styles.categoria}>{categoria.nome}</Text>
            </View>
          )}
        </View>
        <Text style={textos.numero} accessibilityLabel={`Protocolo ${o.id}`}>
          {formatarProtocolo(o.id, o.criadaEm)}
        </Text>
        <Text style={textos.secao}>{o.titulo}</Text>
        <View style={styles.local}>
          <Ionicons name="location-outline" size={16} color={cores.textoSuave} />
          <Text style={[textos.meta, { flex: 1 }]}>
            {o.endereco}, {o.bairro}
          </Text>
        </View>
        {prazo && (
          <View style={{ marginTop: espacos.sm }}>
            <ReguaPrazo {...prazo} />
          </View>
        )}
      </View>

      <Serrilha />

      <View style={styles.canhoto}>
        <View style={{ flex: 1, gap: 2 }}>
          {os ? (
            <>
              <Text style={textos.id}>Ordem de serviço {os.id}</Text>
              <Text style={textos.tituloCartao}>{executor?.nome ?? 'Executor'}</Text>
              {!!executor?.contrato && <Text style={textos.meta}>{executor.contrato}</Text>}
            </>
          ) : (
            <>
              <Text style={textos.id}>Ordem de serviço</Text>
              <Text style={textos.meta}>Ainda não emitida</Text>
            </>
          )}
          {!decisivo && (
            <View style={styles.selos}>
              <StatusBadge status={status} />
              {extras}
            </View>
          )}
          {decisivo && extras ? <View style={styles.selos}>{extras}</View> : null}
        </View>
        {decisivo && (
          <View style={styles.lugarCarimbo}>
            <Carimbo status={status} data={dataCarimbo} animar={animarCarimbo} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  papel: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.folha,
  },
  corpo: { padding: espacos.lg, paddingBottom: espacos.md, gap: espacos.xs },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoriaLinha: { flexDirection: 'row', alignItems: 'center', gap: espacos.xs },
  categoria: { ...textos.rotuloInfo, marginTop: 0, color: cores.link },
  local: { flexDirection: 'row', alignItems: 'center', gap: espacos.xs },
  canhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    padding: espacos.lg,
    paddingTop: espacos.md,
  },
  selos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.sm, marginTop: espacos.xs },
  lugarCarimbo: { maxWidth: '45%', alignItems: 'flex-end' },
});
