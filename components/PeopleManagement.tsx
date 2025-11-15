'use client';

import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Person } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUser, faUserCheck, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

interface PeopleManagementProps {
  people: Person[];
  onClose: () => void;
}

export default function PeopleManagement({ people, onClose }: PeopleManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({ name: '', isPayer: true });

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await addDoc(collection(db, 'people'), {
      name: formData.name.trim(),
      isPayer: formData.isPayer,
    });

    setFormData({ name: '', isPayer: true });
    setShowAddForm(false);
  };

  const handleEditPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson || !formData.name.trim()) return;

    await updateDoc(doc(db, 'people', editingPerson.id), {
      name: formData.name.trim(),
      isPayer: formData.isPayer,
    });

    setEditingPerson(null);
    setFormData({ name: '', isPayer: true });
  };

  const handleDeletePerson = async (personId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את האדם הזה?')) {
      await deleteDoc(doc(db, 'people', personId));
    }
  };

  const startEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({ name: person.name, isPayer: person.isPayer });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingPerson(null);
    setFormData({ name: '', isPayer: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">ניהול אנשים</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingPerson) && (
          <form onSubmit={editingPerson ? handleEditPerson : handleAddPerson} className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">
              {editingPerson ? 'עריכת אדם' : 'הוספת אדם חדש'}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="שם האדם..."
                required
                autoFocus
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isPayer}
                  onChange={(e) => setFormData({ ...formData, isPayer: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">יכול לקנות פריטים</span>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={editingPerson ? cancelEdit : () => setShowAddForm(false)}
                className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim()}
                className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300"
              >
                <FontAwesomeIcon icon={editingPerson ? faCheck : faPlus} className="w-4 h-4 ml-1" />
                {editingPerson ? 'עדכן' : 'הוסף'}
              </button>
            </div>
          </form>
        )}

        {/* Add New Button */}
        {!showAddForm && !editingPerson && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-4 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 ml-2" />
            הוסף אדם חדש
          </button>
        )}

        {/* People List */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">רשימת אנשים ({people.length})</h3>
          {people.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-gray-500">אין עדיין אנשים ברשימה</p>
            </div>
          ) : (
            people.map((person) => (
              <div key={person.id} className="bg-white border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={person.isPayer ? faUserCheck : faUser}
                      className={`w-4 h-4 ${person.isPayer ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">
                        {person.isPayer ? 'יכול לקנות פריטים' : 'לא יכול לקנות פריטים'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(person)}
                      className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}