import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos } from '../theme/espacos';
import { textos } from '../theme/textos';

/** Contêiner padrão das telas: fundo, rolagem e título opcional. */
export function Tela({
  children,
  titulo,
  subtitulo,
}: {
  children: ReactNode;
  titulo?: string;
  subtitulo?: string;
}) {
  return (
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {!!titulo && (
        <View style={{ gap: espacos.xs }}>
          <Text accessibilityRole="header" style={textos.titulo}>
            {titulo}
          </Text>
          {!!subtitulo && <Text style={styles.sub}>{subtitulo}</Text>}
        </View>
      )}
      {children}
    </ScrollView>
  );
}

export function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={{ gap: espacos.sm }}>
      <Text accessibilityRole="header" style={textos.secao}>
        {titulo}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: cores.claro },
  conteudo: { padding: espacos.lg, gap: espacos.lg, paddingBottom: espacos.xxl + espacos.sm },
  sub: { ...textos.meta },
});
