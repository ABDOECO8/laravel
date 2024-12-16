import React, { useState } from 'react';
import AxiosClient from '../../api/axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Edit } from 'lucide-react';

export default function ProductUpdate({ 
  product, 
  categories, 
  onProductUpdated, 
  trigger 
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    stock: product.stock,
    category_id: product.category_id,
    image: null
  });

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all updated product details to FormData
    Object.keys(updatedProduct).forEach(key => {
      if (updatedProduct[key] !== null && updatedProduct[key] !== '') {
        formData.append(key, updatedProduct[key]);
      }
    });

    // Append method for partial update
    formData.append('_method', 'PUT');

    try {
      const response = await AxiosClient.post(`/products/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Call the callback to update parent component
      onProductUpdated(response.data);
      
      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      // Consider adding error handling mechanism
      throw error;
    }
  };

  const renderTrigger = () => {
    return trigger ? (
      React.cloneElement(trigger, { 
        onClick: () => setIsDialogOpen(true) 
      })
    ) : (
      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
        <Edit className="mr-2 h-4 w-4" /> Modifier
      </Button>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations du produit
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Nom du produit" 
            value={updatedProduct.name} 
            onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Prix du produit" 
            value={updatedProduct.price} 
            onChange={(e) => setUpdatedProduct({...updatedProduct, price: e.target.value})} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Description du produit" 
            value={updatedProduct.description} 
            onChange={(e) => setUpdatedProduct({...updatedProduct, description: e.target.value})} 
          />
          <Input 
            type="number" 
            placeholder="Quantité en stock" 
            value={updatedProduct.stock} 
            onChange={(e) => setUpdatedProduct({...updatedProduct, stock: e.target.value})} 
            required 
          />
          
          <Select 
            value={updatedProduct.category_id.toString()}
            onValueChange={(value) => setUpdatedProduct({...updatedProduct, category_id: value})}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input 
            type="file" 
            onChange={(e) => setUpdatedProduct({...updatedProduct, image: e.target.files[0]})} 
          />
          <Button type="submit">Mettre à jour</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}