import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../src/components/Botao';
import { Campo } from '../../src/components/Campo';
import { useAuth } from '../../src/context/AuthContext';
import { cores } from '../../src/theme/cores';
import { textos } from '../../src/theme/textos';
import { fontes } from '../../src/theme/tipografia';

const ATALHOS = [
  { rotulo: 'Cidadão', email: 'cidadao@zela.com' },
  { rotulo: 'Gestor', email: 'gestor@zela.com' },
  { rotulo: 'Executor', email: 'executor@zela.com' },
  { rotulo: 'Supervisor', email: 'supervisor@zela.com' },
];

export default function Login() {
  const router = useRouter();
  const { entrar } = useAuth();
  const { aviso } = useLocalSearchParams<{ aviso?: string }>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const e: typeof erros = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Informe um e-mail válido';
    if (senha.length < 6) e.senha = 'A senha tem pelo menos 6 caracteres';
    setErros(e);
    setErroGeral('');
    if (Object.keys(e).length) return;
    setCarregando(true);
    try {
      await entrar(email, senha);
      router.replace('/');
    } catch (err) {
      setErroGeral(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.escuro }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Ionicons name="home-outline" size={34} color={cores.verde} />
        </View>
        <Text style={styles.marca}>Zela</Text>
        <Text style={styles.lema}>
          O cidadão reporta, a cidade prioriza e todo mundo acompanha.
        </Text>

        <View style={styles.formulario}>
          {!!aviso && (
            <Text style={styles.sucesso} accessibilityLiveRegion="polite">
              Cadastro concluído! Entre com seu e-mail e senha.
            </Text>
          )}
          <Campo
            rotulo="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            erro={erros.email}
            placeholder="voce@email.com"
          />
          <Campo
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            erro={erros.senha}
            placeholder="••••••"
          />
          {!!erroGeral && (
            <Text style={textos.erro} accessibilityLiveRegion="polite">
              {erroGeral}
            </Text>
          )}
          <Botao titulo="Entrar" onPress={enviar} carregando={carregando} grande />
          <Link href="/(auth)/cadastro" style={styles.link} accessibilityRole="link">
            Não tem conta? Cadastre-se
          </Link>
        </View>

        <View style={styles.atalhos}>
          <Text style={styles.atalhosTitulo}>Entrar como (demonstração, senha 123456)</Text>
          <View style={styles.atalhosLinha}>
            {ATALHOS.map((a) => (
              <View key={a.rotulo} style={{ flexGrow: 1, flexBasis: '45%' }}>
                <Botao
                  titulo={a.rotulo}
                  rotuloAcessivel={`Entrar como ${a.rotulo}`}
                  variante="contornoClaro"
                  onPress={() => {
                    setEmail(a.email);
                    setSenha('123456');
                    setErros({});
                    setErroGeral('');
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 24, paddingTop: 64, gap: 12 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: cores.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marca: { fontFamily: fontes.titulo, fontSize: 44, color: cores.claro },
  lema: { fontFamily: fontes.texto, fontSize: 15, color: cores.textoSobreEscuro, marginBottom: 12 },
  formulario: { backgroundColor: cores.claro, borderRadius: 16, padding: 16, gap: 12 },
  link: {
    fontFamily: fontes.textoMedio,
    color: cores.verdeEscuro,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 14,
  },
  sucesso: { color: cores.verdeEscuro, fontFamily: fontes.textoMedio, fontSize: 13 },
  atalhos: { gap: 8, marginTop: 8 },
  atalhosTitulo: { color: cores.textoSobreEscuro, fontFamily: fontes.textoMedio, fontSize: 12 },
  atalhosLinha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
