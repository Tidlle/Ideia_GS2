import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

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
import { obterOrdem, aceitarOS, recusarOS } from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';
import { descreverPrazo } from '../../../src/utils';

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
  const prazo = descreverPrazo(os.prazoEtapa);
  const podeDecidir =
    os.status === 'EMITIDA' || os.status === 'REABERTA' || os.status === 'ESCALADA';

  async function aceitar() {
    setEnviando(true);
    await aceitarOS(os!.id, usuario!.nome);
    setEnviando(false);
  }
  async function recusar() {
    setEnviando(true);
    await recusarOS(os!.id, usuario!.nome, [motivo, detalhe].filter(Boolean).join(': '));
    setEnviando(false);
    router.back();
  }

  return (
    <Tela titulo={`OS #${os.id}`} subtitulo={o.titulo}>
      <StatusBadge status={os.status} />
      <Foto rotulo="Antes" uri={o.fotoAntesUrl} />
      <Card>
        <Text style={t.rotulo}>Categoria</Text>
        <Text style={t.valor}>{cat?.nome}</Text>
        <Text style={t.rotulo}>Local</Text>
        <Text style={t.valor}>
          {o.endereco} ({o.bairro})
        </Text>
        <Text style={t.rotulo}>Descrição</Text>
        <Text style={t.valor}>{o.descricaoIA}</Text>
        <Text style={t.rotulo}>Prazo da etapa</Text>
        <Text style={[t.valor, prazo.atrasado && { color: cores.urgente }]}>{prazo.texto}</Text>
      </Card>

      {podeDecidir && !recusando && (
        <>
          <Botao titulo="Aceitar OS" onPress={aceitar} carregando={enviando} grande />
          <Botao titulo="Recusar OS" variante="contorno" onPress={() => setRecusando(true)} />
        </>
      )}
      {recusando && (
        <Card>
          <Text style={t.valor}>Motivo da recusa (obrigatório)</Text>
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

      <Secao titulo="Linha do tempo">
        <Timeline eventos={os.timeline} />
      </Secao>
    </Tela>
  );
}

const t = {
  rotulo: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.textoSuave, marginTop: 4 },
  valor: { fontFamily: fontes.texto, fontSize: 15, color: cores.texto },
} as const;
