import { AreaTabs } from '../../../src/components/AreaTabs';

export default function Layout() {
  return (
    <AreaTabs
      abas={[
        { nome: 'escalonamentos', titulo: 'Escalonamentos', icone: 'alarm-outline' },
        { nome: 'indicadores', titulo: 'Indicadores', icone: 'stats-chart-outline' },
      ]}
    />
  );
}
