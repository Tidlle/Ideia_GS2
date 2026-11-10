import { Alert, Platform } from 'react-native';

/** Mensagem de erro para o usuário (a API já devolve textos prontos em português). */
export function mensagemDeErro(e: unknown): string {
  return e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.';
}

/** Mostra o erro de uma ação (Alert no celular; alert do navegador na web, onde o Alert do RN não aparece). */
export function mostrarErro(e: unknown, titulo = 'Não foi possível concluir') {
  const msg = mensagemDeErro(e);
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${titulo}\n\n${msg}`);
  } else {
    Alert.alert(titulo, msg);
  }
}
