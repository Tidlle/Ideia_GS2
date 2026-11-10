# Zela — app mobile

Expo + React Native + TypeScript, com Expo Router. Consome a **Zela API** (Java · Spring Boot, repositório `GS2-Java`): login com JWT, ocorrências, ordens de serviço, IA (Gemini), notificações e indicadores vêm da API. Nada é guardado só no aparelho.

## Rodar

1. Suba a API (veja o README do `GS2-Java`). Ela responde em `http://localhost:8080`.
2. Configure a URL da API no app: copie `.env.example` para `.env` e ajuste `EXPO_PUBLIC_API_URL`.
   - Web: `http://localhost:8080` (padrão).
   - Emulador Android: `http://10.0.2.2:8080` (padrão no Android).
   - Celular com Expo Go: o IP do computador na mesma rede, ex.: `http://192.168.0.10:8080`.
   - API na nuvem: a URL pública do deploy.
3. Rode o app:

```bash
cd zela
npm install --legacy-peer-deps
npm start            # gera src/versao.ts (hash do commit) e abre o Expo
npm run web          # alternativa no navegador
npm run lint && npm run typecheck && npm run format
```

Depois de mudar o `.env`, reinicie o Expo (a URL entra no bundle na inicialização).

## Usuários de teste (senha `123456`)

| Papel      | E-mail              |
| ---------- | ------------------- |
| Cidadão    | cidadao@zela.com    |
| Gestor     | gestor@zela.com     |
| Executor   | executor@zela.com   |
| Supervisor | supervisor@zela.com |

A tela de login tem atalhos "Entrar como …" que preenchem os campos. O login é real (`POST /auth/login`) e o cadastro cria um cidadão na API.

## Telas (19 + Sobre)

- **Comuns**: login, cadastro, perfil (com Sair), notificações, sobre (versão e hash do commit).
- **Cidadão**: início, nova ocorrência (foto, GPS/endereço, triagem por IA na API, urgência 199/193), detalhe com timeline e confirmar/contestar solução, minhas ocorrências (filtros), confirmar problemas.
- **Gestor**: painel, exceções (emitir OS, encaminhar com protocolo, descartar), ordens (filtros e CRUD), detalhe da OS (antes/depois, confiança da IA, aprovar/reprovar, editar prazo, cancelar), executores.
- **Executor**: minhas OS, detalhe (aceitar/recusar com motivo), check-in por GPS com raio de 100 m, concluir com foto só da câmera e comparação antes/depois pela IA da API.
- **Supervisor**: escalonamentos (cobrar, reatribuir) e indicadores.

## Estrutura

- `app/`: rotas. Cada papel tem `(papel)/_layout.tsx` (protege a rota pelo papel e empilha os detalhes) e `(papel)/(tabs)/` com as abas. Os detalhes ficam fora das abas porque, no Expo Router SDK 58, uma aba oculta não é navegável.
- `src/services/api.ts`: cliente HTTP (fetch) com o JWT no cabeçalho, URL configurável, upload de fotos e erros da API (ProblemDetail) convertidos em mensagens.
- `src/services/`: uma função por operação da API (`ocorrencias.ts`, `ordens.ts`, `usuarios.ts`); `mapeadores.ts` converte as respostas para os tipos do app.
- `src/services/store.ts`: cache local do que a API devolveu (nomes de categorias, executores e ocorrências usados pelos cards).
- `src/services/feedback.ts`: mensagens de erro das ações (Alert no celular, alerta do navegador na web).
- `src/context/`: `AuthContext` (token e usuário no AsyncStorage; 401 faz logout) e `DadosContext` (avisa as telas para recarregar depois de uma ação).

## Pendências do grupo

- Preencher integrantes na tela `app/sobre.tsx` e no README da raiz.
- Fotos de exemplo antes/depois: hoje há um quadro "(exemplo)". Coloque fotos do próprio grupo em `assets/images/`.
- Rodar em um celular (Expo Go) apontando para a API e gravar o vídeo seguindo o roteiro da seção 8.10 da especificação. A integração com a API foi testada na versão web.
- Integração com a API é uma primeira versão; ainda vamos revisitar (veja `GS2-Java/docs/plano-java.md`, Fase 10).
- Fazer commits pequenos por tela, como a disciplina de Mobile avalia.
