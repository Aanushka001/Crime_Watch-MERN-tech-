export const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
  };
    export const formatReportsForMap = (reports) => {
    return reports.map((report) => ({
      position: {
        lat: report.latitude,
        lng: report.longitude,
      },
      type: report.type,
      description: report.description,
    }));
  };
  
  export const calculateMapCenter = (reports) => {
    if (!reports.length) return { lat: 37.7749, lng: -122.4194 }; 
  
    const totalLat = reports.reduce((sum, report) => sum + report.latitude, 0);
    const totalLng = reports.reduce((sum, report) => sum + report.longitude, 0);
  
    return {
      lat: totalLat / reports.length,
      lng: totalLng / reports.length,
    };
  };
  
  export const generateHeatmapData = (reports) => {
    return reports.map((report) => ({
      location: new google.maps.LatLng(report.latitude, report.longitude),
      weight: report.severity || 1,
    }));
  };
  export const fetchUserLocation = () =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation not supported by this browser.'));
      }
    });
  