import { useState } from 'react';
import { Text } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Chips } from '../../../src/components/Chips';
import { Estado } from '../../../src/components/Estado';
import { Foto } from '../../../src/components/Foto';
import { Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import {
  descartarOcorrencia,
  emitirOS,
  encaminharOcorrencia,
  listarExcecoes,
} from '../../../src/services/ocorrencias';
import { db } from '../../../src/services/store';
import { textos } from '../../../src/theme/textos';
import { Ocorrencia } from '../../../src/types';

type Modo = 'emitir' | 'encaminhar' | 'descartar' | null;

function CartaoExcecao({ o, gestor }: { o: Ocorrencia; gestor: string }) {
  const cat = db.categorias.find((c) => c.id === o.categoriaId)!;
  const [modo, setModo] = useState<Modo>(null);
  const [executorId, setExecutorId] = useState(String(cat.executorResponsavelId));
  const [orgao, setOrgao] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function rodar(fn: () => Promise<unknown>) {
    setEnviando(true);
    try {
      await fn();
    } catch (e) {
      mostrarErro(e);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <Foto rotulo="Antes" uri={o.fotoAntesUrl} altura={100} />
      <Text style={textos.tituloCartao}>{o.titulo}</Text>
      <Text style={textos.meta}>
        {cat.nome} · {o.confirmacoesSim} confirmações ·{' '}
        {cat.emissaoAutomatica ? 'rotina' : 'sem emissão automática'}
      </Text>

      {modo === null && (
        <>
          <Botao titulo="Emitir OS" onPress={() => setModo('emitir')} />
          <Botao
            titulo="Encaminhar a outro órgão"
            variante="contorno"
            onPress={() => setModo('encaminhar')}
          />
          <Botao titulo="Descartar" variante="contorno" onPress={() => setModo('descartar')} />
        </>
      )}
      {modo === 'emitir' && (
        <>
          <Text style={textos.rotulo}>
            Executor (sugerido:{' '}
            {db.executores.find((e) => e.id === cat.executorResponsavelId)?.nome})
          </Text>
          <Chips
            opcoes={db.executores.map((e) => ({ valor: String(e.id), rotulo: e.nome }))}
            selecionado={executorId}
            onChange={setExecutorId}
          />
          <Botao
            titulo="Confirmar emissão"
            carregando={enviando}
            onPress={() => rodar(() => emitirOS(o.id, Number(executorId), gestor))}
          />
        </>
      )}
      {modo === 'encaminhar' && (
        <>
          <Campo
            rotulo="Órgão"
            value={orgao}
            onChangeText={setOrgao}
            placeholder="Ex.: DER-SP, Sabesp"
          />
          <Campo rotulo="Nº do protocolo" value={protocolo} onChangeText={setProtocolo} />
          <Botao
            titulo="Encaminhar"
            carregando={enviando}
            desabilitado={!orgao.trim() || !protocolo.trim()}
            onPress={() => rodar(() => encaminharOcorrencia(o.id, orgao.trim(), protocolo.trim()))}
          />
        </>
      )}
      {modo === 'descartar' && (
        <>
          <Campo
            rotulo="Justificativa (obrigatória)"
            value={justificativa}
            onChangeText={setJustificativa}
            multiline
          />
          <Botao
            titulo="Descartar ocorrência"
            variante="perigo"
            carregando={enviando}
            desabilitado={justificativa.trim().length < 5}
            onPress={() => rodar(() => descartarOcorrencia(o.id, justificativa.trim()))}
          />
        </>
      )}
      {modo !== null && <Botao titulo="Voltar" variante="contorno" onPress={() => setModo(null)} />}
    </Card>
  );
}

export default function Excecoes() {
  const { usuario } = useAuth();
  const c = useCarga(listarExcecoes);
  return (
    <Tela titulo="Exceções" subtitulo="Ocorrências sem emissão automática de OS">
      <Estado {...c} textoVazio="Nenhuma exceção pendente. Tudo emitido!">
        {(lista) => lista.map((o) => <CartaoExcecao key={o.id} o={o} gestor={usuario!.nome} />)}
      </Estado>
    </Tela>
  );
}
