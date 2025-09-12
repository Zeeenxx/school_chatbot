
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';
import apiService from '../services/apiService';

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapWrapper = styled.div`
  height: 80vh;
  width: 100%;
  margin: 2rem 0;
`;

const CampusMap: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await apiService.getPublicFacilities();
        setFacilities(data.filter(f => f.latitude && f.longitude));
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return <MapWrapper>Loading map...</MapWrapper>;
  }

  // Use the average of facility locations as the map center, or a default
  const centerLat = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + f.latitude, 0) / facilities.length
    : 12.365;
  const centerLng = facilities.length > 0
    ? facilities.reduce((sum, f) => sum + f.longitude, 0) / facilities.length
    : 12.369;

  return (
    <MapWrapper>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={18}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />
        {facilities.map(facility => (
          <Marker key={facility.id} position={[facility.latitude, facility.longitude]}>
            <Popup>
              <b>{facility.name}</b><br />
              {facility.hours}<br />
              {facility.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default CampusMap;
