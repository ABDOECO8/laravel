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
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  
  const [alert, setAlert] = useState({
    show: false,
    type: '',
    message: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosClient.get('/categories');
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error('Format de données invalide:', response.data);
          showAlert('error', 'Format de données invalide');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        showAlert('error', 'Erreur lors de la récupération des catégories');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  const renderAlert = () => {
    if (!alert.show) return null;

    const alertStyles = {
      add: {
        container: 'bg-blue-100 border-blue-400 text-blue-700',
        header: 'bg-blue-500 text-white',
        title: 'Ajout'
      },
      delete: {
        container: 'bg-red-100 border-red-400 text-red-700',
        header: 'bg-red-500 text-white',
        title: 'Suppression'
      },
      update: {
        container: 'bg-green-100 border-green-400 text-green-700',
        header: 'bg-green-500 text-white',
        title: 'Mise à jour'
      },
      error: {
        container: 'bg-red-100 border-red-400 text-red-700',
        header: 'bg-red-500 text-white',
        title: 'Erreur'
      }
    }[alert.type];

    return (
      <div 
        role="alert" 
        className="fixed inset-x-0 top-4 z-50 flex justify-center"
      >
        <div className={`w-full max-w-md rounded shadow-lg ${alertStyles.container}`}>
          <div className={`${alertStyles.header} font-bold rounded-t px-4 py-2`}>
            {alertStyles.title}
          </div>
          <div className={`border border-t-0 ${alertStyles.container} rounded-b px-4 py-3`}>
            <p>{alert.message}</p>
            <button 
              onClick={() => setAlert({ show: false, type: '', message: '' })}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  };

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
    showAlert('add', 'Catégorie ajoutée avec succès');
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(
      categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    showAlert('update', 'Catégorie modifiée avec succès');
  };

  const handleCategoryDeleted = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    showAlert('delete', 'Catégorie supprimée avec succès');
  };

  // Rest of the component remains the same
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto mt-10 p-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-lg">
      {renderAlert()}

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
        <AddCategory 
          onCategoryAdded={handleCategoryAdded} 
          categories={categories} 
        />
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
          {currentCategories.map((category) => (
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
                    categoryName={category.name}
                  />
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedCategory(category)}
                  >
                    Détails
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(filteredCategories.length / categoriesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${index + 1 === currentPage ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <ListerCategorie
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}