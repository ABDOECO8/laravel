import React, { useState } from 'react';
import AxiosClient from '../../api/axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus } from 'lucide-react';
import ImageUploadPreview from '../../components/ImageUploadPreview';

export default function ProductAdd({ categories, onProductAdded, isOpen, onOpenChange }) {
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    stock: 0, 
    category_id: '', 
    image: null 
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Message de succès

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur avant chaque soumission
    setSuccessMessage(''); // Réinitialiser le message de succès avant chaque soumission

    // Validation des champs
    if (!newProduct.name.trim()) {
      setErrorMessage('Le nom du produit ne peut pas être vide.');
      return;
    }

    if (parseFloat(newProduct.price) <= 0) {
      setErrorMessage('Le prix du produit doit être supérieur à 0.');
      return;
    }

    if (parseInt(newProduct.stock) <= 0) {
      setErrorMessage('La quantité en stock doit être supérieure à 0.');
      return;
    }

    if (!newProduct.category_id) {
      setErrorMessage('La catégorie du produit doit être sélectionnée.');
      return;
    }

    // Vérification si le produit existe déjà dans la même catégorie
    try {
      const response = await AxiosClient.get('/products', {
        params: {
          name: newProduct.name,
          category_id: newProduct.category_id
        }
      });

      if (response.data && response.data.length > 0) {
        const existingProduct = response.data.find(
          product => 
            product.name.toLowerCase().trim() === newProduct.name.toLowerCase().trim() && 
            product.category_id.toString() === newProduct.category_id.toString()
        );

        if (existingProduct) {
          setErrorMessage('Un produit avec le même nom existe déjà dans cette catégorie.');
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du produit existant:', error);
    }

    const formData = new FormData();

    Object.keys(newProduct).forEach(key => {
      if (newProduct[key] !== null && newProduct[key] !== '') {
        formData.append(key, newProduct[key]);
      }
    });

    try {
      const response = await AxiosClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onProductAdded(response.data); // Mettre à jour le parent avec le produit ajouté
      setNewProduct({ 
        name: '', 
        price: '', 
        description: '', 
        stock: 0, 
        category_id: '', 
        image: null 
      });

      setSuccessMessage('Le produit a été ajouté avec succès !'); // Afficher le message de succès
      onOpenChange(false); // Fermer le dialogue après l'ajout réussi
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setErrorMessage('Une erreur est survenue lors de l\'ajout du produit.');
    }
  };

  return (
    <div>
      {/* Affichage du message de succès */}
      {successMessage && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="font-bold">Succès</p>
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

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
              type="number" 
              step="0.01"
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

            <ImageUploadPreview 
              onFileSelect={(files) => setNewProduct({...newProduct, image: files[0]})} 
              maxFiles={1} 
              maxSizeInMB={5} 
            />
            
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <Button type="submit">Ajouter</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
