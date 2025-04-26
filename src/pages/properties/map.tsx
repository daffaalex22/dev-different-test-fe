import { PropertyMap } from '@/components/PropertyMap';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { toast } from 'sonner';

interface Property {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  price: string;
  numericPrice?: number;
  imageUrl: string;
  title: string;
}

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

export function parseFormattedPrice(formattedPrice: string): number {
  // Remove '$' and any whitespace
  const cleanPrice = formattedPrice.replace(/[$\s]/g, '');

  // Handle millions (M)
  if (cleanPrice.includes('M')) {
    const baseNumber = parseFloat(cleanPrice.replace('M', ''));
    return baseNumber * 1000000;
  }

  // Handle thousands (K)
  if (cleanPrice.includes('K')) {
    const baseNumber = parseFloat(cleanPrice.replace('K', ''));
    return baseNumber * 1000;
  }

  // Handle regular numbers
  return parseFloat(cleanPrice);
}

export default function PropertiesMapPage() {
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handlePropertyUpdate = async (updatedProperty: Property) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Transform the property data to match RawProperty interface
      const propertyToUpdate: RawProperty = {
        id: updatedProperty.id,
        latitude: updatedProperty.position.lat.toString(),
        longitude: updatedProperty.position.lng.toString(),
        price: parseFormattedPrice(updatedProperty.price), // Convert formatted price to number
        image_url: updatedProperty.imageUrl,
        title: updatedProperty.title
      };

      const response = await fetch(`https://dev-different-test-be.onrender.com/properties/${updatedProperty.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyToUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      // Update local state
      setProperties(prevProperties =>
        prevProperties.map(prop =>
          prop.id === updatedProperty.id
            ? updatedProperty
            : prop
        )
      );

      toast.success('Property updated successfully');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  const handlePropertyDelete = async (propertyToDelete: Property) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://dev-different-test-be.onrender.com/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      // Update local state by removing the deleted property
      setProperties(prevProperties =>
        prevProperties.filter(prop => prop.id !== propertyToDelete.id)
      );

      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  // Calculate the absolute min and max prices from the data
  const minMaxPrices = properties.length > 0
    ? {
      min: Math.min(...properties.map(p => p.numericPrice).filter((n): n is number => typeof n === 'number')),
      max: Math.max(...properties.map(p => p.numericPrice).filter((n): n is number => typeof n === 'number'))
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

        // Handle different response structures
        const propertiesArray = data;

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
        const numericPrices: number[] = mappedProperties
          .map((p: Property) => p.numericPrice)
          .filter((n: unknown): n is number => typeof n === 'number');
        const minPrice = Math.min(...numericPrices);
        const maxPrice: number = Math.max(...numericPrices);
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
      property =>
        typeof property.numericPrice === 'number' &&
        property.numericPrice >= priceRange[0] &&
        property.numericPrice <= priceRange[1]
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

        {/* Price range slider and logout button container */}
        <div className="mb-8 w-full flex items-center justify-between">
          <div className="flex-1 max-w-xl">
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

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="ml-4 flex-1 max-w-xs cursor-pointer"
          >
            Logout
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden">
          <PropertyMap
            properties={filteredProperties}
            center={{ lat: 40.756795, lng: -73.986139 }}
            onPropertyUpdate={(property: Property) => {
              void handlePropertyUpdate(property);
            }}
            onPropertyDelete={(property: Property) => {
              void handlePropertyDelete(property);
            }}
          />
        </div>
      </div>
    </div>
  );
}



















