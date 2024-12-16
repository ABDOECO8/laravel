import React, { useState } from 'react';
import AxiosClient from '../../api/axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus } from 'lucide-react';

export default function ProductAdd({ categories, onProductAdded, isOpen, onOpenChange }) {
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    stock: 0, 
    category_id: '', 
    image: null 
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all product details to FormData
    Object.keys(newProduct).forEach(key => {
      if (newProduct[key] !== null && newProduct[key] !== '') {
        formData.append(key, newProduct[key]);
      }
    });

    try {
      const response = await AxiosClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Call the callback to update parent component
      onProductAdded(response.data);
      
      // Reset form
      setNewProduct({ 
        name: '', 
        price: '', 
        description: '', 
        stock: 0, 
        category_id: '', 
        image: null 
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      // Consider adding error handling mechanism
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2" /> Ajouter un produit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau produit
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Nom du produit" 
            value={newProduct.name} 
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Prix du produit" 
            value={newProduct.price} 
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Description du produit" 
            value={newProduct.description} 
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
          />
          <Input 
            type="number" 
            placeholder="Quantité en stock" 
            value={newProduct.stock} 
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
            required 
          />
          
          <Select 
            value={newProduct.category_id}
            onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}
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
            onChange={(e) => setNewProduct({...newProduct, image: e.target.files[0]})} 
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
