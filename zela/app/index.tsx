import { Redirect } from 'expo-router';

import { Carregando } from '../src/components/Carregando';
import { useAuth } from '../src/context/AuthContext';
import { Papel } from '../src/types';

// manda cada papel para a sua área
const destino: Record<Papel, string> = {
  CIDADAO: '/(cidadao)/inicio',
  GESTOR: '/(gestor)/painel',
  EXECUTOR: '/(executor)/minhas-os',
  SUPERVISOR: '/(supervisor)/escalonamentos',
};

export default function Index() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <Carregando />;
  return <Redirect href={(usuario ? destino[usuario.papel] : '/(auth)/login') as never} />;
}
