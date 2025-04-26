import { PropertyMap } from '@/components/PropertyMap';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (numPrice >= 1000000) {
    return `$\u00A0${(numPrice / 1000000).toFixed(1)}\u00A0M`;
  } else if (numPrice >= 1000) {
    return `$\u00A0${Math.round(numPrice / 1000)}K`;
  } else {
    return `$\u00A0${numPrice}`;
  }
}

export default function PropertiesMapPage() {
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://dev-different-test-be.onrender.com/properties', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const { data } = await response.json();
        console.log('API Response:', data); // Debug log

        // Handle different response structures
        const propertiesArray = data;

        interface RawProperty {
          id: string | number;
          latitude?: string;
          longitude?: string;
          lat?: string;
          lng?: string;
          price: string | number;
          imageUrl?: string;
          title?: string;
        }

        setProperties(propertiesArray.map((item: RawProperty) => ({
          id: item.id.toString(),
          position: {
            lat: parseFloat(item.latitude ?? item.lat ?? '0'),
            lng: parseFloat(item.longitude ?? item.lng ?? '0'),
          },
          price: `${formatPrice(item.price)}`,
          imageUrl: item.imageUrl || 'https://picsum.photos/400/300?random=1',
          title: item.title || 'Property'
        })));
      } catch (error) {
        console.error('Error fetching properties:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch properties');
      }
    }

    if (user && !loading) {
      fetchProperties();
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view the map</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Properties Map</h1>
        <PropertyMap 
          properties={properties}
          center={{ lat: 40.756795, lng: -73.986139 }}
        />
      </div>
    </div>
  );
}



