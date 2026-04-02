import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { stations } from './stations-data.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = 3001;
const API_KEY = process.env.YANDEX_RASP_API_KEY;
const BASE_URL = process.env.YANDEX_RASP_API_URL || 'https://api.rasp.yandex.net/v3.0';
const LANG = process.env.YANDEX_RASP_LANG || 'ru_RU';

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

function buildParams(extra = {}) {
  const params = new URLSearchParams({ apikey: API_KEY, format: 'json', lang: LANG, ...extra });
  return params;
}

app.get('/api/stations', (req, res) => {
  const { query } = req.query;
  let result = stations;

  if (query) {
    const q = query.toLowerCase();
    result = stations.filter(s => s.title.toLowerCase().includes(q));
  }

  res.json({ stations: result });
});

app.get('/api/schedule', async (req, res) => {
  try {
    const { station, date, direction, transport_types } = req.query;

    if (!station) {
      return res.status(400).json({ error: 'Параметр station обязателен' });
    }

    const params = buildParams({
      station,
      transport_types: transport_types || 'suburban'
    });
    if (date) params.append('date', date);
    if (direction) params.append('direction', direction);

    const response = await fetch(`${BASE_URL}/schedule/?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Ошибка при загрузке расписания:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить расписание' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { from, to, date, transport_types } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'Параметры from и to обязательны' });
    }

    const params = buildParams({
      from,
      to,
      transport_types: transport_types || 'suburban'
    });
    if (date) params.append('date', date);

    const response = await fetch(`${BASE_URL}/search/?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Ошибка при поиске маршрута:', error.message);
    res.status(500).json({ error: 'Не удалось найти маршрут' });
  }
});

app.get('/api/nearest', async (req, res) => {
  try {
    const { lat, lng, distance, transport_types } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Параметры lat и lng обязательны' });
    }

    const params = buildParams({
      lat,
      lng,
      distance: distance || '50',
      transport_types: transport_types || 'train'
    });

    const response = await fetch(`${BASE_URL}/nearest_stations/?${params}`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Ошибка при поиске ближайших станций:', error.message);
    res.status(500).json({ error: 'Не удалось найти ближайшие станции' });
  }
});

app.get('/api/copyright', async (req, res) => {
  try {
    const params = buildParams();
    const response = await fetch(`${BASE_URL}/copyright/?${params}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Ошибка при загрузке копирайта:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить информацию о копирайте' });
  }
});

app.listen(PORT, () => {
  console.log(`Прокси-сервер запущен: http://localhost:${PORT}`);
  console.log(`  API-ключ: ${API_KEY ? 'загружен' : 'НЕ ЗАДАН'}`);
  console.log(`  API URL: ${BASE_URL}`);
  console.log(`  Язык: ${LANG}`);
});
