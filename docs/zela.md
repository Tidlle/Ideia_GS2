# Zela — Zeladoria colaborativa com IA

> Global Solution 2026/2 · CitizenTech · FIAP · 2º ano ADS
> Grupo: [Nome do grupo] · Integrantes: [RM — Nome completo — Turma]

---

## 1. Visão geral

### O problema
Buracos, postes apagados, entulho e calçadas quebradas ficam meses sem solução. Hoje:

- **O cidadão** não sabe a quem recorrer, enfrenta canais espalhados e não recebe retorno.
- **A mesma ocorrência** é aberta várias vezes, lotando a fila e escondendo o que é urgente.
- **A prefeitura** não sabe o que priorizar e não consegue fiscalizar quem executa o serviço (equipes próprias, empresas terceirizadas, concessionárias).

> [Inserir dado real para o pitch: volume de solicitações de zeladoria no SP156 ou no portal de dados abertos da prefeitura.]

### A solução
O **Zela** transforma uma foto tirada pelo cidadão em uma **Ordem de Serviço (OS) rastreável de ponta a ponta**:

1. O cidadão reporta com foto e localização.
2. A IA classifica, descreve e indica o responsável.
3. Os vizinhos confirmam se o problema ainda existe.
4. A OS é emitida para o executor responsável pela categoria.
5. O executor aceita, faz check-in no local e conclui com a foto do depois.
6. A IA compara antes e depois, e o cidadão confirma ou contesta.
7. Tudo vira histórico, indicadores de desempenho e base para fiscalizar contratos.

### ODS atendidos
| ODS | Como contribui |
|---|---|
| **11** Cidades e comunidades sustentáveis | Manutenção urbana mais rápida e organizada |
| **10** Redução das desigualdades | Confirmação que não bloqueia: bairros com menos usuários não ficam para trás; painel por bairro dá transparência |
| **9** Indústria, inovação e infraestrutura | Infraestrutura urbana mantida com dados e evidências |

---

## 2. Papéis

| Papel | Quem é | O que faz |
|---|---|---|
| **Cidadão** | Morador | Reporta, confirma problemas dos vizinhos, acompanha e avalia a solução |
| **Gestor** | Subprefeitura ou secretaria | Trata exceções, emite e acompanha OS, aprova ou reprova a execução, encaminha a outros órgãos |
| **Executor** | Equipe própria ou empresa contratada | Aceita ou recusa a OS, faz check-in no local e conclui com evidência |
| **Supervisor** | Coordenação da secretaria | Recebe escalonamentos e acompanha indicadores por executor e contrato |

Cada **categoria** de problema (iluminação, buraco, entulho, calçada, árvore…) é ligada a um **executor responsável** com um **prazo contratual** (ex.: iluminação → Empresa X, 48h).

---

## 3. Fluxo completo

### 3.1 Da foto à ordem de serviço
1. **Reporte**: o cidadão envia foto e localização (fila offline se a conexão cair).
2. **Triagem por IA**: categoria, descrição padronizada e responsável indicado.
3. **Vizinhos confirmam**: quem está perto recebe "Esse problema ainda está aqui?".
   - Confirmações **aceleram** a prioridade e aumentam a reputação de quem reportou.
   - Negações derrubam reports falsos ou já resolvidos.
   - **Sem resposta em 24h, segue normalmente**: a confirmação nunca bloqueia.
4. **OS emitida**:
   - Categorias de rotina e baixo risco: **emissão automática** para o executor do contrato.
   - Casos fora da regra: vão para a **fila de exceções** do gestor.

### 3.2 Caminho de urgência
Fio caído, árvore na via, risco à vida: a ocorrência marcada como **urgente** (pela IA ou pelo cidadão) **pula a confirmação**, vai direto ao **plantão** com prazo de horas, e o app orienta o cidadão a ligar **199 (Defesa Civil)** ou **193 (Bombeiros)**.

### 3.3 O ciclo da ordem de serviço
| # | Etapa | O que acontece | Controle |
|---|---|---|---|
| 1 | **Emitida** | Vai ao executor responsável pela categoria | Prazo para aceitar |
| 2 | **Aceita ou recusada** | Recusa exige justificativa; fora da competência, é **encaminhada a outro órgão** com protocolo | Justificativa obrigatória |
| 3 | **Em execução** | Check-in com GPS confere a presença no local | Distância máxima da ocorrência |
| 4 | **Concluída** | Foto do depois, tirada no local, é obrigatória | GPS e horário da foto |
| 5 | **Validada** | IA compara antes e depois; gestor e cidadão podem aprovar ou contestar | **Aceite tácito**: IA confiante e sem contestação em 48h |
| 6 | **Encerrada** | Entra nos indicadores do executor | — |

- **Prazo em cada etapa**: se estourar, a OS é **escalada ao supervisor** e o cidadão é avisado.
- **Reprovação ou contestação**: a OS volta ao executor e conta como **retrabalho**.

### 3.4 Regras do fluxo (resumo para a banca)
| Situação | Como o Zela resolve |
|---|---|
| Emergência | Pula a confirmação e vai ao plantão com prazo de horas |
| Bairro com poucos usuários | Confirmação acelera, mas nunca bloqueia; sem resposta, segue em 24h |
| Volume alto de pedidos | OS automática na rotina; o gestor só trata as exceções |
| Validação parada | IA confiante e sem contestação em 48h: aceite tácito |
| Fora da competência | Encaminhada a outro órgão com protocolo, e o cidadão é avisado |

### 3.5 Estados
**Ocorrência**: `REPORTADA → EM_TRIAGEM → AGUARDANDO_CONFIRMACAO → CONFIRMADA → EM_ATENDIMENTO (tem OS) → RESOLVIDA` · desvios: `URGENTE`, `DESCARTADA` (negada pelos vizinhos), `ENCAMINHADA` (outro órgão).

**Ordem de serviço**: `EMITIDA → ACEITA → EM_EXECUCAO → CONCLUIDA → VALIDADA → ENCERRADA` · desvios: `RECUSADA` (volta ao gestor), `ENCAMINHADA`, `REABERTA` (retrabalho), `ESCALADA` (prazo estourado).

---

## 4. Controle da gestão
O gestor deixa de "apenas designar" e passa a **fiscalizar a execução**:

- **Painel de OS**: por status, atrasadas, por executor e por bairro.
- **Desempenho do executor**: tempo médio, prazos cumpridos, retrabalho e avaliação dos cidadãos.
- **Fiscalização de contratos**: o histórico comprova se a terceirizada cumpriu o prazo contratual (base para cobranças e multas). É o principal argumento de venda para a prefeitura.
- **Auditoria completa**: quem mudou o quê e quando, em cada OS.

---

## 5. Modelo de dados (entidades principais)

| Entidade | Campos principais |
|---|---|
| **Usuario** | id, nome, email, senha (hash), papel (CIDADAO, GESTOR, EXECUTOR, SUPERVISOR), bairro, reputacao |
| **Categoria** | id, nome, executorResponsavelId, prazoHoras, emissaoAutomatica (bool), riscoBase |
| **Executor** | id, nome, tipo (EQUIPE_PROPRIA, EMPRESA, CONCESSIONARIA), regiao, contrato |
| **Ocorrencia** | id, autorId, categoriaId, fotoAntesUrl, latitude, longitude, descricaoIA, urgente, status, prioridade, criadaEm |
| **Confirmacao** | id, ocorrenciaId, usuarioId, aindaExiste (bool), criadaEm |
| **OrdemServico** | id, ocorrenciaId, executorId, status, prazoEtapa, checkinLat, checkinLng, fotoDepoisUrl, confiancaIA, protocoloExterno, criadaEm |
| **EventoOS** (timeline/auditoria) | id, osId, statusAnterior, statusNovo, usuarioId, justificativa, data |
| **Avaliacao** | id, osId, cidadaoId, aprovada (bool), comentario |

---

## 6. Arquitetura e disciplinas

```
App Mobile (React Native / Expo)
   ├──► API principal (Java · Spring Boot · JWT · Spring AI)
   │        ├──► IA (LLM + Visão Computacional)
   │        ├──► Oracle (PL/SQL, auditoria)  ·  MongoDB (relatórios)
   │        └──► RabbitMQ (eventos da OS → notificações e alertas)
   └──► Serviço de prazos (.NET Minimal API · escalonamento e aceite tácito)

Azure (provisionada via CLI) · Azure DevOps: Boards, Repos e Pipelines CI/CD
```

| Disciplina | O que o Zela entrega |
|---|---|
| **Java Advanced** | API principal, 4 papéis com JWT, ciclo da OS, Spring AI e RabbitMQ (opção A do requisito 5) |
| **.NET** | Prazos, escalonamento e aceite tácito, com idempotência, rate limiting, health checks e testes xUnit |
| **Mobile** | Telas do cidadão, do gestor e do executor, com CRUD via API, login e rotas protegidas; publicação no Firebase App Distribution |
| **IA** | IA generativa (descrição e encaminhamento) + Visão Computacional (classificação e comparação antes/depois), com testes e limitações |
| **Banco de Dados** | Oracle: funções (prioridade, indicadores), procedures (escalonamento, mudança de status), triggers de auditoria, 2 pacotes; MongoDB: OS como documento com timeline embutida e 3 relatórios |
| **DevOps** | Deploy da API Java na Azure com pipelines automáticos de CI/CD |
| **QA** | Backlog (Epics, Features, PBIs) e casos de teste da OS, da urgência e do aceite tácito no Azure DevOps |

---

## 7. Escopo

| Núcleo (MVP) | Bônus |
|---|---|
| Reporte com foto e triagem por IA | Sugestão automática de executor por carga |
| Caminho de urgência | Painel de desempenho completo |
| Confirmação que acelera sem bloquear | Encaminhamento com protocolo externo |
| Ciclo da OS com check-in e evidência | Painel público por bairro |
| Prazos, escalonamento e aceite tácito | Fila offline e descrição por voz |

**Prazos da GS**: cadastro do grupo até **13/11** · entrega no Portal FIAP até **19/11, 23h55** · apresentações de **23 a 27/11**.

---

## 8. Passo a passo: MVP visual com login fictício

### 8.1 Objetivo
Construir **todas as telas navegáveis** do app, com **dados fictícios (mock)** e **login fictício por papel**, para:
- validar o fluxo com o grupo e com os professores;
- gravar a demonstração do pitch cedo;
- servir de base para a entrega de Mobile (depois troca-se o mock pela API Java).

Nada aqui depende do backend. Toda "IA", GPS e notificação é simulada.

### 8.2 Stack
- **Expo + React Native + TypeScript**
- **Expo Router** (navegação por arquivos, exigida no requisito 1 de Mobile)
- **expo-image-picker** (câmera/galeria), **expo-location** (GPS)
- **@react-native-async-storage/async-storage** (manter a sessão fictícia)
- **expo-font** + Google Fonts (Space Grotesk e Public Sans, as mesmas do deck)
- **ESLint + Prettier** (avaliado no requisito 5 de Mobile)

### 8.3 Criar o projeto
```bash
npx create-expo-app@latest zela
cd zela
npx expo install expo-image-picker expo-location @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/space-grotesk @expo-google-fonts/public-sans
npx expo lint          # configura o ESLint
npm i -D prettier eslint-config-prettier
npx expo start         # abre no Expo Go ou no emulador
```
Remova as telas de exemplo do template (`app/(tabs)` etc.) antes de começar.

> Mobile avalia o histórico do Git (−50 pts se for confuso). Faça **commits pequenos e frequentes**, um por tela ou funcionalidade, com mensagens claras (ex.: `feat: tela de nova ocorrência`).

### 8.4 Estrutura de pastas
```
zela/
├── app/                         # rotas (Expo Router)
│   ├── _layout.tsx              # providers + proteção de rotas
│   ├── index.tsx                # redireciona conforme a sessão
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── cadastro.tsx
│   ├── (cidadao)/
│   │   ├── _layout.tsx          # tabs do cidadão
│   │   ├── inicio.tsx
│   │   ├── nova-ocorrencia.tsx
│   │   ├── minhas.tsx
│   │   ├── confirmar.tsx
│   │   └── ocorrencia/[id].tsx
│   ├── (gestor)/
│   │   ├── _layout.tsx
│   │   ├── painel.tsx
│   │   ├── excecoes.tsx
│   │   ├── ordens.tsx
│   │   ├── ordem/[id].tsx
│   │   └── executores.tsx
│   ├── (executor)/
│   │   ├── _layout.tsx
│   │   ├── minhas-os.tsx
│   │   ├── os/[id].tsx
│   │   ├── checkin/[id].tsx
│   │   └── concluir/[id].tsx
│   ├── (supervisor)/
│   │   ├── _layout.tsx
│   │   ├── escalonamentos.tsx
│   │   └── indicadores.tsx
│   ├── perfil.tsx
│   ├── notificacoes.tsx
│   └── sobre.tsx
├── src/
│   ├── components/              # Botao, Card, StatusBadge, Timeline, Campo, Vazio, Carregando
│   ├── context/AuthContext.tsx  # login fictício
│   ├── mocks/                   # usuarios.ts, categorias.ts, ocorrencias.ts, ordens.ts
│   ├── services/                # funções que hoje leem o mock e depois chamarão a API
│   ├── theme/                   # cores.ts, tipografia.ts, espacos.ts
│   └── types/                   # tipos de Usuario, Ocorrencia, OrdemServico…
└── assets/
    ├── fonts/
    └── images/                  # logo, ícone, fotos de exemplo (antes/depois)
```
A separação `services/` → `mocks/` é o que permite trocar o mock pela API Java depois **sem mexer nas telas**.

### 8.5 Identidade visual (igual ao deck)
```ts
// src/theme/cores.ts
export const cores = {
  escuro: '#10201A',      // fundo escuro, cabeçalhos
  claro: '#F4F1E8',       // fundo principal
  cartao: '#FBFAF5',      // cartões
  texto: '#14261E',
  textoSuave: '#3D4A44',
  borda: '#DDD8CA',
  verde: '#2FBF71',       // ação principal, sucesso
  verdeEscuro: '#17703F', // texto verde sobre fundo claro
  laranja: '#E07B2A',     // alerta, prazo
  laranjaEscuro: '#B5561A',
  urgente: '#C23B22',     // somente para o caminho de urgência
};
```
Títulos em **Space Grotesk**, texto em **Public Sans**. Não dependa só da cor para indicar status: o `StatusBadge` sempre mostra o texto ("Atrasada", "Em execução").

### 8.6 Dados fictícios
```ts
// src/types/index.ts
export type Papel = 'CIDADAO' | 'GESTOR' | 'EXECUTOR' | 'SUPERVISOR';
export type StatusOS = 'EMITIDA' | 'ACEITA' | 'RECUSADA' | 'EM_EXECUCAO' | 'CONCLUIDA'
  | 'VALIDADA' | 'ENCERRADA' | 'REABERTA' | 'ESCALADA' | 'ENCAMINHADA';

// src/mocks/usuarios.ts
export const usuarios = [
  { id: 1, nome: 'Ana Souza',        email: 'cidadao@zela.com',    senha: '123456', papel: 'CIDADAO',    bairro: 'Vila Mariana', reputacao: 82 },
  { id: 2, nome: 'Carlos Lima',      email: 'gestor@zela.com',     senha: '123456', papel: 'GESTOR',     bairro: 'Subprefeitura Vila Mariana' },
  { id: 3, nome: 'Equipe Luz Norte', email: 'executor@zela.com',   senha: '123456', papel: 'EXECUTOR',   tipo: 'EMPRESA' },
  { id: 4, nome: 'Marina Costa',     email: 'supervisor@zela.com', senha: '123456', papel: 'SUPERVISOR' },
] as const;
```
Crie também:
- **categorias.ts**: 5 categorias (Iluminação 48h, Buraco 72h, Entulho 48h, Calçada 120h, Árvore 24h), cada uma com executor e `emissaoAutomatica`.
- **ocorrencias.ts**: ~10 ocorrências em estados variados, incluindo 1 urgente, 1 descartada e 1 encaminhada.
- **ordens.ts**: ~8 OS cobrindo todos os status, cada uma com a `timeline` de eventos (data, status, quem, justificativa).
- Fotos de exemplo de **antes e depois** em `assets/images/` (tiradas pelo próprio grupo, para não usar imagens de terceiros).

### 8.7 Login fictício e proteção de rotas
```tsx
// src/context/AuthContext.tsx (resumo)
const AuthContext = createContext<AuthState>(null!);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { // restaura a sessão salva
    AsyncStorage.getItem('sessao').then(v => v && setUsuario(JSON.parse(v))).finally(() => setCarregando(false));
  }, []);

  async function entrar(email: string, senha: string) {
    await new Promise(r => setTimeout(r, 800));            // simula a chamada à API
    const u = usuarios.find(x => x.email === email && x.senha === senha);
    if (!u) throw new Error('E-mail ou senha inválidos');
    await AsyncStorage.setItem('sessao', JSON.stringify(u));
    setUsuario(u);
  }

  async function sair() {
    await AsyncStorage.removeItem('sessao');
    setUsuario(null);
  }
  return <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>{children}</AuthContext.Provider>;
}
```
```tsx
// app/index.tsx — manda cada papel para a sua área
const destino = { CIDADAO: '/(cidadao)/inicio', GESTOR: '/(gestor)/painel',
                  EXECUTOR: '/(executor)/minhas-os', SUPERVISOR: '/(supervisor)/escalonamentos' };
export default function Index() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <Carregando />;
  return <Redirect href={usuario ? destino[usuario.papel] : '/(auth)/login'} />;
}
```
Em cada `_layout.tsx` de papel, verifique o papel e redirecione para `/` se não bater. Assim, **logout limpa a sessão e bloqueia as rotas protegidas**, como pede o requisito 3 de Mobile.

Na tela de login, mostre **atalhos "Entrar como Cidadão / Gestor / Executor / Supervisor"** que preenchem e-mail e senha de teste: agiliza a demo e o vídeo.

### 8.8 Todas as telas

#### Comuns
| Tela | Rota | Conteúdo |
|---|---|---|
| **Login** | `(auth)/login` | Logo, e-mail, senha, validação de campos, loader, mensagem de erro, atalhos por papel, link para cadastro |
| **Cadastro** | `(auth)/cadastro` | Nome, e-mail, senha, confirmação, bairro; validação; ao concluir, volta ao login com aviso de sucesso (no mock, adiciona à lista em memória) |
| **Perfil** | `perfil` | Dados do usuário, papel, reputação (cidadão), botão **Sair** |
| **Notificações** | `notificacoes` | Lista de avisos fictícios: "Sua ocorrência virou OS", "Prazo estourado", "Confirme o problema perto de você" |
| **Sobre o App** | `sobre` | Nome, versão, integrantes e **hash do commit** (exigido no requisito 7; não conta como tela do requisito 1) |

#### Cidadão
| Tela | Rota | Conteúdo |
|---|---|---|
| **Início** | `(cidadao)/inicio` | Ocorrências do bairro em lista (mapa opcional), com status, categoria e distância; botão grande **"Reportar problema"** |
| **Nova ocorrência** | `(cidadao)/nova-ocorrencia` | 1) Foto (câmera ou galeria) 2) Localização (GPS ou endereço) 3) "IA analisando…" por ~1,5s e então categoria + descrição sugeridas, editáveis 4) Chave **"É urgente?"**; se ativa, mostra o aviso com 199/193 5) Enviar com loader e feedback |
| **Detalhe da ocorrência** | `(cidadao)/ocorrencia/[id]` | Foto antes (e depois, se houver), descrição, status, **timeline** de eventos, prazo; se concluída: **Confirmar solução / Contestar** |
| **Minhas ocorrências** | `(cidadao)/minhas` | Filtros por status; cards com prazo e situação |
| **Confirmar problemas** | `(cidadao)/confirmar` | Ocorrências próximas aguardando confirmação: foto + **"Ainda está aqui?" Sim / Não** |

#### Gestor
| Tela | Rota | Conteúdo |
|---|---|---|
| **Painel** | `(gestor)/painel` | Indicadores: OS abertas, atrasadas, prazos cumpridos (%), retrabalho (%); atalhos para exceções e atrasadas |
| **Exceções** | `(gestor)/excecoes` | Ocorrências que não tiveram emissão automática: **Emitir OS** (escolher executor sugerido), **Encaminhar a outro órgão** (com nº de protocolo) ou **Descartar** com justificativa |
| **Ordens de serviço** | `(gestor)/ordens` | Lista com filtros (status, executor, bairro, atrasadas) e **CRUD** (editar prazo, cancelar) |
| **Detalhe da OS** | `(gestor)/ordem/[id]` | Antes/depois lado a lado, confiança da IA, local do check-in, timeline completa; **Aprovar / Reprovar** (reprovar exige motivo e gera retrabalho) |
| **Executores** | `(gestor)/executores` | Executores e contratos com tempo médio, prazos cumpridos, retrabalho e avaliação |

#### Executor
| Tela | Rota | Conteúdo |
|---|---|---|
| **Minhas OS** | `(executor)/minhas-os` | OS novas, em andamento e concluídas, com prazo da etapa em destaque |
| **Detalhe da OS** | `(executor)/os/[id]` | Foto, local, descrição; **Aceitar** ou **Recusar** (motivo obrigatório: "fora da competência", "falta material"…) |
| **Check-in** | `(executor)/checkin/[id]` | Lê o GPS e compara com o local da ocorrência; dentro do raio libera "Iniciar execução", fora mostra a distância e bloqueia |
| **Concluir** | `(executor)/concluir/[id]` | Foto do depois (só câmera), observação, enviar; simula "IA comparando…" e mostra o resultado |

#### Supervisor
| Tela | Rota | Conteúdo |
|---|---|---|
| **Escalonamentos** | `(supervisor)/escalonamentos` | OS com prazo estourado: etapa, atraso, executor; ações **Cobrar executor** e **Reatribuir** |
| **Indicadores** | `(supervisor)/indicadores` | Comparativo entre executores e contratos e ranking de bairros por tempo de resolução |

**Total**: 19 telas além da "Sobre" (o mínimo exigido em Mobile são 6).

### 8.9 Ordem sugerida de construção
1. **Base**: tema, fontes, componentes (`Botao`, `Card`, `StatusBadge`, `Timeline`, `Campo`, `Carregando`, `Vazio`).
2. **Mocks e services**: tipos, dados e funções como `listarOcorrencias()` e `atualizarStatusOS()`, todas `async` com um pequeno atraso, como se fossem a API.
3. **Login fictício**: AuthContext, login, cadastro, redirecionamento por papel, logout e rotas protegidas.
4. **Fluxo do cidadão**: início, nova ocorrência (com IA simulada e urgência), detalhe com timeline, minhas, confirmar.
5. **Fluxo do executor**: minhas OS, aceitar/recusar, check-in, concluir.
6. **Fluxo do gestor**: painel, exceções, ordens, detalhe com aprovar/reprovar, executores.
7. **Supervisor**: escalonamentos e indicadores.
8. **Comuns**: perfil, notificações e "Sobre" com hash do commit.
9. **Acabamento**: estados de carregando, vazio e erro em todas as listas; acessibilidade (rótulos, áreas de toque ≥ 44px, contraste); revisão do lint e do Prettier.

> Para a OS "andar" entre papéis no MVP, mantenha os mocks num **contexto em memória** (ex.: `DadosContext`): quando o executor conclui, o gestor vê a OS como concluída ao trocar de usuário.

### 8.10 Roteiro de demonstração (usar no vídeo)
1. **Cidadão** reporta um poste apagado: foto → IA sugere "Iluminação" → enviar.
2. Mostrar uma ocorrência **urgente** (árvore na via) com o aviso de 199/193.
3. **Executor** aceita a OS, faz check-in e conclui com a foto do depois.
4. **Gestor** abre a OS, vê antes/depois e a confiança da IA, e aprova.
5. **Cidadão** vê a timeline completa e confirma a solução.
6. **Supervisor** mostra uma OS escalada por prazo estourado.

### 8.11 Do MVP visual para a entrega final
- Trocar o corpo das funções em `src/services/` por chamadas **Axios** à API Java (JWT no cabeçalho), mantendo as telas iguais.
- Trocar o login fictício pelo login real da API.
- Substituir a "IA simulada" pelo endpoint de triagem e de comparação (Spring AI + visão computacional).
- Publicar no **Firebase App Distribution** com o e-mail do professor como tester, e garantir que a versão publicada corresponda ao commit exibido na tela "Sobre".

---

## 9. Declaração de uso de IA
Ferramentas de IA generativa foram usadas como apoio para ideação, organização da proposta e estrutura deste documento. Todo o conteúdo foi revisado e adaptado pelo grupo. [Ajustar conforme a regra de cada disciplina e listar as ferramentas usadas no README.]
