import { useRouter } from 'expo-router';
import { Text } from 'react-native';

import { CartaoOS } from '../../../src/components/CartaoOS';
import { Estado } from '../../../src/components/Estado';
import { Secao, Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarOrdensDoExecutor } from '../../../src/services/ordens';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';
import { OrdemServico } from '../../../src/types';

const GRUPOS: { titulo: string; status: string[] }[] = [
  { titulo: 'Novas', status: ['EMITIDA', 'REABERTA', 'ESCALADA'] },
  { titulo: 'Em andamento', status: ['ACEITA', 'EM_EXECUCAO'] },
  { titulo: 'Concluídas', status: ['CONCLUIDA', 'VALIDADA', 'ENCERRADA'] },
];

export default function MinhasOS() {
  const { usuario } = useAuth();
  const router = useRouter();
  const c = useCarga(() => listarOrdensDoExecutor(usuario!.executorId!), [usuario?.executorId]);
  const abrir = (os: OrdemServico) => router.push(`/(executor)/os/${os.id}` as never);

  return (
    <Tela titulo="Minhas OS" subtitulo={usuario?.nome}>
      <Estado
        {...c}
        textoVazio="Nenhuma ordem de serviço para sua equipe agora. As novas aparecem aqui."
      >
        {(lista) =>
          GRUPOS.map((g) => {
            const itens = lista.filter((o) => g.status.includes(o.status));
            return (
              <Secao key={g.titulo} titulo={`${g.titulo} (${itens.length})`}>
                {itens.length === 0 ? (
                  <Text style={{ fontFamily: fontes.texto, color: cores.textoSuave }}>
                    Nada por aqui.
                  </Text>
                ) : (
                  itens.map((os) => <CartaoOS key={os.id} os={os} onPress={() => abrir(os)} />)
                )}
              </Secao>
            );
          })
        }
      </Estado>
    </Tela>
  );
}
