import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../theme/cores';
import { espacos, raio } from '../theme/espacos';
import { textos } from '../theme/textos';
import { EstadoPrazo } from '../utils';

const COR: Record<EstadoPrazo, string> = {
  ok: cores.andamento,
  perto: cores.atencaoForte,
  atrasado: cores.perigo,
};

/** Régua do prazo da etapa: a parte preenchida é quanto do prazo do contrato já passou. */
export function ReguaPrazo({
  texto,
  fracao,
  estado,
  compacta,
}: {
  texto: string;
  fracao: number;
  estado: EstadoPrazo;
  compacta?: boolean;
}) {
  const pct = Math.round(fracao * 100);
  return (
    <View
      style={styles.caixa}
      accessible
      accessibilityLabel={`${texto}. ${pct}% do prazo da etapa já passou.`}
    >
      <View style={[styles.trilho, compacta && styles.trilhoCompacto]}>
        <View style={[styles.cheio, { width: `${pct}%`, backgroundColor: COR[estado] }]} />
      </View>
      <Text
        style={[
          textos.prazo,
          estado === 'perto' && textos.prazoPerto,
          estado === 'atrasado' && textos.atrasado,
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { gap: espacos.xs },
  trilho: {
    height: 6,
    borderRadius: raio.pilula,
    backgroundColor: cores.borda,
    overflow: 'hidden',
  },
  trilhoCompacto: { height: 4 },
  cheio: { height: '100%', borderRadius: raio.pilula },
});
