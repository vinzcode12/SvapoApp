import { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useAppContext } from '../context/AppContext';
import { Product } from '../lib/store';

export default function AllProducts() {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tutti i prodotti</h1>
          <p className="mt-2 text-gray-600">Esplora il nostro intero catalogo.</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={setSelectedProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Il catalogo è attualmente vuoto.</p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
