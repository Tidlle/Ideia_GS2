import {
  PublicSans_400Regular,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans';
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '../src/context/AuthContext';
import { DadosProvider } from '../src/context/DadosContext';
import { cores } from '../src/theme/cores';
import { fontes } from '../src/theme/tipografia';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [carregou, erro] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    PublicSans_400Regular,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  useEffect(() => {
    if (carregou || erro) SplashScreen.hideAsync().catch(() => undefined);
  }, [carregou, erro]);

  if (!carregou && !erro) return null;

  return (
    <AuthProvider>
      <DadosProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: cores.escuro },
            headerTintColor: cores.claro,
            headerTitleStyle: { fontFamily: fontes.titulo },
            contentStyle: { backgroundColor: cores.claro },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(cidadao)" options={{ headerShown: false }} />
          <Stack.Screen name="(gestor)" options={{ headerShown: false }} />
          <Stack.Screen name="(executor)" options={{ headerShown: false }} />
          <Stack.Screen name="(supervisor)" options={{ headerShown: false }} />
          <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
          <Stack.Screen name="notificacoes" options={{ title: 'Notificações' }} />
          <Stack.Screen name="sobre" options={{ title: 'Sobre o app' }} />
        </Stack>
      </DadosProvider>
    </AuthProvider>
  );
}
