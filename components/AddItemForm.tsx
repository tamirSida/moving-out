'use client';

import { useState } from 'react';
import { Item } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTag, faShekelSign } from '@fortawesome/free-solid-svg-icons';

interface AddItemFormProps {
  onSubmit: (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const categories = [
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

export default function AddItemForm({ onSubmit, onClose }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    estimatedPrice: '',
    status: 'pending' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : undefined,
      status: formData.status,
    });

    setFormData({
      name: '',
      category: categories[0],
      estimatedPrice: '',
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">הוספת פריט חדש</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם הפריט
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="הכנס שם פריט..."
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faTag} className="w-4 h-4 ml-1" />
              קטגוריה
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faShekelSign} className="w-4 h-4 ml-1" />
              מחיר משוער (אופציונלי)
            </label>
            <input
              type="number"
              value={formData.estimatedPrice}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 ml-1" />
              הוסף פריט
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}