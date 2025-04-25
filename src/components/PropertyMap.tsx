import { useState } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';

interface Property {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  price: string;
  imageUrl: string;
  title: string;
}

interface PropertyMapProps {
  properties: Property[];
  center: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{ visibility: 'on' }]
  }
];

const mapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false
};

export function PropertyMap({ properties, center }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={mapOptions}
      >
        {properties.map((property) => (
          <OverlayView
            key={property.id}
            position={property.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              onClick={() => setSelectedProperty(property)}
              onMouseEnter={() => setHoveredProperty(property)}
              onMouseLeave={() => setHoveredProperty(null)}
              className="cursor-pointer relative"
            >
              {hoveredProperty?.id === property.id && (
                <div className="absolute bottom-full mb-2 w-48 h-32 rounded-lg overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-lg transition-all ${hoveredProperty?.id === property.id
                  ? 'bg-white text-black'
                  : 'bg-black/90 text-white'
                }`}>
                {property.price}
              </div>
            </div>
          </OverlayView>
        ))}

        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.position}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="max-w-xs">
              <img 
                src={selectedProperty.imageUrl} 
                alt={selectedProperty.title}
                className="w-full h-32 object-cover rounded-t"
              />
              <div className="p-2">
                <h3 className="font-medium">{selectedProperty.title}</h3>
                <p className="text-lg font-bold">{selectedProperty.price}</p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}










