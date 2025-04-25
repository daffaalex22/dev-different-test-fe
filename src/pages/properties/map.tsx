import { PropertyMap } from '@/components/PropertyMap';

// Example data, should be from API
const sampleProperties = [
  {
    id: '1',
    position: { lat: 40.756795, lng: -73.986139 },
    price: '$4.5M',
    imageUrl: '/images/property1.jpg',
    title: 'Luxury Apartment in Times Square'
  },
  {
    id: '2',
    position: { lat: 40.757995, lng: -73.984939 },
    price: '$5.4M',
    imageUrl: '/images/property2.jpg',
    title: 'Premium Penthouse near Bryant Park'
  },
  {
    id: '3',
    position: { lat: 40.755595, lng: -73.987339 },
    price: '$4.8M',
    imageUrl: '/images/property3.jpg',
    title: 'Modern Loft in Theater District'
  },
  {
    id: '4',
    position: { lat: 40.756195, lng: -73.984839 },
    price: '$4.9M',
    imageUrl: '/images/property4.jpg',
    title: 'Elegant Condo on 5th Avenue'
  },
  {
    id: '5',
    position: { lat: 40.757195, lng: -73.987939 },
    price: '$5.2M',
    imageUrl: '/images/property5.jpg',
    title: 'Spacious Apartment near Broadway'
  }
];

export default function PropertiesMapPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Properties Map</h1>
        <PropertyMap 
          properties={sampleProperties}
          center={{ lat: 40.756795, lng: -73.986139 }}
        />
      </div>
    </div>
  );
}
