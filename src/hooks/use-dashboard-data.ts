/**
 * Hook para carregar dados do banco e transformar em estrutura de dashboard
 */

import { useState, useEffect } from 'react';
import { dbClient } from '@/lib/db-client';
import type { Property, Crop, Station } from '@/lib/types';
import { mockData } from '@/lib/mock-data';

export function useDashboardData() {
  const [properties, setProperties] = useState<Property[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do banco
        const [propriedadesDb, culturasDb, estacoesSDb, posicoesDb, grandezasDb] = await Promise.all([
          dbClient.propriedades(),
          dbClient.culturas(),
          dbClient.estacoes(),
          dbClient.posicoesEstacao(),
          dbClient.grandezas(),
        ]);

        // Construir estrutura Property -> Crop -> Station
        const propertiesMap = new Map<number, Property>();

        // Criar propriedades
        propriedadesDb.forEach((p) => {
          propertiesMap.set(p.id, {
            id: String(p.id),
            name: p.nome_propriedade,
            crops: [],
            mapImageUrl: '',
            location: { lat: -15.78, lng: -48.0 }, // Default Brasil
          });
        });

        // Adicionar culturas às propriedades
        culturasDb.forEach((c) => {
          const prop = propertiesMap.get(c.id_propriedade);
          if (prop) {
            prop.crops.push({
              id: String(c.id),
              name: c.nome_cultura,
              stations: [],
            });
          }
        });

        // Adicionar estações às culturas (via tab_pos_estacao)
        posicoesDb.forEach((pos) => {
          const estacao = estacoesSDb.find((e) => e.id === pos.id_estacao);
          if (estacao) {
            const prop = propertiesMap.get(estacao.id_propriedade);
            if (prop) {
              const crop = prop.crops.find((c) => c.id === String(pos.id_cultura));
              if (crop) {
                crop.stations.push({
                  id: String(estacao.id),
                  name: estacao.nome_estacao,
                  location: {
                    lat: pos.latitude,
                    lng: pos.longitude,
                  },
                  sensorData: {
                    airTemperature: { value: 0, unit: '°C', trend: [], icon: undefined as any, name: '' },
                    airHumidity: { value: 0, unit: '%', trend: [], icon: undefined as any, name: '' },
                    soilMoisture: { value: 0, unit: '%', trend: [], icon: undefined as any, name: '' },
                    soilPH: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    electricalConductivity: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    nitrogen: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    phosphorus: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    potassium: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    co2: { value: 0, unit: 'ppm', trend: [], icon: undefined as any, name: '' },
                    windSpeed: { value: 0, unit: 'm/s', trend: [], icon: undefined as any, name: '' },
                    windDirection: { value: 0, unit: '°', trend: [], icon: undefined as any, name: '' },
                    windQuadrant: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    precipitation: { value: 0, unit: 'mm', trend: [], icon: undefined as any, name: '' },
                    rainDetection: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                    ultravioletIndex: { value: 0, unit: '', trend: [], icon: undefined as any, name: '' },
                  } as any,
                  weatherForecast: {
                    twentyFourHours: [],
                    fiveDays: [],
                  },
                  alertingSensors: [],
                  cameraImageUrl: '',
                  cameraTimestamp: '',
                  alertsLog: [],
                  activityProgress: [],
                } as Station);
              }
            }
          }
        });

        setProperties(Array.from(propertiesMap.values()).filter((p) => p.crops.length > 0));
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        // Fallback para mock data
        setProperties(mockData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { properties, loading, error };
}
