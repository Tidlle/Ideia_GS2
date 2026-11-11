import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CartaoOcorrencia, Grupo } from '../../../src/components/CartaoOcorrencia';
import { Estado } from '../../../src/components/Estado';
import { Secao, Tela } from '../../../src/components/Tela';
import { useAuth } from '../../../src/context/AuthContext';
import { useCarga } from '../../../src/hooks/useCarga';
import { listarOcorrencias } from '../../../src/services/ocorrencias';
import { cores } from '../../../src/theme/cores';
import { espacos, raio } from '../../../src/theme/espacos';
import { textos } from '../../../src/theme/textos';

export default function Inicio() {
  const { usuario } = useAuth();
  const router = useRouter();
  const c = useCarga(listarOcorrencias);
  return (
    <Tela titulo={`Olá, ${usuario?.nome.split(' ')[0]}`} subtitulo={usuario?.bairro}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reportar um problema: tire uma foto e marque o local"
        onPress={() => router.push('/(cidadao)/nova-ocorrencia')}
        style={({ pressed }) => [styles.reportar, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.camera}>
          <Ionicons name="camera" size={26} color={cores.sobreAcao} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[textos.secao, { color: cores.claro }]}>Reportar um problema</Text>
          <Text style={[textos.meta, { color: cores.textoSobreEscuro }]}>
            Tire uma foto e marque o local. A IA faz a triagem.
          </Text>
        </View>
      </Pressable>

      <Secao titulo="Perto de você">
        <Estado {...c} textoVazio="Nenhuma ocorrência no seu bairro. Que bom!">
          {(lista) => (
            <Grupo>
              {lista.map((o) => (
                <CartaoOcorrencia key={o.id} o={o} mostrarDistancia />
              ))}
            </Grupo>
          )}
        </Estado>
      </Secao>
    </Tela>
  );
}

const styles = StyleSheet.create({
  reportar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.lg,
    padding: espacos.lg,
    borderRadius: raio.cartao,
    backgroundColor: cores.escuro,
  },
  camera: {
    width: 56,
    height: 56,
    borderRadius: raio.pilula,
    backgroundColor: cores.acao,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
