import React, { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig.js'; 
import { useAuth } from '../../../context/AuthContext.jsx';
import { fromLonLat } from 'ol/proj';
import { Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';

const MapView = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [reports, setReports] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize map
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new VectorLayer({
          source: new VectorSource(),
        }),
      ],
      view: new View({
        center: fromLonLat([77.2090, 28.6139]), 
        zoom: 10,
      }),
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const reportsQuery = query(
      collection(db, 'reports'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);

      const vectorSource = mapInstance.current
        .getLayers()
        .getArray()
        .find((layer) => layer instanceof VectorLayer)
        ?.getSource();

      if (vectorSource) {
        vectorSource.clear();
        reportsData.forEach((report) => {
          const [lat, lng] = report.coordinates || [];
          const feature = new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
            reportData: report,
          });
          feature.setStyle(
            new Style({
              image: new Icon({
                src: '/marker-icon.png',
                scale: 1.2,
              }),
            })
          );
          vectorSource.addFeature(feature);
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="map-container" ref={mapRef}></div>
  );
};

export default MapView;
