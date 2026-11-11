import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Estado } from '../../../src/components/Estado';
import { Indicador } from '../../../src/components/Indicador';
import { Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { calcularIndicadores } from '../../../src/services/ordens';
import { espacos } from '../../../src/theme/espacos';

export default function Painel() {
  const router = useRouter();
  const { usuario } = useAuth();
  const c = useCarga(async () => [await calcularIndicadores()]);
  return (
    <Tela titulo="Painel da gestão" subtitulo={usuario?.bairro}>
      <Estado {...c} textoVazio="Os indicadores aparecem quando houver ordens de serviço.">
        {([i]) => (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espacos.md }}>
              <Indicador valor={i.abertas} rotulo="OS abertas" contexto="em andamento agora" />
              <Indicador
                valor={i.atrasadas}
                rotulo="OS atrasadas"
                contexto={`de ${i.abertas} abertas`}
                alerta={i.atrasadas > 0}
              />
              <Indicador
                valor={`${i.prazosCumpridosPct}%`}
                rotulo="Prazos cumpridos"
                contexto="média dos contratos"
              />
              <Indicador
                valor={`${i.retrabalhoPct}%`}
                rotulo="Retrabalho"
                contexto="OS reprovadas ou contestadas"
                alerta={i.retrabalhoPct > 10}
              />
            </View>
            <Botao
              titulo={`Tratar exceções (${i.excecoes})`}
              onPress={() => router.push('/(gestor)/excecoes')}
              grande
            />
            <Botao
              titulo="Ver OS atrasadas"
              variante="contorno"
              onPress={() => router.push('/(gestor)/ordens?filtro=ATRASADAS' as never)}
            />
          </>
        )}
      </Estado>
    </Tela>
  );
}
