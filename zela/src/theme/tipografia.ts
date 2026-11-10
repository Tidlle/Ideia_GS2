export const fontes = {
  titulo: 'SpaceGrotesk_700Bold',
  tituloMedio: 'SpaceGrotesk_500Medium',
  texto: 'PublicSans_400Regular',
  textoMedio: 'PublicSans_600SemiBold',
  textoNegrito: 'PublicSans_700Bold',
};

/**
 * Escala tipográfica do app: seis tamanhos, sem valores avulsos nas telas.
 * - legenda: selos, datas, rótulos de métricas
 * - apoio: informação secundária, rótulos de campo
 * - corpo: texto e botões
 * - secao: títulos de seção e números de métricas
 * - titulo: título da tela
 * - display: números de destaque (protocolo, indicadores)
 */
export const tamanhos = { legenda: 12, apoio: 13, corpo: 15, secao: 18, titulo: 24, display: 34 };

/** Altura de linha correspondente a cada tamanho (ritmo vertical). */
export const linhas = { legenda: 16, apoio: 18, corpo: 21, secao: 24, titulo: 30, display: 38 };
