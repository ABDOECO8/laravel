import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import AxiosClient from '../../api/axios';

export default function DeleteCategory({ categoryId, onCategoryDeleted, categoryName }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteCategory = async () => {
    try {
      await AxiosClient.delete(`/categories/${categoryId}`);
      onCategoryDeleted(categoryId);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
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
              Êtes-vous sûr de vouloir supprimer la catégorie 
              <span className="font-bold ml-1">{categoryName}</span> ?
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
                onClick={handleDeleteCategory}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button variant="destructive" size="icon" onClick={handleDeleteConfirmation}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}