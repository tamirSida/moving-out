export interface Item {
  id: string;
  name: string;
  category: string;
  estimatedPrice?: number;
  actualPrice?: number;
  status: 'pending' | 'bought';
  boughtBy?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  isPayer: boolean;
}

export interface PurchaseData {
  boughtBy: string;
  actualPrice: number;
  receiptFile?: File;
}