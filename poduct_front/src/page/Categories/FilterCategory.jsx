import React from 'react';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';

export default function FilterCategory({ searchTerm, onSearchTermChange }) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Rechercher une catégorie"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      <Search className="text-gray-500" />
    </div>
  );
}
