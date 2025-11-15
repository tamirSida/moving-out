'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Item, Person, PurchaseData, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShoppingCart, faCheck, faReceipt, faUser, faList, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import ItemList from '@/components/ItemList';
import AddItemForm from '@/components/AddItemForm';
import PurchaseDialog from '@/components/PurchaseDialog';
import BreakdownView from '@/components/BreakdownView';
import SettingsModal from '@/components/SettingsModal';
import LoadingWrapper from '@/components/LoadingWrapper';
import BudgetTracker from '@/components/BudgetTracker';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentView, setCurrentView] = useState<'active' | 'all' | 'breakdown'>('active');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

    const unsubscribeSettings = onSnapshot(collection(db, 'settings'), (snapshot) => {
      if (snapshot.docs.length > 0) {
        const settingsData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
          createdAt: snapshot.docs[0].data().createdAt?.toDate() || new Date(),
          updatedAt: snapshot.docs[0].data().updatedAt?.toDate() || new Date(),
        } as AppSettings;
        setSettings(settingsData);
      }
    });

    return () => {
      unsubscribeItems();
      unsubscribePeople();
      unsubscribeSettings();
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

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    if (settings) {
      await updateDoc(doc(db, 'settings', settings.id), {
        ...newSettings,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(doc(db, 'settings', 'app-settings'), {
        ...newSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  const filteredItems = items.filter(item => {
    if (currentView === 'active') return item.status === 'pending';
    return true;
  });

  return (
    <LoadingWrapper>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              aria-label="הגדרות"
            >
              <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              רשימת קניות למעבר דירה
            </h1>
            <div className="w-9"></div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex bg-gray-100 rounded-lg p-1 m-2">
            <button
              onClick={() => setCurrentView('active')}
              className={`flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-colors ${
                currentView === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="ml-1" />
              פעילים
            </button>
            <button
              onClick={() => setCurrentView('all')}
              className={`flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-colors ${
                currentView === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FontAwesomeIcon icon={faList} className="ml-1" />
              הכל
            </button>
            <button
              onClick={() => setCurrentView('breakdown')}
              className={`flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-colors ${
                currentView === 'breakdown'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="ml-1" />
              פירוט
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4">
        {currentView !== 'breakdown' && (
          <>
            {currentView === 'active' && (
              <BudgetTracker items={items} settings={settings} />
            )}
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
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors z-20"
              aria-label="הוסף פריט חדש"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            </button>
          </>
        )}

        {currentView === 'breakdown' && (
          <BreakdownView items={items} people={people} settings={settings} />
        )}
      </main>

      {/* Modals */}
      {showAddForm && (
        <AddItemForm
          onSubmit={handleAddItem}
          onClose={() => setShowAddForm(false)}
          settings={settings}
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

      {showSettings && (
        <SettingsModal
          people={people}
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </div>
    </LoadingWrapper>
  );
}
