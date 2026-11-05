const HORA = 3600 * 1000;
/** Data relativa a agora: horas positivas = futuro, negativas = passado. */
export const emHoras = (h: number) => new Date(Date.now() + h * HORA).toISOString();
