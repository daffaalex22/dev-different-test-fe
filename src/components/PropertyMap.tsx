import { useState } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';
import { PropertyDialog } from '@/components/PropertyDialog';

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
  onPropertyUpdate?: (property: Property) => void;
  onPropertyDelete?: (property: Property) => void;
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

export function PropertyMap({ properties, center, onPropertyUpdate, onPropertyDelete }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleDialogClose = () => {
    setSelectedProperty(null);
  };

  const handleSave = (updatedProperty: Property) => {
    if (onPropertyUpdate) {
      onPropertyUpdate(updatedProperty);
    }
    handleDialogClose();
  };

  const handleDelete = (property: Property) => {
    if (onPropertyDelete) {
      onPropertyDelete(property);
    }
    handleDialogClose();
  };

  return (
    <>
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
                onClick={() => handlePropertySelect(property)}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
                className="cursor-pointer relative"
              >
                {hoveredProperty?.id === property.id && (
                  <div className="relative mb-2 w-48 h-32 rounded-lg overflow-hidden z-10">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {hoveredProperty?.id === property.id &&
                  <div className={`relative inline bottom-[20px] left-[50px] px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-lg transition-all bg-white text-black dark:text-black z-20`}>
                    {property.price}
                  </div>
                }
                {hoveredProperty?.id === property.id ||
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-lg transition-all ${hoveredProperty?.id === property.id ? '' : 'bg-black/90 text-white'}`}>
                    {property.price}
                  </div>
                }
              </div>
            </OverlayView>
          ))}
        </GoogleMap>
      </LoadScript>

      <PropertyDialog
        property={selectedProperty}
        isOpen={selectedProperty !== null}
        onClose={handleDialogClose}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}














