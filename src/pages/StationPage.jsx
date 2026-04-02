import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedule, setDate, setDirection } from '../store/scheduleSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import ScheduleTable from '../components/ScheduleTable';

export default function StationPage() {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { segments, stationTitle, date, direction, loading, error } = useSelector(state => state.schedule);
  const favorites = useSelector(state => state.favorites.items);

  const stationFromState = location.state?.station;
  const displayTitle = stationTitle || stationFromState?.title || code;
  const isFavorite = favorites.some(f => f.code === code);

  useEffect(() => {
    dispatch(fetchSchedule({ stationCode: code, date, direction }));
  }, [dispatch, code, date, direction]);

  const handleDateChange = (e) => {
    dispatch(setDate(e.target.value));
  };

  const handleDirectionChange = (dir) => {
    dispatch(setDirection(dir));
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(code));
    } else {
      dispatch(addFavorite({
        code,
        title: displayTitle,
        lat: stationFromState?.lat,
        lng: stationFromState?.lng,
      }));
    }
  };

  return (
    <div className="page station-page">
      <div className="page-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          Назад
        </button>

        <div className="station-header">
          <div className="station-header-info">
            <div className="station-icon-large">
              <i className="bi bi-train-front-fill"></i>
            </div>
            <div>
              <h1 className="station-name">{displayTitle}</h1>
              <p className="station-code-label">Код: {code}</p>
            </div>
          </div>
          <button
            className={`fav-toggle-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}`}></i>
          </button>
        </div>

        <div className="schedule-filters">
          <div className="filter-group">
            <label className="filter-label">
              <i className="bi bi-calendar3"></i> Дата
            </label>
            <input
              type="date"
              className="date-input"
              value={date}
              onChange={handleDateChange}
              id="schedule-date-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <i className="bi bi-funnel"></i> Направление
            </label>
            <div className="direction-btns">
              {[
                { val: 'all', label: 'Все' },
                { val: 'arrival', label: 'Прибытие' },
                { val: 'departure', label: 'Отправление' },
              ].map(d => (
                <button
                  key={d.val}
                  className={`dir-btn ${direction === d.val ? 'active' : ''}`}
                  onClick={() => handleDirectionChange(d.val)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ScheduleTable segments={segments} loading={loading} error={error} />

        <div className="yandex-copyright">
          <small>Данные предоставлены сервисом <a href="https://rasp.yandex.ru/" target="_blank" rel="noopener noreferrer">Яндекс.Расписания</a></small>
        </div>
      </div>
    </div>
  );
}
