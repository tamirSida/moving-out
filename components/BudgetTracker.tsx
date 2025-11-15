'use client';

import { Item, AppSettings } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShekelSign, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface BudgetTrackerProps {
  items: Item[];
  settings: AppSettings | null;
}

export default function BudgetTracker({ items, settings }: BudgetTrackerProps) {
  const budget = settings?.budget || 0;
  
  // If no budget is set, don't show the tracker
  if (!budget || budget <= 0) {
    return null;
  }

  // Calculate actual spent (bought items only)
  const actualSpent = items
    .filter(item => item.status === 'bought')
    .reduce((sum, item) => sum + (item.actualPrice || 0), 0);

  // Calculate estimated remaining (pending items only)
  const estimatedRemaining = items
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  // Calculate remaining budget
  const budgetRemaining = budget - actualSpent - estimatedRemaining;
  const isOverBudget = budgetRemaining < 0;
  const budgetUsedPercentage = ((actualSpent + estimatedRemaining) / budget) * 100;

  // Color logic based on budget usage
  const getColor = () => {
    if (budgetUsedPercentage <= 80) return 'green'; // Safe zone
    if (budgetUsedPercentage <= 100) return 'yellow'; // Warning zone
    return 'red'; // Over budget
  };

  const color = getColor();

  return (
    <div className={`rounded-lg p-4 mb-4 border-2 ${
      color === 'green' 
        ? 'bg-green-50 border-green-200' 
        : color === 'yellow' 
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon 
            icon={color === 'green' ? faCheckCircle : faExclamationTriangle} 
            className={`w-5 h-5 ${
              color === 'green' 
                ? 'text-green-600' 
                : color === 'yellow' 
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          />
          <span className={`font-semibold ${
            color === 'green' 
              ? 'text-green-800' 
              : color === 'yellow' 
                ? 'text-yellow-800'
                : 'text-red-800'
          }`}>
            תקציב
          </span>
        </div>
        
        <div className="text-left">
          <div className={`text-lg font-bold ${
            color === 'green' 
              ? 'text-green-600' 
              : color === 'yellow' 
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}>
            {isOverBudget ? '-' : ''}{Math.abs(budgetRemaining).toFixed(2)} ₪
          </div>
          <div className="text-xs text-gray-500">
            {isOverBudget ? 'חריגה' : 'נותר'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">
            {actualSpent.toFixed(2)} ₪ נוצל + {estimatedRemaining.toFixed(2)} ₪ צפוי
          </span>
          <span className={`text-xs font-medium ${
            color === 'green' 
              ? 'text-green-600' 
              : color === 'yellow' 
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}>
            {budgetUsedPercentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              color === 'green' 
                ? 'bg-green-500' 
                : color === 'yellow' 
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ 
              width: `${Math.min(budgetUsedPercentage, 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Budget breakdown */}
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-gray-500">תקציב</div>
          <div className="font-medium">{budget.toFixed(2)} ₪</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">נוצל</div>
          <div className="font-medium text-blue-600">{actualSpent.toFixed(2)} ₪</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">צפוי</div>
          <div className="font-medium text-orange-600">{estimatedRemaining.toFixed(2)} ₪</div>
        </div>
      </div>
    </div>
  );
}