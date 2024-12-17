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
  const [sortDirection, setSortDirection] = useState('asc');

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
        setCategories([]);
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
    alert(`La catégorie "${newCategory.name}" a été ajoutée avec succès!`);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(
      categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  const handleCategoryDeleted = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    alert('La catégorie a été supprimée avec succès!');
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">Gestion des Catégories</h1>
        <div className="flex space-x-4 items-center">
          <FilterCategory searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          <button
            onClick={toggleSortDirection}
            className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-md transition"
          >
            {sortDirection === 'asc' ? 'Tri décroissant' : 'Tri croissant'}
          </button>
        </div>
        <AddCategory onCategoryAdded={handleCategoryAdded} categories={categories} />
      </div>

      <Table className="shadow-md rounded-lg overflow-hidden bg-white">
        <TableHeader className="bg-blue-300 text-white">
          <TableRow>
            <TableHead className="px-6 py-2">ID</TableHead>
            <TableHead className="px-6 py-3">Nom</TableHead>
            <TableHead className="px-6 py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category.id} className="border-b border-gray-200">
              <TableCell className="px-6 py-4">{category.id}</TableCell>
              <TableCell className="px-6 py-4 text-lg font-medium text-gray-900">{category.name}</TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex space-x-3 items-center">
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
                    <span className="text-xl">...</span>
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
