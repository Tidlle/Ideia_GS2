import { useRouter } from 'expo-router';
import { Text } from 'react-native';

import { Botao } from '../src/components/Botao';
import { Card } from '../src/components/Card';
import { Tela } from '../src/components/Tela';
import { useAuth } from '../src/context/AuthContext';
import { cores } from '../src/theme/cores';
import { fontes, tamanhos } from '../src/theme/tipografia';

const PAPEIS = {
  CIDADAO: 'Cidadão',
  GESTOR: 'Gestor',
  EXECUTOR: 'Executor',
  SUPERVISOR: 'Supervisor',
};

export default function Perfil() {
  const { usuario, sair } = useAuth();
  const router = useRouter();
  if (!usuario) return null;

  async function logout() {
    await sair(); // limpa a sessão; as rotas protegidas voltam ao login
    router.replace('/');
  }

  const linha = (rotulo: string, valor?: string | number) =>
    valor === undefined ? null : (
      <Text style={{ fontFamily: fontes.texto, fontSize: tamanhos.corpo, color: cores.texto }}>
        <Text style={{ fontFamily: fontes.textoMedio }}>{rotulo}: </Text>
        {valor}
      </Text>
    );

  return (
    <Tela titulo={usuario.nome} subtitulo={PAPEIS[usuario.papel]}>
      <Card>
        {linha('E-mail', usuario.email)}
        {linha('Papel', PAPEIS[usuario.papel])}
        {linha('Bairro', usuario.bairro)}
        {linha(
          'Reputação',
          usuario.reputacao !== undefined ? `${usuario.reputacao} pontos` : undefined,
        )}
      </Card>
      <Botao titulo="Sobre o app" variante="contorno" onPress={() => router.push('/sobre')} />
      <Botao titulo="Sair" variante="perigo" onPress={logout} />
    </Tela>
  );
}
