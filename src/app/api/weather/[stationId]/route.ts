import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mapear códigos do Open-Meteo para ícones
const weatherCodeToIcon: Record<number, string> = {
  0: 'Sun',           // Clear sky
  1: 'CloudSun',      // Mainly clear
  2: 'CloudSun',      // Partly cloudy
  3: 'Cloudy',        // Overcast
  45: 'Cloudy',       // Foggy
  48: 'Cloudy',       // Depositing rime fog
  51: 'CloudRain',    // Light drizzle
  53: 'CloudRain',    // Moderate drizzle
  55: 'CloudRain',    // Dense drizzle
  56: 'CloudRain',    // Light freezing drizzle
  57: 'CloudRain',    // Dense freezing drizzle
  61: 'CloudRain',    // Slight rain
  63: 'CloudRain',    // Moderate rain
  65: 'CloudRain',    // Heavy rain
  66: 'CloudRain',    // Light freezing rain
  67: 'CloudRain',    // Heavy freezing rain
  71: 'Cloudy',       // Slight snow fall
  73: 'Cloudy',       // Moderate snow fall
  75: 'Cloudy',       // Heavy snow fall
  77: 'Cloudy',       // Snow grains
  80: 'CloudRain',    // Slight rain showers
  81: 'CloudRain',    // Moderate rain showers
  82: 'CloudRain',    // Violent rain showers
  85: 'Cloudy',       // Slight snow showers
  86: 'Cloudy',       // Heavy snow showers
  95: 'CloudRain',    // Thunderstorm
  96: 'CloudRain',    // Thunderstorm with slight hail
  99: 'CloudRain',    // Thunderstorm with heavy hail
};

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ stationId: string }> }
) {
  try {
    const params = await context.params;
    const stationId = params.stationId;

    if (!stationId) {
      return NextResponse.json({ error: 'Station ID obrigatório' }, { status: 400 });
    }

    // Se o ID não for numérico (ex: mock data 'st1'), usar fallback
    if (isNaN(Number(stationId))) {
      throw new Error('ID de estação não numérico (mock)');
    }

    // Buscar localização da estação no banco
    const posicaoResult = await query(`
      SELECT pe.latitude, pe.longitude
      FROM tab_pos_estacao pe
      WHERE pe.id_estacao = ?
      ORDER BY pe.ts_cadastro DESC
      LIMIT 1
    `, [stationId]) as Array<{ latitude: number; longitude: number }> | null;

    let lat: number;
    let lon: number;

    if (posicaoResult && posicaoResult.length > 0) {
      lat = posicaoResult[0].latitude;
      lon = posicaoResult[0].longitude;
    } else {
      // Fallback para localização padrão (Brasília)
      lat = -15.78;
      lon = -47.93;
    }

    // Buscar previsão do tempo da Open-Meteo (API gratuita)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo&forecast_days=5`;
    
    const weatherResponse = await fetch(weatherUrl, {
      next: { revalidate: 1800 }, // Cache por 30 minutos
    });

    if (!weatherResponse.ok) {
      throw new Error(`Erro ao buscar previsão do tempo: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // Processar dados de 24 horas (próximas 8 leituras de 3 em 3 horas)
    const twentyFourHours = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 24 && twentyFourHours.length < 8; i += 3) {
      const hourIndex = currentHour + i;
      if (hourIndex < weatherData.hourly.time.length) {
        const time = new Date(weatherData.hourly.time[hourIndex]);
        twentyFourHours.push({
          time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(weatherData.hourly.temperature_2m[hourIndex]),
          icon: weatherCodeToIcon[weatherData.hourly.weather_code[hourIndex]] || 'Cloudy',
          precipitation: weatherData.hourly.precipitation_probability[hourIndex] || 0,
        });
      }
    }

    // Processar dados de 5 dias
    const fiveDays = weatherData.daily.time.map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      const dayName = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : dayNames[date.getDay()];
      
      return {
        day: dayName,
        maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
        minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
        icon: weatherCodeToIcon[weatherData.daily.weather_code[index]] || 'Cloudy',
        precipitation: weatherData.daily.precipitation_probability_max[index] || 0,
      };
    });

    return NextResponse.json({
      twentyFourHours,
      fiveDays,
      location: { lat, lon },
    });

  } catch (error) {
    console.error('Erro na API de previsão do tempo:', error);
    
    // Retornar dados mock em caso de erro
    return NextResponse.json({
      twentyFourHours: [
        { time: '09:00', temp: 25, icon: 'CloudSun', precipitation: 10 },
        { time: '12:00', temp: 28, icon: 'Sun', precipitation: 5 },
        { time: '15:00', temp: 30, icon: 'Sun', precipitation: 5 },
        { time: '18:00', temp: 27, icon: 'CloudSun', precipitation: 15 },
        { time: '21:00', temp: 24, icon: 'Cloudy', precipitation: 20 },
        { time: '00:00', temp: 22, icon: 'Cloudy', precipitation: 25 },
        { time: '03:00', temp: 21, icon: 'Cloudy', precipitation: 30 },
        { time: '06:00', temp: 20, icon: 'CloudSun', precipitation: 20 },
      ],
      fiveDays: [
        { day: 'Hoje', maxTemp: 30, minTemp: 20, icon: 'Sun', precipitation: 10 },
        { day: 'Amanhã', maxTemp: 28, minTemp: 19, icon: 'CloudSun', precipitation: 25 },
        { day: 'Qua', maxTemp: 27, minTemp: 18, icon: 'CloudRain', precipitation: 60 },
        { day: 'Qui', maxTemp: 29, minTemp: 19, icon: 'Cloudy', precipitation: 35 },
        { day: 'Sex', maxTemp: 31, minTemp: 20, icon: 'Sun', precipitation: 5 },
      ],
      error: 'Usando dados de fallback',
    });
  }
}
