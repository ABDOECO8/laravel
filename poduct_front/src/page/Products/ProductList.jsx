import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export default function ProductDetails({ product, onClose }) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du Produit</DialogTitle>
          <DialogDescription>Informations détaillées du produit</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'; // Default image if the image fails to load
              }}
            />
          ) : (
            <div className="h-40 w-40 flex items-center justify-center bg-gray-200 rounded-lg">
              Pas d'image
            </div>
          )}
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-center">{product.description}</p>
          <p className="text-center">Prix: {product.price} €</p>
          <p className="text-center">Stock: {product.stock}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
