import { useSelector } from 'react-redux';
import FavoriteCard from '../components/FavoriteCard';

export default function FavoritesPage() {
  const { items: favorites } = useSelector(state => state.favorites);

  return (
    <div className="page favorites-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bi bi-star-fill"></i>
            Избранные станции
          </h1>
          <p className="page-subtitle">Ваши любимые станции для быстрого доступа</p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">
              <i className="bi bi-star"></i>
            </div>
            <h2>Пока пусто</h2>
            <p>Добавьте станции в избранное, чтобы быстро просматривать расписание</p>
            <p className="empty-hint">
              <i className="bi bi-lightbulb"></i>
              Нажмите ★ на странице расписания станции
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map(station => (
              <FavoriteCard key={station.code} station={station} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
