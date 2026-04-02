import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapView from '../components/MapView';
import StationSearch from '../components/StationSearch';
import { fetchStations } from '../store/stationsSlice';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: stations } = useSelector(state => state.stations);

  useEffect(() => {
    if (!stations.length) {
      dispatch(fetchStations());
    }
  }, [dispatch, stations.length]);

  const handleStationSelect = (station) => {
    navigate(`/station/${station.code}`, { state: { station } });
  };

  return (
    <div className="page home-page">
      <div className="map-search-overlay">
        <div className="search-overlay-container">
          <h1 className="search-title">
            <i className="bi bi-train-front-fill"></i>
            ЭлектроПрибывалка
          </h1>
          <p className="search-subtitle">Расписание электричек Самарской области</p>
          <StationSearch onSelect={handleStationSelect} />
        </div>
      </div>
      <MapView />
    </div>
  );
}
