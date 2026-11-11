import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Carregando } from '../../../src/components/Carregando';
import { Foto } from '../../../src/components/Foto';
import { Tela } from '../../../src/components/Tela';
import { Vazio } from '../../../src/components/Vazio';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { mensagemDeErro } from '../../../src/services/feedback';
import { concluirOS, obterOrdem } from '../../../src/services/ordens';
import { cores } from '../../../src/theme/cores';
import { textos } from '../../../src/theme/textos';
import { fontes, tamanhos } from '../../../src/theme/tipografia';

export default function Concluir() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const c = useCarga(() => obterOrdem(Number(id)), [id]);
  const [foto, setFoto] = useState<string | undefined>();
  const [obs, setObs] = useState('');
  const [erro, setErro] = useState('');
  const [fase, setFase] = useState<'form' | 'comparando' | 'pronto'>('form');
  const [confianca, setConfianca] = useState<number | null>(null);

  if (c.carregando && !c.dados) return <Carregando />;
  const os = c.dados;
  if (!os) return <Vazio texto="OS não encontrada." />;

  async function tirarFoto() {
    setErro('');
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted)
      return setErro('Permita o uso da câmera: a foto do depois deve ser tirada no local.');
    const r = await ImagePicker.launchCameraAsync({ quality: 0.6 }); // só câmera, sem galeria
    if (!r.canceled) setFoto(r.assets[0].uri);
  }

  async function enviar() {
    if (!foto) return setErro('A foto do depois é obrigatória.');
    setErro('');
    setFase('comparando'); // a API envia antes e depois ao Gemini e devolve a confiança
    try {
      const concluida = await concluirOS(os!.id, usuario!.nome, foto, obs);
      setConfianca(concluida.confiancaIA ?? null);
      setFase('pronto');
    } catch (e) {
      setErro(mensagemDeErro(e));
      setFase('form');
    }
  }

  if (fase === 'comparando')
    return (
      <Tela titulo="Enviando evidência">
        <Card>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <ActivityIndicator color={cores.marca} />
            <Text
              style={{ fontFamily: fontes.texto, fontSize: tamanhos.corpo, color: cores.texto }}
            >
              IA comparando antes e depois…
            </Text>
          </View>
        </Card>
      </Tela>
    );

  if (fase === 'pronto')
    return (
      <Tela titulo="OS concluída">
        <Card escuro>
          <Ionicons name="checkmark-circle" size={36} color={cores.marca} />
          <Text style={{ fontFamily: fontes.titulo, fontSize: tamanhos.secao, color: cores.claro }}>
            {confianca !== null
              ? `Confiança da IA: ${Math.round(confianca * 100)}%`
              : 'Comparação da IA indisponível'}
          </Text>
          <Text
            style={{
              fontFamily: fontes.texto,
              fontSize: tamanhos.corpo,
              color: cores.textoSobreEscuro,
            }}
          >
            Agora o gestor e o cidadão podem validar. Sem contestação em 48 h, com IA confiante,
            vale o aceite tácito.
          </Text>
        </Card>
        <Botao
          titulo="Voltar para minhas OS"
          onPress={() => router.replace('/(executor)/minhas-os')}
          grande
        />
      </Tela>
    );

  return (
    <Tela titulo={`Concluir a OS ${os.id}`} subtitulo="Foto do depois tirada no local (só câmera)">
      {foto ? <Foto rotulo="Depois" uri={foto} altura={200} /> : null}
      <Botao
        titulo={foto ? 'Tirar outra foto' : 'Tirar foto do depois'}
        onPress={tirarFoto}
        variante="secundario"
      />
      <Campo
        rotulo="Observação"
        value={obs}
        onChangeText={setObs}
        multiline
        placeholder="O que foi feito?"
      />
      {!!erro && (
        <Text style={textos.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      )}
      <Botao titulo="Enviar conclusão" onPress={enviar} grande />
    </Tela>
  );
}
