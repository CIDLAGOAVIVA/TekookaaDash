'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'Suas alterações foram salvas com sucesso.',
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Sistema</CardTitle>
          <CardDescription>Gerenciar configurações gerais do sistema e recursos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
              <span>Modo de Manutenção</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Desative temporariamente o acesso ao painel principal para os usuários.
              </span>
            </Label>
            <Switch id="maintenance-mode" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">Chave de API</Label>
            <Input id="api-key" type="password" defaultValue="****************" />
            <p className="text-sm text-muted-foreground">Insira sua chave de API principal para integrações de serviços externos.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email do Administrador</Label>
            <Input id="admin-email" type="email" defaultValue="admin@agrodash.com" />
            <p className="text-sm text-muted-foreground">O endereço de e-mail para receber notificações do sistema.</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
