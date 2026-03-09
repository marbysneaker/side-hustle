import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const initialInventory = [
  { id: '1', name: 'Nike SB Janoski Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '2', name: 'Nike SB Janoski Black Size 9', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '3', name: 'Nike SB Janoski Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '4', name: 'Nike SB Janoski Black Size 8', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '5', name: 'Nike SB Janoski White Size 8', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '6', name: 'Nike SB Janoski White Size 9', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '7', name: 'Nike SB Janoski Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '8', name: 'Nike SB Janoski Size 8.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '9', name: 'Nike SB Janoski Size 7.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '10', name: 'Nike SB Janoski Maroon Size 8.5', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '11', name: 'Nike SB Black Size 10', type: 'shoes', purchaseAmount: 1140, soldAmount: null, isSold: false },
  { id: '12', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '13', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '14', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '15', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '16', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '17', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '18', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '19', name: 'Adidas Sandals Black Size 9', type: 'sandals', purchaseAmount: 513, soldAmount: null, isSold: false },
  { id: '20', name: 'Supreme Kids Tee Navy Size L', type: 'shirts', purchaseAmount: 2850, soldAmount: null, isSold: false },
  { id: '21', name: 'Supreme Shadow Tee Navy Size L', type: 'shirts', purchaseAmount: 2850, soldAmount: null, isSold: false },
  { id: '22', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
  { id: '23', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
  { id: '24', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
  { id: '25', name: 'Google Home Mini', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
  { id: '26', name: 'PSU Power Supply', type: 'electronics', purchaseAmount: 0, soldAmount: null, isSold: false },
];

export async function seedInventory() {
  try {
    for (const item of initialInventory) {
      const docRef = doc(db, 'inventory', item.id);
      await setDoc(docRef, {
        name: item.name,
        type: item.type,
        purchaseAmount: item.purchaseAmount,
        soldAmount: item.soldAmount,
        isSold: item.isSold,
      });
    }
  } catch (error) {
    console.error('Error seeding inventory:', error);
  }
}
