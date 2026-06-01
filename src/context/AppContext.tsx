import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Customer, getProducts, getCustomers, saveProducts, saveCustomers } from '../lib/store';

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
    setProductsState(getProducts());
    setCustomersState(getCustomers());
    const seen = sessionStorage.getItem('seenOffer') === 'true';
    setHasSeenOfferState(seen);
  }, []);

  const addProduct = (product: Product) => {
    const newProducts = [...products, product];
    setProductsState(newProducts);
    saveProducts(newProducts);
  };

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProductsState(newProducts);
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProductsState(newProducts);
    saveProducts(newProducts);
  };

  const addCustomer = (customer: Customer) => {
    const newCustomers = [...customers, customer];
    setCustomersState(newCustomers);
    saveCustomers(newCustomers);
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
