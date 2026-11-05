import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { Estado } from '../src/components/Estado';
import { Tela } from '../src/components/Tela';
import { useCarga } from '../src/hooks/useCarga';
import { listarNotificacoes, marcarNotificacoesLidas } from '../src/services/ordens';
import { cores } from '../src/theme/cores';
import { fontes } from '../src/theme/tipografia';
import { formatarData } from '../src/utils';

export default function Notificacoes() {
  const c = useCarga(listarNotificacoes);
  useEffect(() => {
    // marca como lidas ao sair da tela
    return () => {
      marcarNotificacoesLidas();
    };
  }, []);

  return (
    <Tela>
      <Estado {...c} dados={c.dados} textoVazio="Nenhuma notificação por enquanto.">
        {(lista) =>
          lista.map((n) => (
            <Card key={n.id} estilo={n.lida ? undefined : { borderColor: cores.verde }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons
                  name={n.lida ? 'mail-open-outline' : 'mail-unread-outline'}
                  size={22}
                  color={cores.verdeEscuro}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: n.lida ? fontes.texto : fontes.textoMedio,
                      fontSize: 14,
                      color: cores.texto,
                    }}
                  >
                    {n.texto}
                  </Text>
                  <Text style={{ fontFamily: fontes.texto, fontSize: 12, color: cores.textoSuave }}>
                    {formatarData(n.data)}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        }
      </Estado>
    </Tela>
  );
}
