import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AxiosClient from '../../api/axios';
import ImageUploadPreview from '../../components/ImageUploadPreview';

export default function AddCategory({ onCategoryAdded, categories }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Nouvel état pour le message de succès

  const handleAddCategory = async (e) => {
    e.preventDefault();
  
    // Vérifier si le nom de la catégorie est vide
    if (!newCategory.name.trim()) {
      setErrorMessage('Le nom de la catégorie ne peut pas être vide.');
      setSuccessMessage(''); // Réinitialiser le message de succès
      return;
    }
  
    // Vérifier si le nom de la catégorie existe déjà
    if (categories.some(category => category.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setErrorMessage('Une catégorie avec ce nom existe déjà. Veuillez choisir un autre nom.');
      setSuccessMessage(''); // Réinitialiser le message de succès
      return;
    }
  
    const formData = new FormData();
    formData.append('name', newCategory.name);
    if (newCategory.image) formData.append('image', newCategory.image);
  
    try {
      const response = await AxiosClient.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCategoryAdded(response.data); // Appeler un callback pour mettre à jour les catégories
      setNewCategory({ name: '', image: null });
      setIsAddDialogOpen(false); // Fermer le dialogue
      setErrorMessage('');
      setSuccessMessage(`La catégorie "${newCategory.name}" a été ajoutée avec succès!`); // Message de succès
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de l\'ajout de la catégorie.');
      setSuccessMessage(''); // Réinitialiser le message de succès
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };

  return (
    <div>
      {/* Afficher le message de succès si présent */}
      {successMessage && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="font-bold">Succès</p>
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Ajouter une catégorie</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              type="text"
              placeholder="Nom de la catégorie"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
            
            <ImageUploadPreview 
              onFileSelect={(files) => setNewCategory({ ...newCategory, image: files[0] })} 
              maxFiles={1} 
              maxSizeInMB={5} 
            />
            
            {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Affichage du message d'erreur */}
            <Button type="submit">Ajouter</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
