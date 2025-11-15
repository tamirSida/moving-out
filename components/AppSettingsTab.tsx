'use client';

import { useState } from 'react';
import { AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTag, faShekelSign, faEdit, faTrash, faCheck, faBudget } from '@fortawesome/free-solid-svg-icons';

interface AppSettingsTabProps {
  settings: AppSettings | null;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
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

export default function AppSettingsTab({ settings, onUpdateSettings }: AppSettingsTabProps) {
  const [budget, setBudget] = useState(settings?.budget?.toString() || '');
  const [categories, setCategories] = useState(settings?.categories || defaultCategories);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  const handleSaveBudget = () => {
    const budgetNumber = budget ? parseFloat(budget) : undefined;
    onUpdateSettings({ budget: budgetNumber });
  };

  const handleSaveCategories = () => {
    onUpdateSettings({ categories });
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const newCategories = [...categories, newCategory.trim()];
      setCategories(newCategories);
      setNewCategory('');
      onUpdateSettings({ categories: newCategories });
    }
  };

  const removeCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    onUpdateSettings({ categories: newCategories });
  };

  const startEditCategory = (index: number) => {
    setEditingCategory(index);
    setEditCategoryValue(categories[index]);
  };

  const saveEditCategory = (index: number) => {
    if (editCategoryValue.trim() && !categories.includes(editCategoryValue.trim())) {
      const newCategories = [...categories];
      newCategories[index] = editCategoryValue.trim();
      setCategories(newCategories);
      setEditingCategory(null);
      onUpdateSettings({ categories: newCategories });
    }
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryValue('');
  };

  return (
    <div className="space-y-8">
      {/* Budget Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faShekelSign} className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-green-800">תקציב למעבר</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-2">
              הגדר תקציב כולל (אופציונלי)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm pr-12"
                  placeholder="הכנס תקציב..."
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-green-500">
                  ₪
                </div>
              </div>
              <button
                onClick={handleSaveBudget}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                שמור
              </button>
            </div>
          </div>
          
          {settings?.budget && (
            <div className="bg-white/60 rounded-lg p-4 border border-green-200">
              <p className="text-green-700 font-medium">
                התקציב הנוכחי: <span className="text-xl font-bold">{settings.budget.toFixed(2)} ₪</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faTag} className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-blue-800">ניהול קטגוריות</h3>
        </div>

        {/* Add New Category */}
        <div className="mb-6 bg-white/60 rounded-lg p-4 border border-blue-200">
          <label className="block text-sm font-semibold text-blue-700 mb-3">
            הוסף קטגוריה חדשה
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="שם הקטגוריה..."
            />
            <button
              onClick={addCategory}
              disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 ml-1" />
              הוסף
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div>
          <h4 className="font-semibold text-blue-800 mb-4">קטגוריות קיימות ({categories.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/80 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                {editingCategory === index ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editCategoryValue}
                      onChange={(e) => setEditCategoryValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEditCategory(index);
                        if (e.key === 'Escape') cancelEditCategory();
                      }}
                      className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEditCategory(index)}
                      className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                    </button>
                    <button
                      onClick={cancelEditCategory}
                      className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditCategory(index)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeCategory(index)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}