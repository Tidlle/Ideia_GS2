import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { fontes } from '../theme/tipografia';

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
        <View style={{ gap: 2 }}>
          <Text accessibilityRole="header" style={styles.titulo}>
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
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={styles.secao}>
        {titulo}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: cores.claro },
  conteudo: { padding: 16, gap: 14, paddingBottom: 40 },
  titulo: { fontFamily: fontes.titulo, fontSize: 24, color: cores.texto },
  sub: { fontFamily: fontes.texto, fontSize: 14, color: cores.textoSuave },
  secao: { fontFamily: fontes.titulo, fontSize: 17, color: cores.texto },
});
