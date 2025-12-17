'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useDashboardSettings } from '@/hooks/use-dashboard-settings';
import { Clock, RefreshCw, RotateCcw } from 'lucide-react';

// Opções predefinidas de intervalo de histórico
const HISTORY_INTERVAL_OPTIONS = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 360, label: '6 horas' },
  { value: 720, label: '12 horas' },
  { value: 1440, label: '24 horas' },
];

// Opções predefinidas de intervalo de polling
const POLLING_INTERVAL_OPTIONS = [
  { value: 5, label: '5 segundos' },
  { value: 10, label: '10 segundos' },
  { value: 30, label: '30 segundos' },
  { value: 60, label: '1 minuto' },
  { value: 120, label: '2 minutos' },
  { value: 300, label: '5 minutos' },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { settings, saveSettings, resetSettings, isLoaded, DEFAULT_SETTINGS } = useDashboardSettings();
  
  const [historyInterval, setHistoryInterval] = useState(settings.historyIntervalMinutes);
  const [pollingInterval, setPollingInterval] = useState(settings.pollingIntervalSeconds);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar estado local com configurações carregadas
  useEffect(() => {
    if (isLoaded) {
      setHistoryInterval(settings.historyIntervalMinutes);
      setPollingInterval(settings.pollingIntervalSeconds);
    }
  }, [isLoaded, settings]);

  // Detectar mudanças
  useEffect(() => {
    const changed = historyInterval !== settings.historyIntervalMinutes || 
                   pollingInterval !== settings.pollingIntervalSeconds;
    setHasChanges(changed);
  }, [historyInterval, pollingInterval, settings]);

  const handleSaveChanges = () => {
    saveSettings({
      historyIntervalMinutes: historyInterval,
      pollingIntervalSeconds: pollingInterval,
    });
    toast({
      title: 'Configurações Salvas',
      description: 'Suas alterações foram salvas. Recarregue o dashboard para aplicar.',
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSettings();
    setHistoryInterval(DEFAULT_SETTINGS.historyIntervalMinutes);
    setPollingInterval(DEFAULT_SETTINGS.pollingIntervalSeconds);
    toast({
      title: 'Configurações Restauradas',
      description: 'As configurações foram restauradas para os valores padrão.',
    });
    setHasChanges(false);
  };

  const formatHistoryLabel = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutos`;
    if (minutes === 60) return '1 hora';
    if (minutes < 1440) return `${minutes / 60} horas`;
    return `${minutes / 1440} dia(s)`;
  };

  return (
    <div className="grid gap-6">
      {/* Card de Configurações do Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Configurações do Dashboard
          </CardTitle>
          <CardDescription>
            Configure o comportamento dos gráficos e métricas do dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intervalo de Histórico */}
          <div className="space-y-4">
            <Label htmlFor="history-interval" className="flex flex-col space-y-1">
              <span className="font-medium">Intervalo de Histórico dos Gráficos</span>
              <span className="font-normal text-sm text-muted-foreground">
                Define quanto tempo de histórico será carregado ao abrir o dashboard.
                Valor atual: <strong>{formatHistoryLabel(historyInterval)}</strong>
              </span>
            </Label>
            <Select 
              value={historyInterval.toString()} 
              onValueChange={(value) => setHistoryInterval(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                {HISTORY_INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Intervalo de Atualização */}
          <div className="space-y-4">
            <Label htmlFor="polling-interval" className="flex flex-col space-y-1">
              <span className="font-medium">Intervalo de Atualização Automática</span>
              <span className="font-normal text-sm text-muted-foreground">
                Define com que frequência os dados serão atualizados automaticamente.
                Valor atual: <strong>{pollingInterval < 60 ? `${pollingInterval} segundos` : `${pollingInterval / 60} minuto(s)`}</strong>
              </span>
            </Label>
            <Select 
              value={pollingInterval.toString()} 
              onValueChange={(value) => setPollingInterval(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                {POLLING_INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Restaurar Padrão
            </Button>
            <Button onClick={handleSaveChanges} disabled={!hasChanges} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Configurações do Sistema (existente) */}
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
            <Button onClick={() => toast({ title: 'Configurações Salvas', description: 'Suas alterações foram salvas com sucesso.' })}>
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
