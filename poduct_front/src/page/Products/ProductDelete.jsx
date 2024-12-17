import React, { useState } from 'react';
import AxiosClient from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function ProductDelete({ 
  productId, 
  onProductDeleted,
  productName 
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteProduct = async () => {
    try {
      await AxiosClient.delete(`/products/${productId}`);
      onProductDeleted(productId);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="relative">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-yellow-500 mr-3" size={24} />
              <h2 className="text-lg font-semibold text-gray-800">Confirmer la suppression</h2>
            </div>
            <p className="mb-4 text-gray-600">
              Êtes-vous sûr de vouloir supprimer le produit 
              <span className="font-bold ml-1">{productName}</span> ?
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={handleCancelDelete}
              >
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteProduct}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button 
        variant="destructive" 
        size="icon" 
        onClick={handleDeleteConfirmation}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}