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
import { useCarga } from '../../../src/hooks/useCarga';
import {
  descartarOcorrencia,
  emitirOS,
  encaminharOcorrencia,
  listarExcecoes,
} from '../../../src/services/ocorrencias';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';
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

  async function rodar(fn: () => Promise<void>) {
    setEnviando(true);
    await fn();
    setEnviando(false);
  }

  return (
    <Card>
      <Foto rotulo="Antes" uri={o.fotoAntesUrl} altura={100} />
      <Text style={{ fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto }}>
        {o.titulo}
      </Text>
      <Text style={{ fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave }}>
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
          <Text style={{ fontFamily: fontes.textoMedio, color: cores.texto }}>
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
