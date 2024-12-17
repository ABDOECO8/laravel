import React, { useState, useEffect } from 'react';
import AxiosClient from '../api/axios';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ProductAdd from '../page/Products/ProductAdd';
import ProductDelete from '../page/Products/ProductDelete';
import ProductFilter from '../page/Products/ProductFilter';
import ProductUpdate from '../page/Products/ProductUpdate';
import ProductDetails from '../page/Products/ProductList';
import { ArrowUpDown } from 'lucide-react'; // Icône pour le tri

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
  
  // Nouvel état pour le tri
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Fetch products and categories
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
      console.error('Erreur lors de la récupération des données:', error);
      setError('Une erreur est survenue lors de la récupération des données');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle product filtering and sorting
  useEffect(() => {
    let results = products;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter(product => 
        product.category_id === selectedCategory
      );
    }

    // Sorting logic
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

  // Fonction pour gérer le tri
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle product addition
  const handleProductAdded = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setIsAddDialogOpen(false);
  };

  // Handle product deletion
  const handleProductDeleted = (productId) => {
    const updatedProducts = products.filter(prod => prod.id !== productId);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  // Handle product update
  const handleProductUpdated = (updatedProduct) => {
    const updatedProducts = products.map(prod =>
      prod.id === updatedProduct.id ? updatedProduct : prod
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Produits</h1>
        
        <div className="flex items-center space-x-4">
          <ProductFilter 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          {/* Filtrage par catégorie */}
          <Select 
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? null : Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
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
      
      {/* Tableau des produits */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              onClick={() => handleSort('id')}
              className="cursor-pointer hover:bg-gray-100 flex items-center"
            >
              ID 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead 
              onClick={() => handleSort('name')}
              className="cursor-pointer hover:bg-gray-100 flex items-center"
            >
              Nom 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead 
              onClick={() => handleSort('price')}
              className="cursor-pointer hover:bg-gray-100 flex items-center"
            >
              Prix 
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {categories.find(cat => cat.id === product.category_id)?.name || 'Non catégorisé'}
              </TableCell>
              <TableCell>{product.price} €</TableCell>
              <TableCell className="flex space-x-2">
                <ProductUpdate 
                  product={product}
                  categories={categories}
                  onProductUpdated={handleProductUpdated}
                />
                <ProductDelete 
                  productId={product.id}
                  onProductDeleted={handleProductDeleted}
                />
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="text-blue-500 hover:underline"
                >
                  Détails
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}