import { Redirect } from 'expo-router';
import { ReactNode } from 'react';

import { Carregando } from '../components/Carregando';
import { useAuth } from '../context/AuthContext';
import { Papel } from '../types';

/** Protege o grupo de rotas: se o papel não bater, volta para "/" (que redireciona certo). */
export function Guarda({ papel, children }: { papel: Papel; children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <Carregando />;
  if (!usuario || usuario.papel !== papel) return <Redirect href="/" />;
  return <>{children}</>;
}
