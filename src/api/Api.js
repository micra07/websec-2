class StationsApi {
  basePath = '';

  constructor(basePath = '/api') {
    this.basePath = basePath;
  }

  async sendRequest(url, params = {}) {
    const query = new URLSearchParams(params);
    const queryString = query.toString();
    const fullUrl = `${this.basePath}${url}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(fullUrl);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `Ошибка запроса: ${response.status}`);
    }
    return await response.json();
  }

  getStations(query = '') {
    const params = {};
    if (query) params.query = query;
    return this.sendRequest('/stations', params);
  }

  getSchedule(stationCode, date, direction) {
    const params = {
      station: stationCode,
      transport_types: 'suburban',
    };
    if (date) params.date = date;
    if (direction && direction !== 'all') params.direction = direction;
    return this.sendRequest('/schedule', params);
  }

  searchRoute(from, to, date) {
    const params = {
      from,
      to,
      transport_types: 'suburban',
    };
    if (date) params.date = date;
    return this.sendRequest('/search', params);
  }
}

const api = new StationsApi();
export default api;
