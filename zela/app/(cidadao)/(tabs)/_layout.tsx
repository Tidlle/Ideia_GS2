import { AreaTabs } from '../../../src/components/AreaTabs';

export default function Layout() {
  return (
    <AreaTabs
      abas={[
        { nome: 'inicio', titulo: 'Início', icone: 'home-outline' },
        { nome: 'minhas', titulo: 'Minhas', icone: 'list-outline' },
        { nome: 'nova-ocorrencia', titulo: 'Reportar', icone: 'camera-outline' },
        { nome: 'confirmar', titulo: 'Confirmar', icone: 'checkmark-circle-outline' },
      ]}
    />
  );
}
