import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';
import { CabecalhoAcoes } from './CabecalhoAcoes';

interface Aba {
  nome: string;
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
}

interface Props {
  abas: Aba[];
}

export function AreaTabs({ abas }: Props) {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.escuro },
        headerTintColor: cores.claro,
        headerTitleStyle: { fontFamily: fontes.titulo },
        headerRight: () => <CabecalhoAcoes />,
        tabBarActiveTintColor: cores.verdeEscuro,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarStyle: {
          backgroundColor: cores.cartao,
          borderTopColor: cores.borda,
          minHeight: 60,
        },
        tabBarLabelStyle: { fontFamily: fontes.textoMedio, fontSize: 11 },
      }}
    >
      {abas.map((a) => (
        <Tabs.Screen
          key={a.nome}
          name={a.nome}
          options={{
            title: a.titulo,
            tabBarAccessibilityLabel: a.titulo,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={a.icone} size={size} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
