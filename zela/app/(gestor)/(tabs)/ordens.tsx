import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { CartaoOS } from '../../../src/components/CartaoOS';
import { Chips } from '../../../src/components/Chips';
import { Estado } from '../../../src/components/Estado';
import { Tela } from '../../../src/components/Tela';
import { useCarga } from '../../../src/hooks/useCarga';
import { ehAtrasada, listarOrdens } from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { textos } from '../../../src/theme/textos';

const STATUS = [
  { valor: 'TODOS', rotulo: 'Todos' },
  { valor: 'ATRASADAS', rotulo: 'Atrasadas' },
  { valor: 'EMITIDA', rotulo: 'Emitidas' },
  { valor: 'EM_EXECUCAO', rotulo: 'Em execução' },
  { valor: 'CONCLUIDA', rotulo: 'Concluídas' },
  { valor: 'REABERTA', rotulo: 'Reabertas' },
  { valor: 'ESCALADA', rotulo: 'Escaladas' },
  { valor: 'ENCERRADA', rotulo: 'Encerradas' },
];

export default function Ordens() {
  const router = useRouter();
  const { filtro: filtroInicial } = useLocalSearchParams<{ filtro?: string }>();
  const [filtro, setFiltro] = useState(filtroInicial ?? 'TODOS');
  const [executor, setExecutor] = useState('TODOS');
  const [bairro, setBairro] = useState('TODOS');
  const c = useCarga(listarOrdens);

  const bairros = Array.from(new Set(db.ocorrencias.map((o) => o.bairro)));
  const filtradas = c.dados?.filter((os) => {
    const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId);
    if (filtro === 'ATRASADAS' ? !ehAtrasada(os) : filtro !== 'TODOS' && os.status !== filtro)
      return false;
    if (executor !== 'TODOS' && String(os.executorId) !== executor) return false;
    if (bairro !== 'TODOS' && o?.bairro !== bairro) return false;
    return true;
  });

  return (
    <Tela titulo="Ordens de serviço">
      <Text style={textos.rotulo}>Status</Text>
      <Chips opcoes={STATUS} selecionado={filtro} onChange={setFiltro} />
      <Text style={textos.rotulo}>Executor</Text>
      <Chips
        opcoes={[
          { valor: 'TODOS', rotulo: 'Todos' },
          ...db.executores.map((e) => ({ valor: String(e.id), rotulo: e.nome })),
        ]}
        selecionado={executor}
        onChange={setExecutor}
      />
      <Text style={textos.rotulo}>Bairro</Text>
      <Chips
        opcoes={[
          { valor: 'TODOS', rotulo: 'Todos' },
          ...bairros.map((b) => ({ valor: b, rotulo: b })),
        ]}
        selecionado={bairro}
        onChange={setBairro}
      />
      <Estado
        {...c}
        dados={filtradas}
        textoVazio="Nenhuma OS com esses filtros."
        acaoVazio={{
          titulo: 'Limpar filtros',
          onPress: () => {
            setFiltro('TODOS');
            setExecutor('TODOS');
            setBairro('TODOS');
          },
        }}
      >
        {(lista) =>
          lista.map((os) => (
            <CartaoOS
              key={os.id}
              os={os}
              mostrarExecutor
              onPress={() => router.push(`/(gestor)/ordem/${os.id}` as never)}
            />
          ))
        }
      </Estado>
    </Tela>
  );
}
