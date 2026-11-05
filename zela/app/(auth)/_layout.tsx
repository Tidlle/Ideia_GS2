import { Stack } from 'expo-router';

import { cores } from '../../src/theme/cores';
import { fontes } from '../../src/theme/tipografia';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.escuro },
        headerTintColor: cores.claro,
        headerTitleStyle: { fontFamily: fontes.titulo },
        contentStyle: { backgroundColor: cores.claro },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
    </Stack>
  );
}
