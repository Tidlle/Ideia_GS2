import { Stack } from 'expo-router';

import { Guarda } from '../hooks/useGuarda';
import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';
import { Papel } from '../types';
import { CabecalhoAcoes } from './CabecalhoAcoes';

interface Props {
  papel: Papel;
  /** Telas de detalhe (fora das abas) e seus títulos. */
  detalhes: Record<string, string>;
}

/** Layout de cada área: protege por papel e empilha os detalhes sobre as abas. */
export function AreaStack({ papel, detalhes }: Props) {
  return (
    <Guarda papel={papel}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.escuro },
          headerTintColor: cores.claro,
          headerTitleStyle: { fontFamily: fontes.titulo },
          headerRight: () => <CabecalhoAcoes />,
          contentStyle: { backgroundColor: cores.claro },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {Object.entries(detalhes).map(([nome, titulo]) => (
          <Stack.Screen key={nome} name={nome} options={{ title: titulo }} />
        ))}
      </Stack>
    </Guarda>
  );
}
