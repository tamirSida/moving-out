'use client';

import { useState } from 'react';
import { Item, Person, PurchaseData } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faUser, faShekelSign, faReceipt, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface PurchaseDialogProps {
  item: Item;
  people: Person[];
  onSubmit: (purchaseData: PurchaseData) => void;
  onClose: () => void;
}

export default function PurchaseDialog({ item, people, onSubmit, onClose }: PurchaseDialogProps) {
  const [formData, setFormData] = useState({
    boughtBy: '',
    actualPrice: item.estimatedPrice?.toString() || '',
    receiptFile: null as File | null,
  });
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);

  const payers = people.filter(person => person.isPayer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.boughtBy || !formData.actualPrice) return;

    onSubmit({
      boughtBy: formData.boughtBy,
      actualPrice: Number(formData.actualPrice),
      receiptUrl: uploadedReceiptUrl || undefined,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, receiptFile: file });

    if (file) {
      await uploadReceiptToCloudinary(file);
    } else {
      setUploadedReceiptUrl(null);
    }
  };

  const uploadReceiptToCloudinary = async (file: File) => {
    setUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload receipt');
      }

      const result = await response.json();
      setUploadedReceiptUrl(result.file.url);
    } catch (error) {
      console.error('Receipt upload error:', error);
      alert('שגיאה בהעלאת הקבלה. אנא נסה שוב.');
      setFormData({ ...formData, receiptFile: null });
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">סימון כנקנה</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
          <p className="text-sm text-gray-600">קטגוריה: {item.category}</p>
          {item.estimatedPrice && (
            <p className="text-sm text-gray-600">
              מחיר משוער: {item.estimatedPrice} ₪
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4 ml-1" />
              מי קנה? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.boughtBy}
              onChange={(e) => setFormData({ ...formData, boughtBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">בחר קונה...</option>
              {payers.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {payers.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">
                אין קונים זמינים. הוסף אנשים בהגדרות.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faShekelSign} className="w-4 h-4 ml-1" />
              מחיר בפועל <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.actualPrice}
              onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 ml-1" />
              העלאת קבלה (אופציונלי)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              disabled={uploadingReceipt}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {uploadingReceipt && (
              <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                <span>מעלה קבלה...</span>
              </div>
            )}
            
            {uploadedReceiptUrl && !uploadingReceipt && (
              <div className="mt-2">
                <p className="text-sm text-green-600 mb-2">
                  ✓ קבלה הועלתה בהצלחה
                </p>
                <img 
                  src={uploadedReceiptUrl} 
                  alt="Receipt preview" 
                  className="max-w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}
            
            {formData.receiptFile && !uploadedReceiptUrl && !uploadingReceipt && (
              <p className="text-sm text-orange-600 mt-1">
                נבחר קובץ: {formData.receiptFile.name} (לא הועלה עדיין)
              </p>
            )}
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
              disabled={!formData.boughtBy || !formData.actualPrice || payers.length === 0}
              className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 ml-1" />
              סמן כנקנה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}