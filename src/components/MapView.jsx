import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedStation, fetchStations } from '../store/stationsSlice';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke, Text as OlText } from 'ol/style';
import 'ol/ol.css';

export default function MapView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: stations } = useSelector(state => state.stations);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const popupRef = useRef(null);
  const overlayRef = useRef(null);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: { animation: { duration: 250 } },
      positioning: 'bottom-center',
      offset: [0, -15],
    });
    overlayRef.current = overlay;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          className: 'ol-layer-osm',
        }),
      ],
      view: new View({
        center: fromLonLat([50.15, 53.2]),
        zoom: 9,
        minZoom: 6,
        maxZoom: 18,
      }),
      overlays: [overlay],
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(null);
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !stations.length) return;
    const map = mapInstance.current;

    map.getLayers().getArray()
      .filter(l => l.get('name') === 'stations')
      .forEach(l => map.removeLayer(l));

    const features = stations.map(station => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([station.lng, station.lat])),
        stationData: station,
      });
      return feature;
    });

    const stationStyle = (feature, resolution) => {
      const station = feature.get('stationData');
      const isMain = ['Самара', 'Тольятти', 'Сызрань-1', 'Кинель', 'Новокуйбышевск', 'Жигулёвск', 'Чапаевск', 'Похвистнево', 'Октябрьск'].includes(station.title);
      const radius = isMain ? 8 : 5;
      const showLabel = resolution < 100 || isMain;
      
      return new Style({
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({ color: isMain ? '#6366f1' : '#818cf8' }),
          stroke: new Stroke({ color: '#312e81', width: 2 }),
        }),
        text: showLabel ? new OlText({
          text: station.title,
          offsetY: -18,
          font: '600 12px Inter, sans-serif',
          fill: new Fill({ color: '#1e1b4b' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
          textAlign: 'center',
        }) : undefined,
      });
    };

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features }),
      style: stationStyle,
      name: 'stations',
    });

    map.addLayer(vectorLayer);

    map.on('click', (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, f => f);
      if (feature) {
        const station = feature.get('stationData');
        setPopupData(station);
        overlayRef.current.setPosition(e.coordinate);
        dispatch(setSelectedStation(station));
      } else {
        setPopupData(null);
        overlayRef.current.setPosition(undefined);
      }
    });

    map.on('pointermove', (e) => {
      const hit = map.hasFeatureAtPixel(e.pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }, [stations, dispatch]);

  const goToStation = () => {
    if (popupData) {
      navigate(`/station/${popupData.code}`, {
        state: { station: popupData }
      });
    }
  };

  const closePopup = () => {
    setPopupData(null);
    overlayRef.current.setPosition(undefined);
  };

  const flyToStation = (station) => {
    if (!mapInstance.current) return;
    mapInstance.current.getView().animate({
      center: fromLonLat([station.lng, station.lat]),
      zoom: 13,
      duration: 800,
    });
    setPopupData(station);
    overlayRef.current.setPosition(fromLonLat([station.lng, station.lat]));
    dispatch(setSelectedStation(station));
  };

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />
      <div ref={popupRef} className="map-popup-wrapper">
        {popupData && (
          <div className="map-popup">
            <button className="popup-close" onClick={closePopup}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="popup-icon">
              <i className="bi bi-train-front-fill"></i>
            </div>
            <h3 className="popup-title">{popupData.title}</h3>
            <p className="popup-code">Код: {popupData.code}</p>
            <button className="popup-btn" onClick={goToStation}>
              <i className="bi bi-clock"></i>
              Расписание
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { MapView };
