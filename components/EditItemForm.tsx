'use client';

import { useState } from 'react';
import { Item, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faTag, faShekelSign } from '@fortawesome/free-solid-svg-icons';

interface EditItemFormProps {
  item: Item;
  onSubmit: (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
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

export default function EditItemForm({ item, onSubmit, onClose, settings }: EditItemFormProps) {
  const availableCategories = settings?.categories || defaultCategories;
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    estimatedPrice: item.estimatedPrice?.toString() || '',
    status: item.status,
    actualPrice: item.actualPrice?.toString() || '',
    boughtBy: item.boughtBy || '',
    receiptUrl: item.receiptUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const updateData: any = {
      name: formData.name.trim(),
      category: formData.category,
      estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : undefined,
      status: formData.status,
    };

    // Include bought item data if the status is bought
    if (formData.status === 'bought') {
      updateData.actualPrice = formData.actualPrice ? Number(formData.actualPrice) : undefined;
      updateData.boughtBy = formData.boughtBy || undefined;
      updateData.receiptUrl = formData.receiptUrl || undefined;
    }

    onSubmit(updateData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">עריכת פריט</h2>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              >
                {availableCategories.map((category) => (
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm pr-12"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                  ₪
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                סטטוס
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'bought' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              >
                <option value="pending">ממתין לקנייה</option>
                <option value="bought">נקנה</option>
              </select>
            </div>

            {formData.status === 'bought' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FontAwesomeIcon icon={faShekelSign} className="w-4 h-4 ml-1" />
                    מחיר בפועל
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.actualPrice}
                      onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm pr-12"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                      ₪
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    נקנה על ידי (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={formData.boughtBy}
                    onChange={(e) => setFormData({ ...formData, boughtBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                    placeholder="שם הקונה..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    קישור לקבלה (אופציונלי)
                  </label>
                  <input
                    type="url"
                    value={formData.receiptUrl}
                    onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                    placeholder="https://..."
                  />
                </div>
              </>
            )}

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
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4 ml-1" />
                עדכן פריט
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}