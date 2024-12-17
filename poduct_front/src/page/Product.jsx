import React, { useState, useEffect } from 'react';
import AxiosClient from '../api/axios';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ProductAdd from '../page/Products/ProductAdd';
import ProductDelete from '../page/Products/ProductDelete';
import ProductFilter from '../page/Products/ProductFilter';
import ProductUpdate from '../page/Products/ProductUpdate';
import ProductDetails from '../page/Products/ProductList';
import { ArrowUpDown } from 'lucide-react'; // Icon for sorting

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
  const [productsPerPage] = useState(5); // Number of products per page

  // New state for sorting
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
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data');
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

  // Function to handle sorting
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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto mt-10 p-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">Produits</h1>

        <div className="flex items-center space-x-4">
          <ProductFilter 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          {/* Category filter */}
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
      
      {/* Product Table */}
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

      {/* Pagination */}
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
