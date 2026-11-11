import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Card } from '../../../src/components/Card';
import { Estado } from '../../../src/components/Estado';
import { Foto } from '../../../src/components/Foto';
import { Tela } from '../../../src/components/Tela';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarParaConfirmar, responderConfirmacao } from '../../../src/services/ocorrencias';
import { cores } from '../../../src/theme/cores';
import { fontes, tamanhos } from '../../../src/theme/tipografia';
import { formatarDistancia } from '../../../src/utils';

export default function Confirmar() {
  const c = useCarga(listarParaConfirmar);
  const [enviando, setEnviando] = useState<number | null>(null);

  async function responder(id: number, sim: boolean) {
    setEnviando(id);
    try {
      await responderConfirmacao(id, sim);
    } catch (e) {
      mostrarErro(e);
    } finally {
      setEnviando(null);
    }
  }

  return (
    <Tela
      titulo="Confirmar problemas"
      subtitulo="Ajude a cidade a priorizar: o problema ainda existe?"
    >
      <Estado
        {...c}
        textoVazio="Nenhum problema perto de você esperando confirmação. Obrigado por ajudar!"
      >
        {(lista) =>
          lista.map((o) => (
            <Card key={o.id}>
              <Foto rotulo="Antes" uri={o.fotoAntesUrl} altura={120} />
              <Text style={styles.titulo}>{o.titulo}</Text>
              <Text style={styles.meta}>
                {o.endereco}, a {formatarDistancia(o.distanciaM)} de você
              </Text>
              <Text style={styles.pergunta}>Ainda está aqui?</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Botao
                    titulo="Sim"
                    onPress={() => responder(o.id, true)}
                    carregando={enviando === o.id}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Botao
                    titulo="Não"
                    variante="contorno"
                    onPress={() => responder(o.id, false)}
                    desabilitado={enviando === o.id}
                  />
                </View>
              </View>
            </Card>
          ))
        }
      </Estado>
    </Tela>
  );
}

const styles = StyleSheet.create({
  titulo: { fontFamily: fontes.textoNegrito, fontSize: tamanhos.corpo, color: cores.texto },
  meta: { fontFamily: fontes.texto, fontSize: tamanhos.apoio, color: cores.textoSuave },
  pergunta: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.secao,
    color: cores.texto,
    marginTop: 4,
  },
});
