import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Customer } from '../lib/store';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

interface AppContextType {
  products: Product[];
  customers: Customer[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  hasSeenOffer: boolean;
  setHasSeenOffer: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [customers, setCustomersState] = useState<Customer[]>([]);
  const [hasSeenOffer, setHasSeenOfferState] = useState<boolean>(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('seenOffer') === 'true';
    setHasSeenOfferState(seen);

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProductsState(p);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    const unsubscribeCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const c = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomersState(c);
    }, (error) => {
      // It's expected to fail if the user is not admin
      console.log("Customer read error (usually means not auth'd as admin yet)", error.message);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCustomers();
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), { ...product, createdAt: Date.now() });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `products/${product.id}`);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `products/${updatedProduct.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const addCustomer = async (customer: Customer) => {
    try {
      await setDoc(doc(db, 'customers', customer.id), customer);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `customers/${customer.id}`);
    }
  };

  const setHasSeenOffer = (val: boolean) => {
    setHasSeenOfferState(val);
    sessionStorage.setItem('seenOffer', val ? 'true' : 'false');
  };

  return (
    <AppContext.Provider value={{
      products,
      customers,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      hasSeenOffer,
      setHasSeenOffer
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
