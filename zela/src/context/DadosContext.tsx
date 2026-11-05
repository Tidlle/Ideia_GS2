import { ReactNode, useSyncExternalStore } from 'react';

import { assinar, obterVersao } from '../services/store';

/**
 * Os mocks vivem em memória (services/store.ts). Este hook expõe a "versão" dos dados:
 * qualquer tela que dependa dela recarrega quando outro papel altera uma OS.
 */
export const useVersaoDados = () => useSyncExternalStore(assinar, obterVersao, obterVersao);

export function DadosProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
