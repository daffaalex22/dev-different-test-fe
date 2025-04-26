import { PropertyMap } from '@/components/PropertyMap';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Slider } from "@/components/ui/slider";

interface Property {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  price: string;
  numericPrice: number;
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
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calculate the absolute min and max prices from the data
  const minMaxPrices = properties.length > 0
    ? {
      min: Math.min(...properties.map(p => p.numericPrice)),
      max: Math.max(...properties.map(p => p.numericPrice))
    }
    : { min: 0, max: 10000000 };

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
          image_url?: string;
          title?: string;
        }

        const mappedProperties = propertiesArray.map((item: RawProperty) => {
          const numericPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
          return {
            id: item.id.toString(),
            position: {
              lat: parseFloat(item.latitude ?? item.lat ?? '0'),
              lng: parseFloat(item.longitude ?? item.lng ?? '0'),
            },
            price: `${formatPrice(item.price)}`,
            numericPrice,
            imageUrl: item.image_url || 'https://picsum.photos/400/300?random=1',
            title: item.title || 'Property'
          };
        });

        setProperties(mappedProperties);

        // Initialize price range based on actual data
        const minPrice = Math.min(...mappedProperties.map((p: Property) => p.numericPrice));
        const maxPrice: number = Math.max(...mappedProperties.map((p: Property) => p.numericPrice));
        setPriceRange([minPrice, maxPrice]);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch properties');
      }
    }

    if (user && !loading) {
      fetchProperties();
    }
  }, [user, loading]);

  // Filter properties when price range changes
  useEffect(() => {
    const filtered = properties.filter(
      property => property.numericPrice >= priceRange[0] && property.numericPrice <= priceRange[1]
    );
    setFilteredProperties(filtered);
  }, [properties, priceRange]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view the map</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;

  return (
    <div className="bg-muted min-h-svh">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Properties Map</h1>

        {/* Price range slider */}
        <div className="mb-8 max-w-xl">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
            <span className="text-sm text-muted-foreground">
              {filteredProperties.length} properties
            </span>
          </div>

          <Slider
            defaultValue={[minMaxPrices.min, minMaxPrices.max]}
            value={priceRange}
            min={minMaxPrices.min}
            max={minMaxPrices.max}
            step={(minMaxPrices.max - minMaxPrices.min) / 100}
            onValueChange={(value: [number, number]) => setPriceRange(value)}
            className="mb-6"
          />
        </div>

        <div className="rounded-lg overflow-hidden">
          <PropertyMap
            properties={filteredProperties}
            center={{ lat: 40.756795, lng: -73.986139 }}
          />
        </div>
      </div>
    </div>
  );
}






