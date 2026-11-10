import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { aoSessaoExpirar, definirToken } from '../services/api';
import { limparCache } from '../services/store';
import { autenticar, carregarCatalogos } from '../services/usuarios';
import { Usuario } from '../types';

interface AuthState {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

/** Sessão salva no aparelho: o JWT da API e os dados do usuário. */
interface Sessao {
  token: string;
  usuario: Usuario;
}

const CHAVE = 'sessao';
const AuthContext = createContext<AuthState>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(async () => {
    definirToken(null);
    limparCache();
    await AsyncStorage.removeItem(CHAVE);
    setUsuario(null);
  }, []);

  useEffect(() => {
    // Token expirado ou inválido (401): encerra a sessão e as rotas protegidas voltam ao login.
    aoSessaoExpirar(() => {
      sair().catch(() => undefined);
    });
    // Restaura a sessão salva (só vale se tiver o token da API).
    AsyncStorage.getItem(CHAVE)
      .then((v) => {
        const sessao: Partial<Sessao> | null = v ? JSON.parse(v) : null;
        if (sessao?.token && sessao.usuario) {
          definirToken(sessao.token);
          setUsuario(sessao.usuario);
          carregarCatalogos(sessao.usuario.papel).catch(() => undefined);
        }
      })
      .catch(() => undefined)
      .finally(() => setCarregando(false));
  }, [sair]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const { token, usuario: u } = await autenticar(email, senha); // POST /auth/login
    definirToken(token);
    await carregarCatalogos(u.papel);
    await AsyncStorage.setItem(CHAVE, JSON.stringify({ token, usuario: u } satisfies Sessao));
    setUsuario(u);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
