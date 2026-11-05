import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Linking, StyleSheet, Switch, Text, View } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Campo } from '../../../src/components/Campo';
import { Card } from '../../../src/components/Card';
import { Chips } from '../../../src/components/Chips';
import { Secao, Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { criarOcorrencia, triarFoto } from '../../../src/services/ocorrencias';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { fontes } from '../../../src/theme/tipografia';

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

  async function aposFoto(uri: string) {
    setFoto(uri);
    setCategoriaId(null);
    setAnalisando(true); // "IA analisando…" por ~1,5 s
    const r = await triarFoto(uri);
    setCategoriaId(r.categoriaId);
    setDescricao(r.descricao);
    setAnalisando(false);
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
    } catch {
      setErro('Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela titulo="Reportar problema" subtitulo="Foto, local e a IA faz o resto.">
      <Secao titulo="1. Foto">
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} accessibilityLabel="Foto do problema" />
        ) : null}
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
              <ActivityIndicator color={cores.verde} />
              <Text style={styles.texto}>IA analisando…</Text>
            </View>
          </Card>
        )}
        {!analisando && categoriaId === null && (
          <Text style={styles.suave}>
            Adicione uma foto para a IA sugerir categoria e descrição.
          </Text>
        )}
        {!analisando && categoriaId !== null && (
          <>
            <Text style={styles.suave}>Sugestão da IA — você pode editar:</Text>
            <Chips
              opcoes={db.categorias.map((c) => ({ valor: String(c.id), rotulo: c.nome }))}
              selecionado={String(categoriaId)}
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
              trackColor={{ true: cores.urgente }}
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
        <Text style={styles.erro} accessibilityLiveRegion="polite">
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
  foto: { width: '100%', height: 200, borderRadius: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  texto: { fontFamily: fontes.texto, fontSize: 14, color: cores.texto },
  suave: { fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave },
  erro: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.urgente },
  alertaUrgente: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: cores.urgente,
    padding: 12,
    borderRadius: 12,
  },
  alertaTexto: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.branco },
});
