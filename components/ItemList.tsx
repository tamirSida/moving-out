'use client';

import { Item, Person } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faUser, faTag, faShekelSign } from '@fortawesome/free-solid-svg-icons';

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
      <div className="text-center py-12">
        <FontAwesomeIcon icon={faShoppingCart} className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">אין פריטים ברשימה</p>
        <p className="text-gray-400 text-sm mt-2">הוסף פריטים בלחיצה על כפתור הפלוס</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-lg border p-4 shadow-sm ${
            item.status === 'bought' ? 'opacity-75 bg-green-50 border-green-200' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium text-lg ${
                  item.status === 'bought' ? 'line-through text-green-700' : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
                {item.status === 'bought' && (
                  <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                  <span>{item.category}</span>
                </div>
                
                {item.estimatedPrice && (
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faShekelSign} className="w-3 h-3" />
                    <span>מוערך: {item.estimatedPrice}</span>
                  </div>
                )}

                {item.status === 'bought' && item.actualPrice && (
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <FontAwesomeIcon icon={faShekelSign} className="w-3 h-3" />
                    <span>שולם: {item.actualPrice}</span>
                  </div>
                )}

                {item.status === 'bought' && item.boughtBy && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    <span>נקנה על ידי: {getPersonName(item.boughtBy)}</span>
                  </div>
                )}
              </div>
            </div>

            {item.status === 'pending' && (
              <button
                onClick={() => onPurchase(item)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 ml-1" />
                נקנה
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}