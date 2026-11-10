import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Carregando } from '../../../src/components/Carregando';
import { ComprovanteOS } from '../../../src/components/ComprovanteOS';
import { Foto } from '../../../src/components/Foto';
import { Secao, Tela } from '../../../src/components/Tela';
import { Timeline } from '../../../src/components/Timeline';
import { Vazio } from '../../../src/components/Vazio';
import { useAuth } from '../../../src/context/AuthContext';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import { obterOcorrencia } from '../../../src/services/ocorrencias';
import { obterOrdem, responderSolucao } from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { espacos } from '../../../src/theme/espacos';
import { textos } from '../../../src/theme/textos';
import { textoConfirmacoes } from '../../../src/utils';

export default function DetalheOcorrencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const c = useCarga(async () => {
    const o = await obterOcorrencia(Number(id));
    const os = o?.osId ? await obterOrdem(o.osId) : undefined;
    return { o, os };
  }, [id]);
  const [contestando, setContestando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  // Liga a animação do carimbo só quando o cidadão acabou de confirmar a solução.
  const [resolvidaAgora, setResolvidaAgora] = useState(false);

  if (c.carregando && !c.dados) return <Carregando />;
  const { o, os } = c.dados ?? {};
  if (!o) return <Vazio texto="Ocorrência não encontrada." />;

  const categoria = db.categorias.find((x) => x.id === o.categoriaId);
  const executor = os ? db.executores.find((e) => e.id === os.executorId) : undefined;
  const podeAvaliar = os?.status === 'CONCLUIDA' && o.autorId === usuario?.id;
  const temDepois =
    !!os?.fotoDepoisUrl || (!!os && ['CONCLUIDA', 'VALIDADA', 'ENCERRADA'].includes(os.status));

  async function responder(confirmou: boolean) {
    if (!os) return;
    setEnviando(true);
    try {
      await responderSolucao(os.id, usuario!.nome, confirmou, motivo);
      setContestando(false);
      if (confirmou) setResolvidaAgora(true);
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
        categoria={categoria}
        executor={executor}
        status={o.status}
        animarCarimbo={resolvidaAgora}
      />

      {podeAvaliar && (
        <Card escuro>
          <Text style={[textos.valor, { color: cores.claro }]}>
            O executor concluiu o serviço. Está resolvido?
          </Text>
          {contestando ? (
            <>
              <Campo
                rotulo="Por que está contestando?"
                value={motivo}
                onChangeText={setMotivo}
                multiline
                sobreEscuro
              />
              <Botao
                titulo="Enviar contestação"
                variante="perigo"
                onPress={() => responder(false)}
                carregando={enviando}
                desabilitado={motivo.trim().length < 5}
              />
              <Botao
                titulo="Cancelar"
                variante="contornoClaro"
                onPress={() => setContestando(false)}
              />
            </>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Botao
                  titulo="Confirmar solução"
                  onPress={() => responder(true)}
                  carregando={enviando}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Botao
                  titulo="Contestar"
                  variante="contornoClaro"
                  onPress={() => setContestando(true)}
                />
              </View>
            </View>
          )}
        </Card>
      )}

      <Secao titulo={temDepois ? 'Antes e depois' : 'Foto do problema'}>
        <View style={{ flexDirection: 'row', gap: espacos.sm }}>
          <View style={{ flex: 1 }}>
            <Foto rotulo="Antes" uri={o.fotoAntesUrl} altura={temDepois ? 150 : 200} />
          </View>
          {temDepois && (
            <View style={{ flex: 1 }}>
              <Foto rotulo="Depois" uri={os?.fotoDepoisUrl} altura={150} />
            </View>
          )}
        </View>
      </Secao>

      <Card>
        <Text style={textos.rotuloInfo}>Descrição</Text>
        <Text style={textos.valor}>{o.descricaoIA}</Text>
        <Text style={textos.rotuloInfo}>Confirmações dos vizinhos</Text>
        <Text style={textos.valor}>{textoConfirmacoes(o.confirmacoesSim, o.confirmacoesNao)}</Text>
        {!!o.orgaoEncaminhado && (
          <>
            <Text style={textos.rotuloInfo}>Encaminhada a outro órgão</Text>
            <Text style={textos.valor}>
              {o.orgaoEncaminhado}, protocolo {o.protocoloExterno}
            </Text>
          </>
        )}
        {!!o.motivoDescarte && (
          <>
            <Text style={textos.rotuloInfo}>Motivo do descarte</Text>
            <Text style={textos.valor}>{o.motivoDescarte}</Text>
          </>
        )}
      </Card>

      <Secao titulo="Linha do tempo">
        {os ? (
          <Timeline eventos={os.timeline} />
        ) : (
          <Text style={textos.meta}>A ordem de serviço ainda não foi emitida.</Text>
        )}
      </Secao>
    </Tela>
  );
}
