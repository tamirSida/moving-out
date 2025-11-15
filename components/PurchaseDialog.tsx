'use client';

import { useState } from 'react';
import { Item, Person, PurchaseData } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faUser, faShekelSign, faReceipt, faSpinner, faUpload, faImage } from '@fortawesome/free-solid-svg-icons';

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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 ml-1" />
              העלאת קבלה (אופציונלי)
            </label>
            
            {/* Custom Upload Button */}
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                disabled={uploadingReceipt}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className={`
                  flex items-center justify-center gap-3 w-full py-4 px-4 
                  border-2 border-dashed rounded-lg transition-all duration-200
                  ${uploadingReceipt 
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                    : uploadedReceiptUrl
                      ? 'bg-green-50 border-green-300 hover:bg-green-100'
                      : 'bg-blue-50 border-blue-300 hover:bg-blue-100 cursor-pointer'
                  }
                `}
              >
                {uploadingReceipt ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-blue-700 font-medium">מעלה קבלה...</span>
                  </>
                ) : uploadedReceiptUrl ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">קבלה הועלתה בהצלחה</span>
                    <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-green-500" />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="w-5 h-5 text-blue-500" />
                    <div className="text-center">
                      <span className="text-blue-700 font-medium block">העלה קבלה</span>
                      <span className="text-blue-600 text-sm">תמונה או PDF</span>
                    </div>
                    <FontAwesomeIcon icon={faImage} className="w-4 h-4 text-blue-400" />
                  </>
                )}
              </label>
            </div>
            
            {uploadedReceiptUrl && !uploadingReceipt && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">תצוגה מקדימה:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedReceiptUrl(null);
                      setFormData({ ...formData, receiptFile: null });
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="הסר קבלה"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </button>
                </div>
                <img 
                  src={uploadedReceiptUrl} 
                  alt="Receipt preview" 
                  className="max-w-full h-32 object-cover rounded-lg border border-green-300"
                />
              </div>
            )}
            
            {formData.receiptFile && !uploadedReceiptUrl && !uploadingReceipt && (
              <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 ml-1" />
                  נבחר: {formData.receiptFile.name}
                </p>
              </div>
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