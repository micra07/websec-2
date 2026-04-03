import { useMemo } from 'react';
import { formatTime } from '../utils/format';

function getStatusBadge(departure) {
  if (!departure) return null;
  const dep = new Date(departure);
  const now = new Date();
  const diff = (dep - now) / 60000;

  if (diff < 0) {
    return <span className="status-badge departed">Ушёл</span>;
  } else if (diff <= 15) {
    return <span className="status-badge soon">Через {Math.ceil(diff)} мин</span>;
  } else if (diff <= 60) {
    return <span className="status-badge upcoming">Через {Math.ceil(diff)} мин</span>;
  }
  return null;
}

export default function ScheduleTable({ segments, loading, error }) {
  const sortedSegments = useMemo(() => {
    if (!segments?.length) return [];
    return [...segments].sort((a, b) => {
      const timeA = a.departure || a.arrival || '';
      const timeB = b.departure || b.arrival || '';
      return timeA.localeCompare(timeB);
    });
  }, [segments]);

  const renderLoading = () => {
    return (
      <div className="schedule-loading">
        <div className="loading-train">
          <div className="train-animation">
            <i className="bi bi-train-front-fill"></i>
            <div className="track-line">
              <div className="track-dots"></div>
            </div>
          </div>
          <p>Загружаем расписание...</p>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="schedule-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <p>Ошибка загрузки расписания</p>
        <small>{error}</small>
      </div>
    );
  };

  const renderEmpty = () => {
    return (
      <div className="schedule-empty">
        <i className="bi bi-calendar-x"></i>
        <p>Рейсов не найдено</p>
        <small>Попробуйте выбрать другую дату</small>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="schedule-table-wrapper">
        <table className="schedule-table desktop-only">
          <thead>
            <tr>
              <th>Поезд</th>
              <th>Маршрут</th>
              <th>Прибытие</th>
              <th>Отправление</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedSegments.map((seg, idx) => {
              const thread = seg.thread || {};
              return (
                <tr key={idx} className="schedule-row">
                  <td>
                    <div className="train-number">
                      <i className="bi bi-train-front"></i>
                      <span>{thread.number || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="train-route">
                      {thread.title || `${thread.short_title || '—'}`}
                    </div>
                  </td>
                  <td className="time-cell">{formatTime(seg.arrival)}</td>
                  <td className="time-cell">{formatTime(seg.departure)}</td>
                  <td>{getStatusBadge(seg.departure)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="schedule-cards mobile-only">
          {sortedSegments.map((seg, idx) => {
            const thread = seg.thread || {};
            return (
              <div key={idx} className="schedule-card">
                <div className="card-header-row">
                  <div className="train-info">
                    <i className="bi bi-train-front"></i>
                    <span className="train-num">{thread.number || '—'}</span>
                  </div>
                  {getStatusBadge(seg.departure)}
                </div>
                <div className="card-route">
                  {thread.title || thread.short_title || '—'}
                </div>
                <div className="card-times">
                  <div className="time-block">
                    <span className="time-label">Приб.</span>
                    <span className="time-value">{formatTime(seg.arrival)}</span>
                  </div>
                  <div className="time-separator">
                    <i className="bi bi-arrow-right"></i>
                  </div>
                  <div className="time-block">
                    <span className="time-label">Отпр.</span>
                    <span className="time-value">{formatTime(seg.departure)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return <>
    {loading
      ? renderLoading()
      : error
        ? renderError()
        : !sortedSegments.length
          ? renderEmpty()
          : renderContent()
    }
  </>;
}
