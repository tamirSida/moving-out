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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">הוספת פריט חדש</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                שם הפריט
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="הכנס שם פריט..."
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FontAwesomeIcon icon={faTag} className="w-4 h-4 ml-1" />
                קטגוריה
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                מחיר משוער (אופציונלי)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm pr-12"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                  ₪
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 ml-1" />
                הוסף פריט
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}