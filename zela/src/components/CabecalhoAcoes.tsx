import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { cores } from '../theme/cores';
import { TOQUE_MIN } from '../theme/espacos';
import { comFoco } from '../theme/foco';

/** Atalhos de notificações e perfil no cabeçalho de todas as áreas. */
export function CabecalhoAcoes() {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        onPress={() => router.push('/notificacoes')}
        style={(e) => ({
          ...comFoco(e),
          width: TOQUE_MIN,
          height: TOQUE_MIN,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Ionicons name="notifications-outline" size={24} color={cores.claro} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Perfil"
        onPress={() => router.push('/perfil')}
        style={(e) => ({
          ...comFoco(e),
          width: TOQUE_MIN,
          height: TOQUE_MIN,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Ionicons name="person-circle-outline" size={26} color={cores.claro} />
      </Pressable>
    </View>
  );
}
