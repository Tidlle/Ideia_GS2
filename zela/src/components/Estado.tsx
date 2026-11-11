import { ReactNode } from 'react';

import { Carregando } from './Carregando';
import { ErroCarga } from './ErroCarga';
import { AcaoVazio, Vazio } from './Vazio';

interface Props<T> {
  dados: T[] | undefined;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
  textoVazio: string;
  /** Próximo passo sugerido quando a lista está vazia. */
  acaoVazio?: AcaoVazio;
  children: (dados: T[]) => ReactNode;
}

/** Trata os três estados de toda lista: carregando, erro e vazio. */
export function Estado<T>({
  dados,
  carregando,
  erro,
  recarregar,
  textoVazio,
  acaoVazio,
  children,
}: Props<T>) {
  if (carregando && !dados) return <Carregando />;
  if (erro) return <ErroCarga mensagem={erro} onTentar={recarregar} />;
  if (!dados || dados.length === 0) return <Vazio texto={textoVazio} acao={acaoVazio} />;
  return <>{children(dados)}</>;
}
