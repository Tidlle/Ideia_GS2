import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Botao } from '../../../src/components/Botao';
import { Card } from '../../../src/components/Card';
import { Carregando } from '../../../src/components/Carregando';
import { Tela } from '../../../src/components/Tela';
import { Vazio } from '../../../src/components/Vazio';
import { useAuth } from '../../../src/context/AuthContext';
import { mostrarErro } from '../../../src/services/feedback';
import { useCarga } from '../../../src/hooks/useCarga';
import {
  distanciaMetros,
  iniciarExecucao,
  obterOrdem,
  RAIO_CHECKIN_M,
} from '../../../src/services/ordens';
import { db } from '../../../src/services/store';
import { cores } from '../../../src/theme/cores';
import { textos } from '../../../src/theme/textos';
import { fontes, tamanhos } from '../../../src/theme/tipografia';

export default function Checkin() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const c = useCarga(() => obterOrdem(Number(id)), [id]);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [lendo, setLendo] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (c.carregando && !c.dados) return <Carregando />;
  const os = c.dados;
  if (!os) return <Vazio texto="OS não encontrada." />;
  const o = db.ocorrencias.find((x) => x.id === os.ocorrenciaId)!;
  const distancia = pos ? distanciaMetros(pos.lat, pos.lng, o.latitude, o.longitude) : null;
  const dentro = distancia !== null && distancia <= RAIO_CHECKIN_M;

  async function lerGPS() {
    setErro('');
    setLendo(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) throw new Error('Permissão de localização negada.');
      const p = await Location.getCurrentPositionAsync({});
      setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
    } catch (e) {
      setErro(
        (e instanceof Error ? e.message : 'Não foi possível ler o GPS.') +
          ' Use a simulação abaixo na demonstração.',
      );
    } finally {
      setLendo(false);
    }
  }

  async function iniciar() {
    if (!pos || distancia === null) return;
    setEnviando(true);
    try {
      await iniciarExecucao(os!.id, usuario!.nome, pos.lat, pos.lng, distancia);
      router.replace(`/(executor)/os/${os!.id}` as never);
    } catch (e) {
      mostrarErro(e, 'Check-in recusado');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela titulo="Check-in no local" subtitulo={`${o.endereco} · raio máximo ${RAIO_CHECKIN_M} m`}>
      <Botao
        titulo="Ler minha posição (GPS)"
        onPress={lerGPS}
        carregando={lendo}
        variante="secundario"
      />
      {!!erro && (
        <Text style={textos.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      )}

      <Card>
        <Text style={textos.rotuloInfo}>Simulação para a demonstração (sem GPS real)</Text>
        <Botao
          titulo="Simular: estou no local"
          variante="contorno"
          onPress={() => setPos({ lat: o.latitude + 0.0001, lng: o.longitude })}
        />
        <Botao
          titulo="Simular: estou longe (2 km)"
          variante="contorno"
          onPress={() => setPos({ lat: o.latitude + 0.018, lng: o.longitude })}
        />
      </Card>

      {distancia !== null && (
        <Card escuro={dentro} estilo={!dentro ? { borderColor: cores.perigo } : undefined}>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              fontFamily: fontes.titulo,
              fontSize: tamanhos.secao,
              color: dentro ? cores.marca : cores.perigo,
            }}
          >
            {dentro
              ? `Dentro do raio: ${Math.round(distancia)} m do local`
              : `Fora do raio: ${Math.round(distancia)} m do local`}
          </Text>
          {!dentro && (
            <Text style={textos.valor}>
              Aproxime-se do local da ocorrência para liberar o início da execução.
            </Text>
          )}
        </Card>
      )}
      <Botao
        titulo="Iniciar execução"
        onPress={iniciar}
        carregando={enviando}
        desabilitado={!dentro}
        grande
      />
    </Tela>
  );
}
