import React from 'react';
import AxiosClient from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Trash2 } from 'lucide-react';

export default function ProductDelete({ 
  productId, 
  onProductDeleted 
}) {
  const handleDeleteProduct = async () => {
    try {
      await AxiosClient.delete(`/products/${productId}`);
      
      // Call the callback to update parent component
      onProductDeleted(productId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // Consider adding error handling mechanism
      throw error;
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="icon" 
      onClick={handleDeleteProduct}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}