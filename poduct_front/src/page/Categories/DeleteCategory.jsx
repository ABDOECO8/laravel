import React from 'react';
import { Button } from '../../components/ui/button';
import { Trash2 } from 'lucide-react';
import AxiosClient from '../../api/axios';

export default function DeleteCategory({ categoryId, onCategoryDeleted }) {
  const handleDeleteCategory = async () => {
    try {
      await AxiosClient.delete(`/categories/${categoryId}`);
      onCategoryDeleted(categoryId); // Callback pour mettre à jour la liste
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDeleteCategory}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
