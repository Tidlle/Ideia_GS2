import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cores } from '../theme/cores';

type Glifo = keyof typeof MaterialCommunityIcons.glyphMap;

/**
 * Ícone de cada categoria, escolhido no app (e não no seed da API) para manter um conjunto
 * coerente: o objeto que a equipe vê na rua.
 */
const ICONES: Record<string, Glifo> = {
  iluminacao: 'lightbulb-on',
  buraco: 'traffic-cone',
  entulho: 'dump-truck',
  calcada: 'wall',
  arvore: 'tree',
};

/** "Iluminação" -> "iluminacao", para casar com o nome que vem da API. */
const normalizar = (nome: string) =>
  nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function iconeDaCategoria(nome?: string): Glifo {
  return (nome && ICONES[normalizar(nome)]) || 'map-marker-question';
}

export function IconeCategoria({
  nome,
  tamanho = 18,
  cor = cores.link,
}: {
  nome?: string;
  tamanho?: number;
  cor?: string;
}) {
  return (
    <MaterialCommunityIcons
      name={iconeDaCategoria(nome)}
      size={tamanho}
      color={cor}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
