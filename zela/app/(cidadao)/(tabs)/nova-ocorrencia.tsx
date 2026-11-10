import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Switch, Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Chips } from '../../../src/components/Chips';
import { Foto } from '../../../src/components/Foto';
import { Secao, Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { mensagemDeErro } from '../../../src/services/feedback';
import { criarOcorrencia, triarFoto } from '../../../src/services/ocorrencias';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { raio } from '../../../src/theme/espacos';
import { textos } from '../../../src/theme/textos';
import { fontes, tamanhos } from '../../../src/theme/tipografia';

// Centro da Vila Mariana — usado quando o GPS não está disponível (ex.: navegador/emulador).
const LOCAL_PADRAO = { latitude: -23.5893, longitude: -46.6347 };

export default function NovaOcorrencia() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [foto, setFoto] = useState<string | undefined>();
  const [coord, setCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [endereco, setEndereco] = useState('');
  const [analisando, setAnalisando] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [urgente, setUrgente] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function aposFoto(uri: string) {
    setFoto(uri);
    setCategoriaId(null);
    setAviso('');
    setAnalisando(true); // a API envia a foto ao Gemini (Spring AI)
    try {
      const r = await triarFoto(uri);
      setCategoriaId(r.categoriaId);
      setDescricao(r.descricao);
      if (r.urgente) setUrgente(true);
      setAviso(r.aviso ?? '');
    } catch (e) {
      setAviso(`${mensagemDeErro(e)} Escolha a categoria e descreva o problema.`);
    } finally {
      setAnalisando(false);
    }
  }

  async function tirarFoto() {
    setErro('');
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return setErro('Permita o uso da câmera ou escolha uma foto da galeria.');
    const r = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!r.canceled) aposFoto(r.assets[0].uri);
  }

  async function escolherGaleria() {
    setErro('');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!r.canceled) aposFoto(r.assets[0].uri);
  }

  async function usarGPS() {
    setErro('');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted)
        return setErro('Sem permissão de localização: informe o endereço manualmente.');
      const p = await Location.getCurrentPositionAsync({});
      setCoord({ latitude: p.coords.latitude, longitude: p.coords.longitude });
      if (!endereco) setEndereco('Localização atual (GPS)');
    } catch {
      setErro('Não foi possível ler o GPS. Informe o endereço manualmente.');
    }
  }

  async function enviar() {
    if (!foto) return setErro('Adicione uma foto do problema.');
    if (!coord && !endereco.trim()) return setErro('Informe a localização (GPS ou endereço).');
    if (categoriaId === null) return setErro('Aguarde a análise ou escolha uma categoria.');
    if (!descricao.trim()) return setErro('Descreva o problema.');
    setErro('');
    setEnviando(true);
    try {
      await criarOcorrencia({
        autor: usuario!,
        categoriaId,
        descricao,
        endereco,
        ...(coord ?? LOCAL_PADRAO),
        fotoAntesUrl: foto,
        urgente,
      });
      router.replace('/(cidadao)/minhas');
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela titulo="Reportar problema" subtitulo="Foto, local e a IA faz o resto.">
      <Secao titulo="1. Foto">
        {foto ? <Foto rotulo="do problema" uri={foto} altura={200} /> : null}
        <View style={styles.linha}>
          <View style={{ flex: 1 }}>
            <Botao titulo="Tirar foto" onPress={tirarFoto} variante="secundario" />
          </View>
          <View style={{ flex: 1 }}>
            <Botao titulo="Galeria" onPress={escolherGaleria} variante="contorno" />
          </View>
        </View>
      </Secao>

      <Secao titulo="2. Localização">
        <Botao
          titulo={coord ? 'GPS capturado ✓' : 'Usar minha localização (GPS)'}
          onPress={usarGPS}
          variante="contorno"
        />
        <Campo
          rotulo="Ou informe o endereço"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, número"
        />
      </Secao>

      <Secao titulo="3. Análise da IA">
        {analisando && (
          <Card>
            <View style={styles.linha}>
              <ActivityIndicator color={cores.marca} />
              <Text style={styles.texto}>IA analisando…</Text>
            </View>
          </Card>
        )}
        {!analisando && !foto && (
          <Text style={styles.suave}>
            Adicione uma foto para a IA sugerir categoria e descrição.
          </Text>
        )}
        {!analisando && !!foto && (
          <>
            {!!aviso && (
              <Text style={styles.texto} accessibilityLiveRegion="polite">
                {aviso}
              </Text>
            )}
            <Text style={styles.suave}>
              {categoriaId !== null ? 'Sugestão da IA — você pode editar:' : 'Escolha a categoria:'}
            </Text>
            <Chips
              opcoes={db.categorias.map((c) => ({ valor: String(c.id), rotulo: c.nome }))}
              selecionado={categoriaId !== null ? String(categoriaId) : ''}
              onChange={(v) => setCategoriaId(Number(v))}
            />
            <Campo rotulo="Descrição" value={descricao} onChangeText={setDescricao} multiline />
          </>
        )}
      </Secao>

      <Secao titulo="4. Urgência">
        <Card>
          <View style={styles.linha}>
            <Text style={[styles.texto, { flex: 1 }]}>
              É urgente? (fio caído, árvore na via, risco à vida)
            </Text>
            <Switch
              value={urgente}
              onValueChange={setUrgente}
              trackColor={{ true: cores.perigo, false: cores.borda }}
              thumbColor={cores.branco}
              // só no react-native-web: sem isso o botão fica verde-azulado quando ligado
              {...({ activeThumbColor: cores.branco } as object)}
              accessibilityLabel="É urgente?"
            />
          </View>
        </Card>
        {urgente && (
          <View style={styles.alertaUrgente} accessibilityLiveRegion="polite">
            <Ionicons name="warning" size={22} color={cores.branco} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.alertaTexto}>
                Risco à vida? Ligue agora: 199 (Defesa Civil) ou 193 (Bombeiros). O Zela envia
                direto ao plantão.
              </Text>
              <View style={styles.linha}>
                <View style={{ flex: 1 }}>
                  <Botao
                    titulo="Ligar 199"
                    variante="secundario"
                    onPress={() => Linking.openURL('tel:199')}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Botao
                    titulo="Ligar 193"
                    variante="secundario"
                    onPress={() => Linking.openURL('tel:193')}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </Secao>

      {!!erro && (
        <Text style={textos.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      )}
      <Botao
        titulo="Enviar ocorrência"
        onPress={enviar}
        carregando={enviando}
        desabilitado={analisando}
        grande
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  texto: { fontFamily: fontes.texto, fontSize: tamanhos.corpo, color: cores.texto },
  suave: { fontFamily: fontes.texto, fontSize: tamanhos.apoio, color: cores.textoSuave },
  alertaUrgente: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: cores.perigo,
    padding: 12,
    borderRadius: raio.cartao,
  },
  alertaTexto: { fontFamily: fontes.textoMedio, fontSize: tamanhos.apoio, color: cores.branco },
});
