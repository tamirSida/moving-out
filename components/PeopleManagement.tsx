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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">ניהול אנשים</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">

          {/* Add/Edit Form */}
          {(showAddForm || editingPerson) && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                {editingPerson ? 'עריכת אדם' : 'הוספת אדם חדש'}
              </h3>
              <form onSubmit={editingPerson ? handleEditPerson : handleAddPerson} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    placeholder="שם האדם..."
                    required
                    autoFocus
                  />
                </div>
                <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isPayer}
                    onChange={(e) => setFormData({ ...formData, isPayer: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">יכול לקנות פריטים</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={editingPerson ? cancelEdit : () => setShowAddForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim()}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <FontAwesomeIcon icon={editingPerson ? faCheck : faPlus} className="w-4 h-4 ml-2" />
                    {editingPerson ? 'עדכן' : 'הוסף'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add New Button */}
          {!showAddForm && !editingPerson && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 ml-2" />
              הוסף אדם חדש
            </button>
          )}

          {/* People List */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-600" />
              רשימת אנשים ({people.length})
            </h3>
            {people.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FontAwesomeIcon icon={faUser} className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">אין עדיין אנשים ברשימה</p>
                <p className="text-gray-400 text-sm mt-2">הוסף את הראשון כדי להתחיל</p>
              </div>
            ) : (
              <div className="space-y-3">
                {people.map((person) => (
                  <div key={person.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          person.isPayer ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <FontAwesomeIcon
                            icon={person.isPayer ? faUserCheck : faUser}
                            className="w-5 h-5"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{person.name}</p>
                          <p className={`text-sm font-medium ${
                            person.isPayer ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {person.isPayer ? 'יכול לקנות פריטים' : 'לא יכול לקנות פריטים'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(person)}
                          className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePerson(person.id)}
                          className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}