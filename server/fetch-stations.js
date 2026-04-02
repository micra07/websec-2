import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const API_KEY = process.env.YANDEX_RASP_API_KEY;

async function main() {
  console.log('Загрузка списка станций из API Яндекса...');
  const res = await fetch(`https://api.rasp.yandex.net/v3.0/stations_list/?apikey=${API_KEY}&lang=ru_RU&format=json`);
  const data = await res.json();

  const russia = data.countries.find(c => c.title === 'Россия');
  if (!russia) { console.log('Россия не найдена'); return; }

  const samara = russia.regions.find(r => r.title && r.title.includes('Самар'));
  if (!samara) { console.log('Самарская область не найдена.'); return; }

  console.log('Найден регион:', samara.title);

  const stations = [];
  for (const settlement of samara.settlements) {
    for (const st of settlement.stations) {
      if (st.transport_type === 'train' && st.latitude && st.longitude) {
        stations.push({
          code: st.codes.yandex_code,
          title: st.title,
          lat: Number(st.latitude),
          lng: Number(st.longitude),
        });
      }
    }
  }

  console.log(`Найдено ${stations.length} станций с координатами`);

  const lines = stations.map(s =>
    `  { code: "${s.code}", title: "${s.title}", lat: ${s.lat}, lng: ${s.lng} }`
  );

  const output = `export const stations = [
${lines.join(',\n')}
];
`;

  const outPath = path.join(__dirname, 'stations-data.js');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`Written ${stations.length} stations to stations-data.js`);
}

main().catch(console.error);
