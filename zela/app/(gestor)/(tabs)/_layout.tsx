import { AreaTabs } from '../../../src/components/AreaTabs';

export default function Layout() {
  return (
    <AreaTabs
      abas={[
        { nome: 'painel', titulo: 'Painel', icone: 'stats-chart-outline' },
        { nome: 'excecoes', titulo: 'Exceções', icone: 'warning-outline' },
        { nome: 'ordens', titulo: 'Ordens', icone: 'clipboard-outline' },
        { nome: 'executores', titulo: 'Executores', icone: 'construct-outline' },
      ]}
    />
  );
}
