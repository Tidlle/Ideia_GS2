// Gera src/versao.ts com o hash do commit atual (exibido na tela "Sobre").
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let hash = 'desconhecido';
try {
  hash = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {}

const pkg = require('../package.json');
const saida = `// Arquivo gerado por scripts/gerar-versao.js — não editar à mão.
export const VERSAO = '${pkg.version}';
export const COMMIT = '${hash}';
`;
fs.writeFileSync(path.join(__dirname, '..', 'src', 'versao.ts'), saida);
