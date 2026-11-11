import { useState } from 'react';
import { Text } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Card } from '../../../src/components/Card';
import { FaixaProtocolo } from '../../../src/components/CartaoOS';
import { Chips } from '../../../src/components/Chips';
import { Estado } from '../../../src/components/Estado';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import { cobrarExecutor, listarEscalonadas, reatribuirOS } from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { textos } from '../../../src/theme/textos';
import { OrdemServico } from '../../../src/types';
import { horasDeAtraso } from '../../../src/utils';

function CartaoEscalonado({ os, supervisor }: { os: OrdemServico; supervisor: string }) {
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId);
  const e = db.executores.find((x) => x.id === os.executorId);
  const atrasoH = horasDeAtraso(os.prazoEtapa);
  const [reatribuindo, setReatribuindo] = useState(false);
  const [novo, setNovo] = useState(String(os.executorId));
  const [enviando, setEnviando] = useState(false);
  const [cobrado, setCobrado] = useState(false);

  return (
    <Card estilo={{ borderColor: cores.perigo }}>
      <FaixaProtocolo os={os} />
      <Text style={textos.tituloCartao}>{o?.titulo}</Text>
      <Text style={textos.meta}>{e?.nome}</Text>
      <StatusBadge status={os.status} />
      <Text style={[textos.prazo, textos.atrasado]}>Atrasada há {atrasoH} h</Text>
      {!reatribuindo ? (
        <>
          <Botao
            titulo={cobrado ? 'Executor cobrado ✓' : 'Cobrar executor'}
            carregando={enviando}
            desabilitado={cobrado}
            onPress={async () => {
              setEnviando(true);
              try {
                await cobrarExecutor(os.id, supervisor);
                setCobrado(true);
              } catch (e) {
                mostrarErro(e);
              } finally {
                setEnviando(false);
              }
            }}
          />
          <Botao titulo="Reatribuir" variante="contorno" onPress={() => setReatribuindo(true)} />
        </>
      ) : (
        <>
          <Chips
            opcoes={db.executores.map((x) => ({ valor: String(x.id), rotulo: x.nome }))}
            selecionado={novo}
            onChange={setNovo}
          />
          <Botao
            titulo="Confirmar reatribuição"
            carregando={enviando}
            onPress={async () => {
              setEnviando(true);
              try {
                await reatribuirOS(os.id, supervisor, Number(novo));
                setReatribuindo(false);
              } catch (e) {
                mostrarErro(e);
              } finally {
                setEnviando(false);
              }
            }}
          />
          <Botao titulo="Voltar" variante="contorno" onPress={() => setReatribuindo(false)} />
        </>
      )}
    </Card>
  );
}

export default function Escalonamentos() {
  const { usuario } = useAuth();
  const c = useCarga(listarEscalonadas);
  return (
    <Tela titulo="Escalonamentos" subtitulo="OS com prazo estourado">
      <Estado {...c} textoVazio="Nenhuma OS com prazo estourado. Os contratos estão em dia.">
        {(lista) =>
          lista.map((os) => <CartaoEscalonado key={os.id} os={os} supervisor={usuario!.nome} />)
        }
      </Estado>
    </Tela>
  );
}
