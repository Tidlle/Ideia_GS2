# Zela — MVP visual (app mobile)

Expo + React Native + TypeScript, com Expo Router. Dados fictícios em memória; IA, GPS e notificações são simulados. Nada depende de backend.

## Rodar

```bash
cd zela
npm install --legacy-peer-deps
npm start            # gera src/versao.ts (hash do commit) e abre o Expo
npm run web          # alternativa no navegador
npm run lint && npm run typecheck && npm run format
```

## Login fictício (senha `123456`)

| Papel      | E-mail              |
| ---------- | ------------------- |
| Cidadão    | cidadao@zela.com    |
| Gestor     | gestor@zela.com     |
| Executor   | executor@zela.com   |
| Supervisor | supervisor@zela.com |

A tela de login tem atalhos "Entrar como …" que preenchem os campos.

## Telas (19 + Sobre)

- **Comuns**: login, cadastro, perfil (com Sair), notificações, sobre (versão e hash do commit).
- **Cidadão**: início, nova ocorrência (foto, GPS/endereço, IA simulada, urgência 199/193), detalhe com timeline e confirmar/contestar solução, minhas ocorrências (filtros), confirmar problemas.
- **Gestor**: painel, exceções (emitir OS, encaminhar com protocolo, descartar), ordens (filtros e CRUD), detalhe da OS (antes/depois, confiança da IA, aprovar/reprovar, editar prazo, cancelar), executores.
- **Executor**: minhas OS, detalhe (aceitar/recusar com motivo), check-in por GPS com raio de 100 m, concluir com foto só da câmera e "IA comparando…".
- **Supervisor**: escalonamentos (cobrar, reatribuir) e indicadores.

## Estrutura

- `app/`: rotas. Cada papel tem `(papel)/_layout.tsx` (protege a rota pelo papel e empilha os detalhes) e `(papel)/(tabs)/` com as abas. Os detalhes ficam fora das abas porque, no Expo Router SDK 58, uma aba oculta não é navegável.
- `src/services/`: funções `async` que hoje leem/gravam `store.ts` (memória) e depois chamarão a API Java com Axios, sem mexer nas telas.
- `src/mocks/`: usuários, categorias, executores, ocorrências, OS com timeline e notificações.
- `src/context/`: `AuthContext` (sessão no AsyncStorage) e `DadosContext` (versão dos dados em memória; quando o executor conclui, o gestor vê a OS concluída ao trocar de usuário).

## Pendências do grupo

- Preencher integrantes na tela `app/sobre.tsx` e no README da raiz.
- Fotos de exemplo antes/depois: hoje há um quadro "(exemplo)". Coloque fotos do próprio grupo em `assets/images/`.
- Rodar em um celular (Expo Go) e gravar o vídeo seguindo o roteiro da seção 8.10 da especificação. Testei apenas a versão web no navegador.
- Fazer commits pequenos por tela, como a disciplina de Mobile avalia.
