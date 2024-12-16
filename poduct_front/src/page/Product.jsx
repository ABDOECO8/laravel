import React, { useState, useEffect } from 'react';
import AxiosClient from '../api/axios';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import ProductAdd from '../page/Products/ProductAdd';
import ProductDelete from '../page/Products/ProductDelete';
import ProductFilter from '../page/Products/ProductFilter';
import ProductUpdate from '../page/Products/ProductUpdate';
import ProductDetails from '../page/Products/ProductList';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products and categories
  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        AxiosClient.get('/products'),
        AxiosClient.get('/categories')
      ]);

      const productsData = productsResponse.data || [];
      const categoriesData = categoriesResponse.data?.categories || []; // Access categories key
      
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

  // Handle product filtering
  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

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
        
        <ProductFilter 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <ProductAdd
          categories={categories}
          onProductAdded={handleProductAdded}
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {Array.isArray(categories) && categories.find(cat => cat.id === product.category_id)?.name || 'N/A'}
                </TableCell>
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
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedProduct(product)}
                  >
                    ...
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          )}
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
