import { useState } from 'react';
import Map from './components/Map.jsx';
import Sidebar from './components/Sidebar.jsx';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [costData, setCostData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCitySelect(city, country, latlng) {
    setSelectedCity({ city, country, latlng });
    setCostData(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, country }),
      });
      const data = await res.json();
      setCostData(data);
    } catch (err) {
      setCostData({ error: 'Failed to fetch cost data.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Map onCitySelect={handleCitySelect} selectedCity={selectedCity} loading={loading} />
      <Sidebar selectedCity={selectedCity} costData={costData} loading={loading} />
    </>
  );
}
