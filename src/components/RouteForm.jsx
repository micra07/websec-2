import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StationSearch from './StationSearch';
import { setFrom, setTo, setSearchDate, swapStations, clearSearch } from '../store/searchSlice';
import { searchRoute } from '../store/searchSlice';

export default function RouteForm() {
  const dispatch = useDispatch();
  const { from, to, date, loading } = useSelector(state => state.search);

  const handleSearch = () => {
    if (!from || !to) return;
    dispatch(searchRoute({ from: from.code, to: to.code, date }));
  };

  const handleSwap = () => {
    dispatch(swapStations());
  };

  return (
    <div className="route-form">
      <div className="route-fields">
        <div className="route-station-field">
          <label className="field-label">
            <i className="bi bi-geo-alt"></i> Откуда
          </label>
          <StationSearch
            compact
            placeholder="Станция отправления"
            value={from?.title || ''}
            onSelect={(station) => dispatch(setFrom(station))}
          />
        </div>

        <button className="swap-btn" onClick={handleSwap} title="Поменять местами">
          <i className="bi bi-arrow-down-up"></i>
        </button>

        <div className="route-station-field">
          <label className="field-label">
            <i className="bi bi-geo-alt-fill"></i> Куда
          </label>
          <StationSearch
            compact
            placeholder="Станция прибытия"
            value={to?.title || ''}
            onSelect={(station) => dispatch(setTo(station))}
          />
        </div>
      </div>

      <div className="route-options">
        <div className="date-field">
          <label className="field-label">
            <i className="bi bi-calendar3"></i> Дата
          </label>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => dispatch(setSearchDate(e.target.value))}
            id="route-date-input"
          />
        </div>

        <button
          className="search-route-btn"
          onClick={handleSearch}
          disabled={!from || !to || loading}
          id="search-route-button"
        >
          {loading ? (
            <>
              <span className="spinner-sm"></span>
              Поиск...
            </>
          ) : (
            <>
              <i className="bi bi-search"></i>
              Найти
            </>
          )}
        </button>
      </div>
    </div>
  );
}
