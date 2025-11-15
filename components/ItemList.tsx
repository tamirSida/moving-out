'use client';

import { Item, Person } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faUser, faTag, faShekelSign, faReceipt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface ItemListProps {
  items: Item[];
  people: Person[];
  onPurchase: (item: Item) => void;
}

export default function ItemList({ items, people, onPurchase }: ItemListProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'לא ידוע';
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
        <FontAwesomeIcon icon={faShoppingCart} className="w-16 h-16 text-gray-300 mb-6" />
        <p className="text-gray-600 text-xl font-semibold">אין פריטים ברשימה</p>
        <p className="text-gray-400 text-sm mt-3">הוסף פריטים בלחיצה על כפתור הפלוס</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 p-5 ${
            item.status === 'bought' 
              ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200 shadow-green-100/50' 
              : 'border-gray-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className={`font-semibold text-lg ${
                  item.status === 'bought' ? 'line-through text-green-700' : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
                {item.status === 'bought' && (
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                  </div>
                )}
              </div>
              
                <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                  <span className="font-medium">{item.category}</span>
                </div>
                
                {item.estimatedPrice && (
                  <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    <span className="font-semibold">מוערך: {item.estimatedPrice} ₪</span>
                  </div>
                )}

                {item.status === 'bought' && item.actualPrice && (
                  <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <span className="font-semibold">שולם: {item.actualPrice} ₪</span>
                  </div>
                )}

                {item.status === 'bought' && item.boughtBy && (
                  <div className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    <span className="font-semibold">{getPersonName(item.boughtBy)}</span>
                  </div>
                )}

                {item.status === 'bought' && item.receiptUrl && (
                  <a 
                    href={item.receiptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faReceipt} className="w-3 h-3" />
                    <span className="font-semibold">קבלה</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2 h-2" />
                  </a>
                )}
              </div>
            </div>

            {item.status === 'pending' && (
              <button
                onClick={() => onPurchase(item)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-green-300/30 transition-all duration-200 hover:scale-105"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 ml-1.5" />
                נקנה
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}