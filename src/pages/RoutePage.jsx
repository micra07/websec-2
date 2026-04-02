import { useSelector } from 'react-redux';
import RouteForm from '../components/RouteForm';
import RouteResults from '../components/RouteResults';

export default function RoutePage() {
  const { results, loading, error } = useSelector(state => state.search);

  return (
    <div className="page route-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bi bi-arrow-left-right"></i>
            Маршрут между станциями
          </h1>
          <p className="page-subtitle">Найдите электричку между двумя станциями</p>
        </div>

        <RouteForm />

        <RouteResults results={results} loading={loading} error={error} />

        {results.length > 0 && (
          <div className="yandex-copyright">
            <small>Данные предоставлены сервисом <a href="https://rasp.yandex.ru/" target="_blank" rel="noopener noreferrer">Яндекс.Расписания</a></small>
          </div>
        )}
      </div>
    </div>
  );
}
