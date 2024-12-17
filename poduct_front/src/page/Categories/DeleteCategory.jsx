import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Trash2 } from 'lucide-react';
import AxiosClient from '../../api/axios';

export default function DeleteCategory({ categoryId, onCategoryDeleted }) {
  const [showAlert, setShowAlert] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      await AxiosClient.delete(`/categories/${categoryId}`);
      onCategoryDeleted(categoryId); // Callback pour mettre à jour la liste

      // Afficher l'alerte
      setShowAlert(true);
      
      // Masquer l'alerte après 3 secondes
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  return (
    <div>
      {showAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Supprimé !</strong>
          <span className="block sm:inline">La catégorie a été supprimée avec succès.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fermer</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <Button variant="destructive" size="icon" onClick={handleDeleteCategory}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
