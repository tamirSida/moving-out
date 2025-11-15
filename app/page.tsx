'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Item, Person, PurchaseData } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShoppingCart, faCheck, faReceipt, faUser, faList, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import ItemList from '@/components/ItemList';
import AddItemForm from '@/components/AddItemForm';
import PurchaseDialog from '@/components/PurchaseDialog';
import BreakdownView from '@/components/BreakdownView';
import PeopleManagement from '@/components/PeopleManagement';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [currentView, setCurrentView] = useState<'active' | 'all' | 'breakdown'>('active');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showPeopleManagement, setShowPeopleManagement] = useState(false);

  useEffect(() => {
    const unsubscribeItems = onSnapshot(collection(db, 'items'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Item[];
      setItems(itemsData);
    });

    const unsubscribePeople = onSnapshot(collection(db, 'people'), (snapshot) => {
      const peopleData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Person[];
      setPeople(peopleData);
    });

    return () => {
      unsubscribeItems();
      unsubscribePeople();
    };
  }, []);

  const handleAddItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'items'), {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setShowAddForm(false);
  };

  const handlePurchase = async (purchaseData: PurchaseData) => {
    if (!selectedItem) return;

    await updateDoc(doc(db, 'items', selectedItem.id), {
      status: 'bought',
      boughtBy: purchaseData.boughtBy,
      actualPrice: purchaseData.actualPrice,
      updatedAt: new Date(),
    });

    setShowPurchaseDialog(false);
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item => {
    if (currentView === 'active') return item.status === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowPeopleManagement(true)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              רשימת קניות למעבר דירה
            </h1>
            <div className="w-9"></div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-reverse space-x-1">
            <button
              onClick={() => setCurrentView('active')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                currentView === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
              פריטים פעילים
            </button>
            <button
              onClick={() => setCurrentView('all')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                currentView === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faList} className="ml-2" />
              כל הפריטים
            </button>
            <button
              onClick={() => setCurrentView('breakdown')}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                currentView === 'breakdown'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="ml-2" />
              פירוט
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {currentView !== 'breakdown' && (
          <>
            <ItemList
              items={filteredItems}
              people={people}
              onPurchase={(item) => {
                setSelectedItem(item);
                setShowPurchaseDialog(true);
              }}
            />

            {/* Add Item Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="w-6 h-6" />
            </button>
          </>
        )}

        {currentView === 'breakdown' && (
          <BreakdownView items={items} people={people} />
        )}
      </main>

      {/* Modals */}
      {showAddForm && (
        <AddItemForm
          onSubmit={handleAddItem}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {showPurchaseDialog && selectedItem && (
        <PurchaseDialog
          item={selectedItem}
          people={people}
          onSubmit={handlePurchase}
          onClose={() => {
            setShowPurchaseDialog(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showPeopleManagement && (
        <PeopleManagement
          people={people}
          onClose={() => setShowPeopleManagement(false)}
        />
      )}
    </div>
  );
}
