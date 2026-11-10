/** Paleta base, a mesma do deck. As telas usam os papéis semânticos do final do arquivo. */
const base = {
  escuro: '#10201A',
  claro: '#F4F1E8',
  cartao: '#FBFAF5',
  texto: '#14261E',
  textoSuave: '#3D4A44',
  textoSobreEscuro: '#C7D1CB',
  placeholder: '#6B7670',
  borda: '#DDD8CA',
  fotoVazia: '#E3DFD1',
  verde: '#2FBF71',
  verdeEscuro: '#17703F',
  verdeFundo: '#DDF3E6',
  laranja: '#E07B2A',
  laranjaEscuro: '#A84E14',
  laranjaFundo: '#FBE8D6',
  urgente: '#C23B22',
  urgenteFundo: '#F7DDD8',
  salvia: '#DCE5E0',
  neutroFundo: '#E8E5DA',
  branco: '#FFFFFF',
};

export const cores = {
  ...base,

  // Marca e ação: o verde vivo é só da marca e do botão principal.
  marca: base.verde,
  acao: base.verde,
  sobreAcao: base.escuro,
  link: base.verdeEscuro,

  // Estados (selos, carimbos, alertas). Cada cor tem um significado só.
  /** Concluído, resolvido, dentro do raio. */
  sucesso: base.verdeEscuro,
  sucessoFundo: base.verdeFundo,
  /** Em andamento: emitida, aceita, em execução. */
  andamento: base.escuro,
  andamentoFundo: base.salvia,
  /** Pede atenção: aguardando, reaberta, prazo perto do fim. */
  atencao: base.laranjaEscuro,
  atencaoForte: base.laranja,
  atencaoFundo: base.laranjaFundo,
  /** Risco ou falha: urgente, escalada, atrasada, recusada, erro. */
  perigo: base.urgente,
  perigoFundo: base.urgenteFundo,
  /** Fora do fluxo: descartada, encaminhada, encerrada. */
  inativo: base.textoSuave,
  inativoFundo: base.neutroFundo,
};
