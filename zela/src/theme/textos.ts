import { StyleSheet } from 'react-native';

import { cores } from './cores';
import { fontes } from './tipografia';

/** Estilos de texto reutilizados em todas as telas, para manter o mesmo padrão visual. */
export const textos = StyleSheet.create({
  /** Rótulo de campo ou de grupo de opções (formulários e filtros). */
  rotulo: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.texto },
  /** Nome de um dado em cartões de detalhe ("Categoria", "Local"...). */
  rotuloInfo: {
    fontFamily: fontes.textoMedio,
    fontSize: 12,
    color: cores.textoSuave,
    marginTop: 4,
  },
  /** Valor de um dado em cartões de detalhe. */
  valor: { fontFamily: fontes.texto, fontSize: 15, color: cores.texto },
  /** Título de um cartão de lista. */
  tituloCartao: { fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.texto },
  /** Informação secundária (endereço, executor, contrato...). */
  meta: { fontFamily: fontes.texto, fontSize: 13, color: cores.textoSuave },
  /** Identificador pequeno acima do título ("OS #4"). */
  id: { fontFamily: fontes.textoMedio, fontSize: 12, color: cores.textoSuave },
  /** Prazo da etapa em cartões. */
  prazo: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.laranjaEscuro },
  atrasado: { color: cores.urgente },
  /** Mensagem de erro de formulário ou de ação. */
  erro: { fontFamily: fontes.textoMedio, fontSize: 13, color: cores.urgente },
});
