'use client';

import { useState } from 'react';
import { Person, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUsers, faCog, faTag, faShekelSign } from '@fortawesome/free-solid-svg-icons';
import PeopleManagement from './PeopleManagement';
import AppSettingsTab from './AppSettingsTab';

interface SettingsModalProps {
  people: Person[];
  settings: AppSettings | null;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export default function SettingsModal({ people, settings, onClose, onUpdateSettings }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'app'>('app');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">הגדרות</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex mt-6 space-x-reverse space-x-4">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'app'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
              הגדרות כלליות
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === 'people'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
              ניהול אנשים
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {activeTab === 'app' && (
            <AppSettingsTab 
              settings={settings} 
              onUpdateSettings={onUpdateSettings}
            />
          )}
          
          {activeTab === 'people' && (
            <PeopleManagement 
              people={people} 
              onClose={() => {}}
              isModal={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}