export interface InventoryItem {
  id: string;
  name: string;
  type: 'shoes' | 'shirts' | 'bags' | 'sandals' | 'electronics';
  purchaseAmount: number;
  soldAmount: number | null;
}
