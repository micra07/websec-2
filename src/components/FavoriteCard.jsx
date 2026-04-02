import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFavorite } from '../store/favoritesSlice';

export default function FavoriteCard({ station }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeFavorite(station.code));
  };

  const handleClick = () => {
    navigate(`/station/${station.code}`, { state: { station } });
  };

  return (
    <div className="favorite-card" onClick={handleClick}>
      <div className="fav-card-icon">
        <i className="bi bi-train-front-fill"></i>
      </div>
      <div className="fav-card-body">
        <h3 className="fav-card-title">{station.title}</h3>
        <p className="fav-card-code">{station.code}</p>
      </div>
      <div className="fav-card-actions">
        <button className="fav-schedule-btn" title="Расписание">
          <i className="bi bi-clock"></i>
        </button>
        <button className="fav-remove-btn" onClick={handleRemove} title="Удалить из избранного">
          <i className="bi bi-star-fill"></i>
        </button>
      </div>
    </div>
  );
}
