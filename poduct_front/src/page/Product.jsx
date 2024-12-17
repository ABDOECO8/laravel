import React, { useState, useEffect } from 'react';
import AxiosClient from '../api/axios';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ProductAdd from '../page/Products/ProductAdd';
import ProductDelete from '../page/Products/ProductDelete';
import ProductFilter from '../page/Products/ProductFilter';
import ProductUpdate from '../page/Products/ProductUpdate';
import ProductDetails from '../page/Products/ProductList';
import { ArrowUpDown } from 'lucide-react';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [alert, setAlert] = useState({
    show: false,
    type: '',
    message: ''
  });

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
      <div role="alert" className="fixed inset-x-0 top-4 z-50 flex justify-center">
        <div className={`w-full max-w-md rounded shadow-lg ${alertStyles?.container}`}>
          <div className={`${alertStyles?.header} font-bold rounded-t px-4 py-2`}>
            {alertStyles?.title}
          </div>
          <div className={`border border-t-0 ${alertStyles?.container} rounded-b px-4 py-3`}>
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

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        AxiosClient.get('/products'),
        AxiosClient.get('/categories')
      ]);

      const productsData = productsResponse.data || [];
      const categoriesData = categoriesResponse.data?.categories || [];

      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data');
      showAlert('error', 'Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let results = products;
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      results = results.filter(product => 
        product.category_id === selectedCategory
      );
    }
    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, products, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleProductAdded = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setIsAddDialogOpen(false);
    showAlert('add', 'Produit ajouté avec succès');
  };

  const handleProductDeleted = (productId) => {
    const updatedProducts = products.filter(prod => prod.id !== productId);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    showAlert('delete', 'Produit supprimé avec succès');
  };

  const handleProductUpdated = (updatedProduct) => {
    const updatedProducts = products.map(prod =>
      prod.id === updatedProduct.id ? updatedProduct : prod
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    showAlert('update', 'Produit mis à jour avec succès');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="container mx-auto mt-10 p-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-lg">
      {renderAlert()}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">Produits</h1>

        <div className="flex items-center space-x-4">
          <ProductFilter 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <Select 
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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

          <ProductAdd
            categories={categories}
            onProductAdded={handleProductAdded}
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />
        </div>
      </div>
      
      <Table className="shadow-md rounded-lg overflow-hidden bg-white">
        <TableHeader className="bg-blue-300 text-white">
          <TableRow>
            <TableHead 
              onClick={() => handleSort('id')}
              className="cursor-pointer px-6 py-2 text-left"
            >
              ID 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead 
              onClick={() => handleSort('name')}
              className="cursor-pointer px-6 py-2 text-left"
            >
              Name 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead className="text-left">Category</TableHead>
            <TableHead 
              onClick={() => handleSort('price')}
              className="cursor-pointer px-6 py-2 text-left"
            >
              Price 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product.id} className="border-b border-gray-200">
              <TableCell className="px-6 py-4">{product.id}</TableCell>
              <TableCell className="px-6 py-4">{product.name}</TableCell>
              <TableCell className="px-6 py-4">
                {categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}
              </TableCell>
              <TableCell className="px-6 py-4">{product.price} €</TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex space-x-3 items-center">
                  <ProductUpdate 
                    product={product}
                    categories={categories}
                    onProductUpdated={handleProductUpdated}
                  />
                  <ProductDelete 
                    productId={product.id}
                    onProductDeleted={handleProductDeleted}
                    productName={product.name}
                  />
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Details
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${index + 1 === currentPage ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-blue-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}