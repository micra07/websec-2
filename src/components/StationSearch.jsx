import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStations, filterStations } from '../store/stationsSlice';

export default function StationSearch({ onSelect, placeholder, value, compact }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filtered, items } = useSelector(state => state.stations);
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchStations());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setHighlightIdx(-1);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(filterStations(val));
      setIsOpen(val.length > 0);
    }, 200);
  };

  const handleSelect = (station) => {
    setQuery(station.title);
    setIsOpen(false);
    if (onSelect) {
      onSelect(station);
    } else {
      navigate(`/station/${station.code}`, { state: { station } });
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || !filtered.length) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (query.length > 0 && filtered.length > 0) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearInput = () => {
    setQuery('');
    setIsOpen(false);
    dispatch(filterStations(''));
    inputRef.current?.focus();
  };

  return (
    <div className={`station-search ${compact ? 'compact' : ''}`} ref={wrapperRef}>
      <div className="search-input-wrapper">
        <i className="bi bi-search search-icon"></i>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder || 'Найти станцию...'}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoComplete="off"
          id="station-search-input"
        />
        {query && (
          <button className="search-clear" onClick={clearInput}>
            <i className="bi bi-x-circle-fill"></i>
          </button>
        )}
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="search-dropdown">
          {filtered.slice(0, 10).map((station, idx) => (
            <div
              key={station.code + station.title}
              className={`search-item ${idx === highlightIdx ? 'highlighted' : ''}`}
              onClick={() => handleSelect(station)}
              onMouseEnter={() => setHighlightIdx(idx)}
            >
              <i className="bi bi-geo-alt-fill"></i>
              <div className="search-item-info">
                <span className="search-item-title">{station.title}</span>
                <span className="search-item-code">{station.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && query.length > 0 && filtered.length === 0 && (
        <div className="search-dropdown">
          <div className="search-empty">
            <i className="bi bi-emoji-frown"></i>
            <span>Станция не найдена</span>
          </div>
        </div>
      )}
    </div>
  );
}
