import React, { useEffect, useState } from 'react';
import AxiosClient from '../api/axios';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import AddCategory from '../page/Categories/AddCategory';
import EditCategory from '../page/Categories/EditCategory';
import DeleteCategory from '../page/Categories/DeleteCategory';
import FilterCategory from '../page/Categories/FilterCategory';
import ListerCategorie from '../page/Categories/ListerCategorie';

export default function Categorie() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // État pour gérer la direction du tri

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosClient.get('/categories');
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error('Format de données invalide:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        setCategories([]); // Remet un tableau vide en cas d'erreur
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
      }
    });

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
    alert(`La catégorie "${newCategory.name}" a été ajoutée avec succès!`); // Affiche un message de succès pour l'ajout
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(
      categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  const handleCategoryDeleted = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    alert('La catégorie a été supprimée avec succès!'); // Affiche un message de succès pour la suppression
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <div className="flex space-x-2 items-center">
          <FilterCategory searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          <button
            onClick={toggleSortDirection}
            className="text-blue-500 hover:text-blue-700"
          >
            {sortDirection === 'asc' ? 'Tri décroissant' : 'Tri croissant'}
          </button>
        </div>
        <AddCategory onCategoryAdded={handleCategoryAdded} categories={categories} /> {/* Passage de categories comme prop */}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2 items-center">
                  <EditCategory
                    category={category}
                    onCategoryUpdated={handleCategoryUpdated}
                    trigger={<button className="text-blue-500 hover:text-blue-700">Modifier</button>}
                  />
                  <DeleteCategory
                    categoryId={category.id}
                    onCategoryDeleted={handleCategoryDeleted}
                  />
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedCategory(category)}
                  >
                    ...
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCategory && (
        <ListerCategorie
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
