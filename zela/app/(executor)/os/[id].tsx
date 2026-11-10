import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Carregando } from '../../../src/components/Carregando';
import { ComprovanteOS } from '../../../src/components/ComprovanteOS';
import { Chips } from '../../../src/components/Chips';
import { Foto } from '../../../src/components/Foto';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { Secao, Tela } from '../../../src/components/Tela';
import { Timeline } from '../../../src/components/Timeline';
import { Vazio } from '../../../src/components/Vazio';
import { useAuth } from '../../../src/context/AuthContext';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import { obterOrdem, aceitarOS, recusarOS } from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { textos } from '../../../src/theme/textos';

const MOTIVOS = [
  { valor: 'Fora da competência', rotulo: 'Fora da competência' },
  { valor: 'Falta de material', rotulo: 'Falta de material' },
  { valor: 'Sem equipe disponível', rotulo: 'Sem equipe' },
  { valor: 'Outro', rotulo: 'Outro' },
];

export default function DetalheOSExecutor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const c = useCarga(() => obterOrdem(Number(id)), [id]);
  const [recusando, setRecusando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [detalhe, setDetalhe] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (c.carregando && !c.dados) return <Carregando />;
  const os = c.dados;
  if (!os) return <Vazio texto="OS não encontrada." />;
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId)!;
  const cat = db.categorias.find((x) => x.id === o.categoriaId);
  const executor = db.executores.find((e) => e.id === os.executorId);
  const podeDecidir =
    os.status === 'EMITIDA' || os.status === 'REABERTA' || os.status === 'ESCALADA';

  async function aceitar() {
    setEnviando(true);
    try {
      await aceitarOS(os!.id, usuario!.nome);
    } catch (e) {
      mostrarErro(e);
    } finally {
      setEnviando(false);
    }
  }
  async function recusar() {
    setEnviando(true);
    try {
      await recusarOS(os!.id, usuario!.nome, [motivo, detalhe].filter(Boolean).join(': '));
      router.back();
    } catch (e) {
      mostrarErro(e);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela>
      <ComprovanteOS
        ocorrencia={o}
        os={os}
        categoria={cat}
        executor={executor}
        status={os.status}
        extras={
          os.retrabalho && os.status !== 'REABERTA' ? <StatusBadge status="REABERTA" /> : undefined
        }
      />

      {podeDecidir && !recusando && (
        <>
          <Botao titulo="Aceitar OS" onPress={aceitar} carregando={enviando} grande />
          <Botao titulo="Recusar OS" variante="contorno" onPress={() => setRecusando(true)} />
        </>
      )}
      {recusando && (
        <Card>
          <Text style={textos.rotulo}>Motivo da recusa (obrigatório)</Text>
          <Chips opcoes={MOTIVOS} selecionado={motivo} onChange={setMotivo} />
          <Campo rotulo="Detalhes" value={detalhe} onChangeText={setDetalhe} multiline />
          <Botao
            titulo="Confirmar recusa"
            variante="perigo"
            onPress={recusar}
            carregando={enviando}
            desabilitado={!motivo}
          />
          <Botao titulo="Cancelar" variante="contorno" onPress={() => setRecusando(false)} />
        </Card>
      )}
      {os.status === 'ACEITA' && (
        <Botao
          titulo="Fazer check-in no local"
          onPress={() => router.push(`/(executor)/checkin/${os.id}` as never)}
          grande
        />
      )}
      {os.status === 'EM_EXECUCAO' && (
        <Botao
          titulo="Concluir com foto do depois"
          onPress={() => router.push(`/(executor)/concluir/${os.id}` as never)}
          grande
        />
      )}

      <Secao titulo="O problema">
        <Foto rotulo="Antes" uri={o.fotoAntesUrl} />
        <Card>
          <Text style={textos.rotuloInfo}>Descrição da IA</Text>
          <Text style={textos.valor}>{o.descricaoIA}</Text>
        </Card>
      </Secao>

      <Secao titulo="Linha do tempo">
        <Timeline eventos={os.timeline} />
      </Secao>
    </Tela>
  );
}
