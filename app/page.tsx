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

    const updateData: any = {
      status: 'bought',
      boughtBy: purchaseData.boughtBy,
      actualPrice: purchaseData.actualPrice,
      updatedAt: new Date(),
    };

    if (purchaseData.receiptUrl) {
      updateData.receiptUrl = purchaseData.receiptUrl;
    }

    await updateDoc(doc(db, 'items', selectedItem.id), updateData);

    setShowPurchaseDialog(false);
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item => {
    if (currentView === 'active') return item.status === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-md mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowPeopleManagement(true)}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              רשימת קניות למעבר דירה
            </h1>
            <div className="w-11"></div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-6 py-2">
          <div className="flex space-x-reverse space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setCurrentView('active')}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center rounded-lg transition-all duration-200 ${
                currentView === 'active'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
              פעילים
            </button>
            <button
              onClick={() => setCurrentView('all')}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center rounded-lg transition-all duration-200 ${
                currentView === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FontAwesomeIcon icon={faList} className="ml-2" />
              הכל
            </button>
            <button
              onClick={() => setCurrentView('breakdown')}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center rounded-lg transition-all duration-200 ${
                currentView === 'breakdown'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="ml-2" />
              פירוט
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6">
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
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-110 z-20"
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
