import { formatTime, formatDuration } from '../utils/format';

export default function RouteResults({ results, loading, error }) {
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
          <p>Ищем рейсы...</p>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="schedule-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <p>Ошибка поиска</p>
        <small>{error}</small>
      </div>
    );
  };

  const renderContent = () => {
    if (!results.length) return null;

    return (
      <div className="route-results">
        <h2 className="results-title">
          <i className="bi bi-list-check"></i>
          Найдено рейсов: {results.length}
        </h2>
        <div className="route-cards">
          {results.map((seg, idx) => {
            const thread = seg.thread || {};
            return (
              <div key={idx} className="route-card">
                <div className="route-card-header">
                  <div className="train-info">
                    <i className="bi bi-train-front"></i>
                    <span className="train-num">{thread.number || '—'}</span>
                  </div>
                  <span className="route-card-title">{thread.short_title || thread.title || ''}</span>
                </div>

                <div className="route-card-timeline">
                  <div className="timeline-point departure-point">
                    <div className="timeline-time">{formatTime(seg.departure)}</div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-station">{seg.from?.title || '—'}</div>
                  </div>
                  <div className="timeline-line">
                    <span className="timeline-duration">{formatDuration(seg.duration)}</span>
                  </div>
                  <div className="timeline-point arrival-point">
                    <div className="timeline-time">{formatTime(seg.arrival)}</div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-station">{seg.to?.title || '—'}</div>
                  </div>
                </div>

                {seg.tickets_info?.places?.length > 0 && (
                  <div className="route-card-price">
                    <i className="bi bi-tag"></i>
                    {seg.tickets_info.places.map((p, i) => (
                      <span key={i} className="price-tag">
                        {p.price?.whole || '—'} ₽
                      </span>
                    ))}
                  </div>
                )}

                <div className="route-card-stops">
                  <i className="bi bi-pin-map"></i>
                  <span>Остановок: {seg.stops || '—'}</span>
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
        : renderContent()
    }
  </>;
}
