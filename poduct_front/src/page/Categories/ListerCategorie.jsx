import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export default function ListerCategorie({ category, onClose }) {
  // Vérifiez si la catégorie est valide
  if (!category) return null;

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la Catégorie</DialogTitle>
          <DialogDescription>Informations détaillées de la catégorie</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {category.image ? (
            <img
              src={category.image} // Utilise directement l'URL retournée par l'API
              alt={category.name}
              className="h-40 w-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'; // Image par défaut si l'image ne charge pas
              }}
            />
          ) : (
            <div className="h-40 w-40 flex items-center justify-center bg-gray-200 rounded-lg">
              Pas d'image
            </div>
          )}
          <h2 className="text-xl font-semibold">{category.name}</h2>
        </div>
      </DialogContent>
    </Dialog>
  );
}
