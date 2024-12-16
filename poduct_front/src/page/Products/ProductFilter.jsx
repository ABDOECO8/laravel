import React from 'react';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';

export default function ProductFilter({ 
  searchTerm, 
  onSearchChange 
}) {
  return (
    <div className="flex items-center space-x-2">
      <Input 
        type="text" 
        placeholder="Rechercher un produit" 
        value={searchTerm} 
        onChange={(e) => onSearchChange(e.target.value)} 
        className="w-64" 
      />
      <Search className="text-gray-500" />
    </div>
  );
}