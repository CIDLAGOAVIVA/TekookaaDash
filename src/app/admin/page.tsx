import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Este é o seu painel administrativo. A partir daqui, você pode gerenciar as configurações do sistema, usuários e outras tarefas administrativas.</p>
          <p className="mt-4">Use a navegação à esquerda para começar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
