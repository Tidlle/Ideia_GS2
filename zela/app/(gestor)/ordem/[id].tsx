import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Carregando } from '../../../src/components/Carregando';
import { Chips } from '../../../src/components/Chips';
import { Foto } from '../../../src/components/Foto';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { Secao, Tela } from '../../../src/components/Tela';
import { Timeline } from '../../../src/components/Timeline';
import { Vazio } from '../../../src/components/Vazio';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import {
  aprovarOS,
  cancelarOS,
  editarPrazoOS,
  obterOrdem,
  reprovarOS,
} from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';
import { descreverPrazo } from '../../../src/utils';

type Modo = 'reprovar' | 'prazo' | 'cancelar' | null;
const PRAZOS = ['12', '24', '48', '72'].map((h) => ({ valor: h, rotulo: `${h} h` }));

export default function DetalheOSGestor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const c = useCarga(() => obterOrdem(Number(id)), [id]);
  const [modo, setModo] = useState<Modo>(null);
  const [motivo, setMotivo] = useState('');
  const [horas, setHoras] = useState('24');
  const [enviando, setEnviando] = useState(false);

  if (c.carregando && !c.dados) return <Carregando />;
  const os = c.dados;
  if (!os) return <Vazio texto="OS não encontrada." />;
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId)!;
  const exec = db.executores.find((e) => e.id === os.executorId);
  const prazo = descreverPrazo(os.prazoEtapa);
  const aberta = !['ENCERRADA', 'ENCAMINHADA', 'RECUSADA'].includes(os.status);
  const podeValidar = os.status === 'CONCLUIDA';

  async function rodar(fn: () => Promise<void>) {
    setEnviando(true);
    await fn();
    setEnviando(false);
    setModo(null);
    setMotivo('');
  }

  return (
    <Tela titulo={`OS #${os.id}`} subtitulo={o.titulo}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <StatusBadge status={os.status} />
        {os.retrabalho && <StatusBadge status="REABERTA" />}
      </View>

      <Secao titulo="Antes e depois">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Foto rotulo="Antes" uri={o.fotoAntesUrl} altura={130} />
          </View>
          <View style={{ flex: 1 }}>
            <Foto rotulo="Depois" uri={os.fotoDepoisUrl} altura={130} />
          </View>
        </View>
      </Secao>

      <Card>
        <Text style={t.rotulo}>Executor</Text>
        <Text style={t.valor}>
          {exec?.nome} · {exec?.contrato}
        </Text>
        <Text style={t.rotulo}>Prazo da etapa</Text>
        <Text style={[t.valor, prazo.atrasado && { color: cores.urgente }]}>{prazo.texto}</Text>
        <Text style={t.rotulo}>Confiança da IA (antes/depois)</Text>
        <Text style={t.valor}>
          {os.confiancaIA !== undefined
            ? `${Math.round(os.confiancaIA * 100)}%`
            : 'Ainda sem comparação'}
        </Text>
        <Text style={t.rotulo}>Local do check-in</Text>
        <Text style={t.valor}>
          {os.checkinLat !== undefined
            ? `${os.checkinLat.toFixed(4)}, ${os.checkinLng?.toFixed(4)}`
            : 'Sem check-in'}
        </Text>
        {!!os.observacao && (
          <>
            <Text style={t.rotulo}>Observação do executor</Text>
            <Text style={t.valor}>{os.observacao}</Text>
          </>
        )}
        {!!os.protocoloExterno && (
          <Text style={t.valor}>Protocolo externo: {os.protocoloExterno}</Text>
        )}
      </Card>

      {podeValidar && modo === null && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Botao
              titulo="Aprovar"
              carregando={enviando}
              onPress={() => rodar(() => aprovarOS(os.id, usuario!.nome))}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Botao titulo="Reprovar" variante="perigo" onPress={() => setModo('reprovar')} />
          </View>
        </View>
      )}

      {modo === 'reprovar' && (
        <Card>
          <Campo
            rotulo="Motivo da reprovação (gera retrabalho)"
            value={motivo}
            onChangeText={setMotivo}
            multiline
          />
          <Botao
            titulo="Reprovar e devolver ao executor"
            variante="perigo"
            carregando={enviando}
            desabilitado={motivo.trim().length < 5}
            onPress={() => rodar(() => reprovarOS(os.id, usuario!.nome, motivo.trim()))}
          />
        </Card>
      )}
      {modo === 'prazo' && (
        <Card>
          <Text style={t.valor}>Novo prazo da etapa</Text>
          <Chips opcoes={PRAZOS} selecionado={horas} onChange={setHoras} />
          <Botao
            titulo="Salvar prazo"
            carregando={enviando}
            onPress={() => rodar(() => editarPrazoOS(os.id, usuario!.nome, Number(horas)))}
          />
        </Card>
      )}
      {modo === 'cancelar' && (
        <Card>
          <Campo
            rotulo="Motivo do cancelamento"
            value={motivo}
            onChangeText={setMotivo}
            multiline
          />
          <Botao
            titulo="Cancelar OS"
            variante="perigo"
            carregando={enviando}
            desabilitado={motivo.trim().length < 5}
            onPress={() => rodar(() => cancelarOS(os.id, usuario!.nome, motivo.trim()))}
          />
        </Card>
      )}

      {aberta && modo === null && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Botao titulo="Editar prazo" variante="contorno" onPress={() => setModo('prazo')} />
          </View>
          <View style={{ flex: 1 }}>
            <Botao titulo="Cancelar OS" variante="contorno" onPress={() => setModo('cancelar')} />
          </View>
        </View>
      )}
      {modo !== null && <Botao titulo="Voltar" variante="contorno" onPress={() => setModo(null)} />}

      <Secao titulo="Linha do tempo (auditoria)">
        <Timeline eventos={os.timeline} />
      </Secao>
    </Tela>
  );
}

const t = StyleSheet.create({
  rotulo: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.textoSuave, marginTop: 4 },
  valor: { fontFamily: fontes.texto, fontSize: 15, color: cores.texto },
});
