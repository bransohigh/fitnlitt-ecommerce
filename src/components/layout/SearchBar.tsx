import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export const SearchBar: React.FC = () => {
  const { collections } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', { query: searchQuery, category: selectedCategory });
    // TODO: Navigate to search results
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
      <div className="relative flex items-center">
        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="absolute left-0 h-full px-4 pr-8 bg-transparent border-r border-gray-200 text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none z-10"
          style={{ width: 'auto', minWidth: '100px' }}
        >
          <option value="all">Tümü</option>
          {collections.map((col) => (
            <option key={col.id} value={col.slug}>
              {col.name}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="w-full h-11 pl-28 pr-12 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-coral)] focus:border-transparent transition-shadow"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-2 p-2 bg-[var(--brand-black)] text-white rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Ara"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
