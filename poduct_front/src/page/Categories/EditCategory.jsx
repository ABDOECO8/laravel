import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import AxiosClient from '../../api/axios';
import { Edit } from 'lucide-react';

export default function EditCategory({ category, onCategoryUpdated, trigger }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState({ 
    name: category?.name || '', 
    image: null 
  });

  useEffect(() => {
    if (category) {
      setUpdatedCategory({ name: category.name, image: null });
    }
  }, [category]);

  const handleEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedCategory.name);
    if (updatedCategory.image) {
      formData.append('image', updatedCategory.image);
    }

    // Append method for partial update
    formData.append('_method', 'PUT');

    try {
      const response = await AxiosClient.post(`/categories/${category.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCategoryUpdated(response.data); // Callback to update the category
      setIsDialogOpen(false); // Close dialog
    } catch (error) {
      console.error('Error updating category:', error);
      // Consider adding error handling mechanism
    }
  };

  const renderTrigger = () => {
    return trigger ? (
      React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })
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
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>Modifiez les informations de la catégorie.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditCategory} className="space-y-4">
          <Input
            type="text"
            placeholder="Nom de la catégorie"
            value={updatedCategory.name}
            onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
            required
          />
          <Input
            type="file"
            onChange={(e) => setUpdatedCategory({ ...updatedCategory, image: e.target.files[0] })}
          />
          <Button type="submit">Modifier</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
