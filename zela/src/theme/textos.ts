import { StyleSheet } from 'react-native';

import { cores } from './cores';
import { fontes, linhas, tamanhos } from './tipografia';

/** Estilos de texto reutilizados em todas as telas, para manter o mesmo padrão visual. */
export const textos = StyleSheet.create({
  /** Título da tela. */
  titulo: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.titulo,
    lineHeight: linhas.titulo,
    color: cores.texto,
  },
  /** Título de seção. */
  secao: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.secao,
    lineHeight: linhas.secao,
    color: cores.texto,
  },
  /** Texto corrido. */
  corpo: {
    fontFamily: fontes.texto,
    fontSize: tamanhos.corpo,
    lineHeight: linhas.corpo,
    color: cores.texto,
  },
  /** Rótulo de campo ou de grupo de opções (formulários e filtros). */
  rotulo: {
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.apoio,
    lineHeight: linhas.apoio,
    color: cores.texto,
  },
  /** Nome de um dado em cartões de detalhe ("Categoria", "Local"...). */
  rotuloInfo: {
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.legenda,
    lineHeight: linhas.legenda,
    color: cores.textoSuave,
    marginTop: 4,
  },
  /** Valor de um dado em cartões de detalhe. */
  valor: {
    fontFamily: fontes.texto,
    fontSize: tamanhos.corpo,
    lineHeight: linhas.corpo,
    color: cores.texto,
  },
  /** Título de um item de lista. */
  tituloCartao: {
    fontFamily: fontes.textoNegrito,
    fontSize: tamanhos.corpo,
    lineHeight: linhas.corpo,
    color: cores.texto,
  },
  /** Informação secundária (endereço, executor, contrato...). */
  meta: {
    fontFamily: fontes.texto,
    fontSize: tamanhos.apoio,
    lineHeight: linhas.apoio,
    color: cores.textoSuave,
  },
  /** Texto pequeno (datas, legendas). */
  legenda: {
    fontFamily: fontes.texto,
    fontSize: tamanhos.legenda,
    lineHeight: linhas.legenda,
    color: cores.textoSuave,
  },
  /** Identificador pequeno acima do título ("OS 4"). */
  id: {
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.legenda,
    lineHeight: linhas.legenda,
    color: cores.textoSuave,
  },
  /** Prazo da etapa em cartões. */
  prazo: {
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.apoio,
    lineHeight: linhas.apoio,
    color: cores.textoSuave,
  },
  prazoPerto: { color: cores.atencao },
  atrasado: { color: cores.perigo },
  /** Mensagem de erro de formulário ou de ação. */
  erro: {
    fontFamily: fontes.textoMedio,
    fontSize: tamanhos.apoio,
    lineHeight: linhas.apoio,
    color: cores.perigo,
  },
  /** Números de destaque (protocolo, indicadores): algarismos de mesma largura. */
  numero: {
    fontFamily: fontes.titulo,
    fontSize: tamanhos.display,
    lineHeight: linhas.display,
    color: cores.texto,
    fontVariant: ['tabular-nums'],
  },
});
