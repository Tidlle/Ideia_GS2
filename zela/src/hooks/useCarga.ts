import { useCallback, useEffect, useRef, useState } from 'react';

import { useVersaoDados } from '../context/DadosContext';

/** Executa uma função de service e controla carregando/erro; recarrega quando os dados mudam. */
export function useCarga<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const versao = useVersaoDados();
  const [dados, setDados] = useState<T | undefined>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let ativo = true;
    fnRef
      .current()
      .then((d) => {
        if (!ativo) return;
        setDados(d);
        setErro(null);
      })
      .catch((e) => {
        if (ativo) setErro(e instanceof Error ? e.message : 'Não foi possível carregar.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versao, tentativa, ...deps]);

  const recarregar = useCallback(() => {
    setErro(null);
    setCarregando(true);
    setTentativa((t) => t + 1);
  }, []);

  return { dados, carregando, erro, recarregar };
}
