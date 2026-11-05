import { AreaStack } from '../../src/components/AreaStack';

export default function Layout() {
  return (
    <AreaStack
      papel="EXECUTOR"
      detalhes={{
        'os/[id]': 'Ordem de serviço',
        'checkin/[id]': 'Check-in',
        'concluir/[id]': 'Concluir OS',
      }}
    />
  );
}
