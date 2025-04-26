import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

function parseFormattedPrice(formattedPrice: string): number {
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

interface PropertyEditDialogProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export function PropertyDialog({ property, isOpen, onClose, onSave }: PropertyEditDialogProps) {
  const [editedProperty, setEditedProperty] = useState<Property | null>(property);

  // Reset editedProperty when the selected property changes
  useEffect(() => {
    setEditedProperty(property);
  }, [property]);

  const handleSave = () => {
    if (editedProperty) {
      onSave(editedProperty);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        {editedProperty && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedProperty.title}
                onChange={(e) => setEditedProperty(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={editedProperty ? parseFormattedPrice(editedProperty.price) : ''}
                onChange={(e) => {
                  const numericValue = parseFloat(e.target.value);
                  setEditedProperty(prev => prev ? {
                    ...prev,
                    price: numericValue.toString(),
                    numericPrice: numericValue // If you have this field in your Property type
                  } : null);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={editedProperty.imageUrl}
                onChange={(e) => setEditedProperty(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  value={editedProperty.position.lat}
                  onChange={(e) => setEditedProperty(prev => prev ? {
                    ...prev,
                    position: { ...prev.position, lat: parseFloat(e.target.value) }
                  } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  value={editedProperty.position.lng}
                  onChange={(e) => setEditedProperty(prev => prev ? {
                    ...prev,
                    position: { ...prev.position, lng: parseFloat(e.target.value) }
                  } : null)}
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

