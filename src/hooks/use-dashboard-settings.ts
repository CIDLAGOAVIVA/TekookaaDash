'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DashboardSettings {
  /** Intervalo de histórico em minutos (padrão: 120 = 2 horas) */
  historyIntervalMinutes: number;
  /** Intervalo de polling em segundos (padrão: 10) */
  pollingIntervalSeconds: number;
}

const DEFAULT_SETTINGS: DashboardSettings = {
  historyIntervalMinutes: 120, // 2 horas
  pollingIntervalSeconds: 10,
};

const STORAGE_KEY = 'dashboard-settings';

export function useDashboardSettings() {
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = useCallback((newSettings: Partial<DashboardSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }
      return updated;
    });
  }, []);

  // Resetar para configurações padrão
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
    DEFAULT_SETTINGS,
  };
}
