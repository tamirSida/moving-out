'use client';

import { useState } from 'react';
import { Item, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface SearchAndFilterProps {
  items: Item[];
  onFilteredItems: (filteredItems: Item[]) => void;
  settings?: AppSettings | null;
}

const defaultCategories = [
  'ריהוט',
  'מוצרי חשמל',
  'מטבח',
  'אמבטיה',
  'דקורציה',
  'ציוד ניקיון',
  'מצעים',
  'אחסון',
  'אחר'
];

type SortOption = 'name' | 'category' | 'price-low' | 'price-high' | 'none';

export default function SearchAndFilter({ items, onFilteredItems, settings }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  const availableCategories = settings?.categories || defaultCategories;

  // Get unique categories from current items
  const itemCategories = Array.from(new Set(items.map(item => item.category)));
  const displayCategories = itemCategories.length > 0 ? itemCategories : availableCategories;

  const applyFilters = (search: string, category: string, sort: SortOption) => {
    let filtered = [...items];

    // Search by name
    if (search.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    // Sort items
    switch (sort) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'he'));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category, 'he'));
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = a.status === 'bought' ? (a.actualPrice || 0) : (a.estimatedPrice || 0);
          const priceB = b.status === 'bought' ? (b.actualPrice || 0) : (b.estimatedPrice || 0);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = a.status === 'bought' ? (a.actualPrice || 0) : (a.estimatedPrice || 0);
          const priceB = b.status === 'bought' ? (b.actualPrice || 0) : (b.estimatedPrice || 0);
          return priceB - priceA;
        });
        break;
    }

    onFilteredItems(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, selectedCategory, sortBy);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category, sortBy);
  };

  const handleSort = (sort: SortOption) => {
    setSortBy(sort);
    applyFilters(searchTerm, selectedCategory, sort);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('none');
    onFilteredItems(items);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'none';

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      {/* Toggle Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">חיפוש וסינון</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              פעיל
            </span>
          )}
        </div>
        <FontAwesomeIcon 
          icon={isExpanded ? faChevronUp : faChevronDown} 
          className="w-4 h-4 text-gray-500 transition-transform" 
        />
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Search Bar */}
          <div className="relative mt-4">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="חפש לפי שם פריט..."
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faFilter} className="w-3 h-3 ml-1" />
                סינון לפי קטגוריה
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">כל הקטגוריות</option>
                {displayCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faSort} className="w-3 h-3 ml-1" />
                מיון
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as SortOption)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">ללא מיון</option>
                <option value="name">לפי שם (א-ת)</option>
                <option value="category">לפי קטגוריה</option>
                <option value="price-low">לפי מחיר (נמוך-גבוה)</option>
                <option value="price-high">לפי מחיר (גבוה-נמוך)</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  נקה הכל
                </button>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  חיפוש: "{searchTerm}"
                  <button onClick={() => handleSearch('')} className="hover:text-blue-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  קטגוריה: {selectedCategory}
                  <button onClick={() => handleCategoryFilter('all')} className="hover:text-green-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'none' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  מיון: {sortBy === 'name' ? 'שם' : sortBy === 'category' ? 'קטגוריה' : 'מחיר'}
                  <button onClick={() => handleSort('none')} className="hover:text-purple-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}