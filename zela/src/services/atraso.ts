/** Simula a latência de uma chamada de API. */
export const atraso = (ms = 450) => new Promise<void>((r) => setTimeout(r, ms));
