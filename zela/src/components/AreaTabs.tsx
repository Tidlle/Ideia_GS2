import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { cores } from '../theme/cores';
import { fontes, tamanhos } from '../theme/tipografia';
import { CabecalhoAcoes } from './CabecalhoAcoes';
import { Marca } from './Marca';

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
        // O título da tela já está na página; o cabeçalho das abas leva a marca.
        headerTitle: () => <Marca tamanho={24} comNome />,
        headerTitleAlign: 'left',
        headerRight: () => <CabecalhoAcoes />,
        tabBarActiveTintColor: cores.link,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarStyle:
          abas.length > 1
            ? { backgroundColor: cores.cartao, borderTopColor: cores.borda, minHeight: 60 }
            : { display: 'none' },
        tabBarLabelStyle: { fontFamily: fontes.textoMedio, fontSize: tamanhos.legenda },
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
