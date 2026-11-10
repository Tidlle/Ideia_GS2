import { Platform } from 'react-native';

/**
 * Cliente HTTP da Zela API (Java · Spring Boot), com fetch.
 * A URL vem de EXPO_PUBLIC_API_URL (veja .env.example). Sem ela: localhost na web e
 * 10.0.2.2 no emulador Android (que é o "localhost" do computador visto pelo emulador).
 */
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080')
).replace(/\/$/, '');

/** Página padrão das listagens da API: { content, page: { size, number, totalElements, totalPages } }. */
export interface Pagina<T> {
  content: T[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
}

/** Erro devolvido pela API (ProblemDetail) ou falha de rede, com mensagem pronta para a tela. */
export class ErroApi extends Error {
  constructor(
    public readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

let token: string | null = null;
let aoExpirar: (() => void) | null = null;

/** Guardado pelo AuthContext no login e na restauração da sessão. */
export function definirToken(novo: string | null) {
  token = novo;
}

/** Chamado quando a API responde 401 com um token (expirado ou inválido): o app faz logout. */
export function aoSessaoExpirar(fn: () => void) {
  aoExpirar = fn;
}

interface ProblemDetail {
  title?: string;
  detail?: string;
  erros?: { campo: string; mensagem: string }[];
}

function mensagemDoProblema(status: number, p: ProblemDetail | null): string {
  if (p?.erros?.length) return p.erros.map((e) => e.mensagem).join('\n');
  if (p?.detail) return p.detail;
  if (status === 403) return 'Você não tem permissão para esta ação.';
  if (status >= 500) return 'O servidor teve um problema. Tente de novo em instantes.';
  return `Não foi possível concluir (erro ${status}).`;
}

async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (corpo instanceof FormData) {
    body = corpo;
  } else if (corpo !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(corpo);
  }

  let resposta: Response;
  try {
    resposta = await fetch(API_URL + caminho, { method: metodo, headers, body });
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Verifique a internet e tente de novo.');
  }

  if (resposta.status === 401 && token) aoExpirar?.();
  if (!resposta.ok) {
    const problema = (await resposta.json().catch(() => null)) as ProblemDetail | null;
    throw new ErroApi(resposta.status, mensagemDoProblema(resposta.status, problema));
  }
  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

export const api = {
  get: <T>(caminho: string) => requisicao<T>('GET', caminho),
  post: <T>(caminho: string, corpo?: unknown) => requisicao<T>('POST', caminho, corpo),
  put: <T>(caminho: string, corpo?: unknown) => requisicao<T>('PUT', caminho, corpo),
  patch: <T>(caminho: string, corpo?: unknown) => requisicao<T>('PATCH', caminho, corpo),
  delete: <T>(caminho: string) => requisicao<T>('DELETE', caminho),
};

/** Envia uma foto (multipart, campo "arquivo") a partir da URI local da câmera ou da galeria. */
export async function enviarFoto<T>(caminho: string, uri: string): Promise<T> {
  const form = new FormData();
  if (Platform.OS === 'web') {
    const blob = await (await fetch(uri)).blob();
    form.append('arquivo', blob, 'foto.jpg');
  } else {
    // No React Native, o FormData aceita { uri, name, type } no lugar de um Blob.
    form.append('arquivo', { uri, name: 'foto.jpg', type: 'image/jpeg' } as unknown as Blob);
  }
  return requisicao<T>('POST', caminho, form);
}

/** A API devolve fotos como caminho relativo (/fotos/…); para exibir, vira URL completa. */
export const urlFoto = (url?: string | null): string | undefined =>
  !url ? undefined : url.startsWith('/') ? API_URL + url : url;

/** URI que ainda está só no aparelho (precisa de upload antes de ir para a API). */
export const ehArquivoLocal = (uri?: string) =>
  !!uri && /^(file|content|blob|data|ph|assets-library):/i.test(uri);
