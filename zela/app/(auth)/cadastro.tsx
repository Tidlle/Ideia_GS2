import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Botao } from '../../src/components/Botao';
import { Campo } from '../../src/components/Campo';
import { Tela } from '../../src/components/Tela';
import { cadastrarCidadao } from '../../src/services/usuarios';
import { cores } from '../../src/theme/cores';

export default function Cadastro() {
  const router = useRouter();
  const [f, setF] = useState({ nome: '', email: '', senha: '', confirmacao: '', bairro: '' });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((o) => ({ ...o, [k]: v }));

  async function enviar() {
    const e: Record<string, string> = {};
    if (f.nome.trim().length < 3) e.nome = 'Informe seu nome completo';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Informe um e-mail válido';
    if (f.senha.length < 6) e.senha = 'A senha tem pelo menos 6 caracteres';
    if (f.confirmacao !== f.senha) e.confirmacao = 'As senhas não conferem';
    if (!f.bairro.trim()) e.bairro = 'Informe seu bairro';
    setErros(e);
    setErroGeral('');
    if (Object.keys(e).length) return;
    setCarregando(true);
    try {
      await cadastrarCidadao(f);
      router.replace('/(auth)/login?aviso=1');
    } catch (err) {
      setErroGeral(err instanceof Error ? err.message : 'Não foi possível cadastrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela titulo="Criar conta de cidadão">
      <Campo rotulo="Nome completo" value={f.nome} onChangeText={set('nome')} erro={erros.nome} />
      <Campo
        rotulo="E-mail"
        value={f.email}
        onChangeText={set('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        erro={erros.email}
      />
      <Campo
        rotulo="Senha"
        value={f.senha}
        onChangeText={set('senha')}
        secureTextEntry
        erro={erros.senha}
      />
      <Campo
        rotulo="Confirmar senha"
        value={f.confirmacao}
        onChangeText={set('confirmacao')}
        secureTextEntry
        erro={erros.confirmacao}
      />
      <Campo rotulo="Bairro" value={f.bairro} onChangeText={set('bairro')} erro={erros.bairro} />
      {!!erroGeral && <Text style={{ color: cores.urgente }}>{erroGeral}</Text>}
      <Botao titulo="Cadastrar" onPress={enviar} carregando={carregando} grande />
    </Tela>
  );
}
