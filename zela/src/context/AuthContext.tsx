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

import { autenticar } from '../services/usuarios';
import { Usuario } from '../types';

interface AuthState {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const CHAVE = 'sessao';
const AuthContext = createContext<AuthState>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // restaura a sessão salva
    AsyncStorage.getItem(CHAVE)
      .then((v) => v && setUsuario(JSON.parse(v)))
      .catch(() => undefined)
      .finally(() => setCarregando(false));
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const u = await autenticar(email, senha); // simula a chamada à API
    await AsyncStorage.setItem(CHAVE, JSON.stringify(u));
    setUsuario(u);
  }, []);

  const sair = useCallback(async () => {
    await AsyncStorage.removeItem(CHAVE);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
