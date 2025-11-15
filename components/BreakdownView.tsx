'use client';

import { Item, Person, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShekelSign, faUser, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';

interface BreakdownViewProps {
  items: Item[];
  people: Person[];
  settings?: AppSettings | null;
}

interface PersonSpending {
  person: Person;
  totalSpent: number;
  itemsBought: number;
  items: Item[];
}

export default function BreakdownView({ items, people, settings }: BreakdownViewProps) {
  const boughtItems = items.filter(item => item.status === 'bought');
  const pendingItems = items.filter(item => item.status === 'pending');
  const totalSpent = boughtItems.reduce((sum, item) => sum + (item.actualPrice || 0), 0);
  
  // Calculate estimated remaining cost
  const estimatedRemaining = pendingItems.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  
  // Budget calculations
  const budget = settings?.budget || 0;
  const estimatedTotal = totalSpent + estimatedRemaining;
  const budgetRemaining = budget - totalSpent;
  const isOverBudget = budget > 0 && totalSpent > budget;
  const willExceedBudget = budget > 0 && estimatedTotal > budget;

  const spendingByPerson: PersonSpending[] = people
    .filter(person => person.isPayer)
    .map(person => {
      const personItems = boughtItems.filter(item => item.boughtBy === person.id);
      return {
        person,
        totalSpent: personItems.reduce((sum, item) => sum + (item.actualPrice || 0), 0),
        itemsBought: personItems.length,
        items: personItems,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  if (boughtItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FontAwesomeIcon icon={faChartBar} className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">אין עדיין רכישות לפירוט</p>
        <p className="text-gray-400 text-sm mt-2">כשתסמנו פריטים כנקנו, הפירוט יופיע כאן</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      {budget > 0 && (
        <div className={`rounded-xl p-6 border-2 ${
          isOverBudget 
            ? 'bg-red-50 border-red-200' 
            : willExceedBudget 
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-center">
            <h2 className={`text-xl font-bold mb-4 ${
              isOverBudget ? 'text-red-800' : willExceedBudget ? 'text-yellow-800' : 'text-green-800'
            }`}>
              מעקב תקציב
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600">תקציב</p>
                <p className="text-lg font-bold">{budget.toFixed(2)} ₪</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-600">נוצל</p>
                <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
                  {totalSpent.toFixed(2)} ₪
                </p>
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">התקדמות</span>
                <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
                  {((totalSpent / budget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-500' : willExceedBudget ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((totalSpent / budget) * 100, 100)}%` }}
                ></div>
              </div>
              {isOverBudget && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  חרגת מהתקציב ב-{(totalSpent - budget).toFixed(2)} ₪
                </p>
              )}
              {!isOverBudget && budgetRemaining > 0 && (
                <p className="text-green-600 text-sm font-medium mt-2">
                  נותר: {budgetRemaining.toFixed(2)} ₪
                </p>
              )}
            </div>

            {willExceedBudget && !isOverBudget && (
              <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ עשוי לחרוג מהתקציב אם תקנה לפי מחיר מוערך
                </p>
                <p className="text-yellow-700 text-sm">
                  סה״כ משוער: {estimatedTotal.toFixed(2)} ₪
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Total Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FontAwesomeIcon icon={faShekelSign} className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-blue-900">סה״כ הוצאות</h2>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalSpent.toFixed(2)} ₪</p>
          <p className="text-sm text-blue-700 mt-1">
            {boughtItems.length} פריטים נקנו
          </p>
          
          {estimatedRemaining > 0 && (
            <div className="bg-blue-100 rounded-lg p-3 mt-4">
              <p className="text-xs text-blue-700">צפוי עוד</p>
              <p className="text-lg font-bold text-blue-800">+{estimatedRemaining.toFixed(2)} ₪</p>
              <p className="text-xs text-blue-600">לפי מחירים משוערים</p>
            </div>
          )}
        </div>
      </div>

      {/* Spending by Person */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">פירוט לפי קונה</h3>
        </div>

        <div className="space-y-3">
          {spendingByPerson.map(({ person, totalSpent: personTotal, itemsBought, items: personItems }) => (
            <div key={person.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-gray-900">{personTotal.toFixed(2)} ₪</p>
                  <p className="text-sm text-gray-500">{itemsBought} פריטים</p>
                </div>
              </div>

              {personItems.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">פריטים שנקנו:</p>
                  <div className="space-y-1">
                    {personItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium text-gray-900">{item.actualPrice?.toFixed(2)} ₪</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faChartBar} className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">פירוט לפי קטגוריה</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(
            boughtItems.reduce((acc, item) => {
              const category = item.category;
              if (!acc[category]) {
                acc[category] = { total: 0, count: 0, items: [] };
              }
              acc[category].total += item.actualPrice || 0;
              acc[category].count += 1;
              acc[category].items.push(item);
              return acc;
            }, {} as Record<string, { total: number; count: number; items: Item[] }>)
          )
            .sort(([, a], [, b]) => b.total - a.total)
            .map(([category, { total, count, items: categoryItems }]) => (
              <div key={category} className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">{total.toFixed(2)} ₪</p>
                    <p className="text-sm text-gray-500">{count} פריטים</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {categoryItems.map(item => item.name).join(', ')}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}