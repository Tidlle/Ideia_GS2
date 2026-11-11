import { useState } from 'react';

import { CartaoOcorrencia, Grupo } from '../../../src/components/CartaoOcorrencia';
import { Chips } from '../../../src/components/Chips';
import { Estado } from '../../../src/components/Estado';
import { Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarMinhasOcorrencias } from '../../../src/services/ocorrencias';

const FILTROS = [
  { valor: 'TODAS', rotulo: 'Todas' },
  { valor: 'AGUARDANDO_CONFIRMACAO', rotulo: 'Aguardando' },
  { valor: 'EM_ATENDIMENTO', rotulo: 'Em atendimento' },
  { valor: 'URGENTE', rotulo: 'Urgentes' },
  { valor: 'RESOLVIDA', rotulo: 'Resolvidas' },
];

export default function Minhas() {
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState('TODAS');
  const c = useCarga(() => listarMinhasOcorrencias(usuario!.id), [usuario?.id]);
  const filtradas = c.dados?.filter((o) => filtro === 'TODAS' || o.status === filtro);
  return (
    <Tela titulo="Minhas ocorrências">
      <Chips opcoes={FILTROS} selecionado={filtro} onChange={setFiltro} />
      <Estado
        {...c}
        dados={filtradas}
        textoVazio={
          filtro === 'TODAS'
            ? 'Você ainda não reportou nenhum problema.'
            : 'Nenhuma ocorrência sua com esse status.'
        }
        acaoVazio={
          filtro === 'TODAS'
            ? undefined
            : { titulo: 'Ver todas', onPress: () => setFiltro('TODAS') }
        }
      >
        {(lista) => (
          <Grupo>
            {lista.map((o) => (
              <CartaoOcorrencia key={o.id} o={o} mostrarPrazo />
            ))}
          </Grupo>
        )}
      </Estado>
    </Tela>
  );
}
