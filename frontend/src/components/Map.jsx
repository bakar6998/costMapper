import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';

function ClickHandler({ onCitySelect, loading }) {
  const map = useMap();

  useMapEvents({
    async click(e) {
      if (loading) return;
      map.getContainer().style.cursor = 'wait';
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `${NOMINATIM}?lat=${lat}&lon=${lng}&format=json&accept-language=en`
        );
        const data = await res.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          'Unknown';
        const country = data.address.country || 'Unknown';
        onCitySelect(city, country, e.latlng);
      } catch {
        onCitySelect('Unknown', 'Unknown', e.latlng);
      } finally {
        map.getContainer().style.cursor = '';
      }
    },
  });

  return null;
}

export default function Map({ onCitySelect, selectedCity, loading }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ flex: 1, height: '100vh' }}
      minZoom={2}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onCitySelect={onCitySelect} loading={loading} />
      {selectedCity && (
        <Marker position={[selectedCity.latlng.lat, selectedCity.latlng.lng]}>
          <Popup>
            <strong>{selectedCity.city}</strong><br />{selectedCity.country}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
