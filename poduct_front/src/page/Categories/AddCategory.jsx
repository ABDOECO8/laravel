import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AxiosClient from '../../api/axios';

export default function AddCategory({ onCategoryAdded }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: null });

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCategory.name);
    if (newCategory.image) formData.append('image', newCategory.image);

    try {
      const response = await AxiosClient.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCategoryAdded(response.data); // Appeler un callback pour mettre à jour les catégories
      setNewCategory({ name: '', image: null });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };

  return (
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
          <Input
            type="file"
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
