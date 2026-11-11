import { Text } from 'react-native';

import { Card } from '../src/components/Card';
import { Tela } from '../src/components/Tela';
import { cores } from '../src/theme/cores';
import { fontes, tamanhos } from '../src/theme/tipografia';
import { COMMIT, VERSAO } from '../src/versao';

// Preencha com os dados reais do grupo antes da entrega.
const INTEGRANTES = [
  '[RM — Nome completo — Turma]',
  '[RM — Nome completo — Turma]',
  '[RM — Nome completo — Turma]',
];

export default function Sobre() {
  const t = { fontFamily: fontes.texto, fontSize: tamanhos.corpo, color: cores.texto } as const;
  return (
    <Tela titulo="Zela" subtitulo="Zeladoria colaborativa com IA">
      <Card>
        <Text style={t}>Versão: {VERSAO}</Text>
        <Text style={t} selectable accessibilityLabel={`Hash do commit ${COMMIT}`}>
          Commit: {COMMIT}
        </Text>
        <Text style={t}>Global Solution 2026/2, CitizenTech, FIAP</Text>
      </Card>
      <Card>
        <Text style={{ ...t, fontFamily: fontes.textoNegrito }}>Integrantes</Text>
        {INTEGRANTES.map((i, k) => (
          <Text key={k} style={t}>
            {i}
          </Text>
        ))}
      </Card>
    </Tela>
  );
}
