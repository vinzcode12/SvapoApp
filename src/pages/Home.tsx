import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useAppContext } from '../context/AppContext';
import { Product } from '../lib/store';

export default function Home() {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const showcaseProducts = products.filter(p => p.inShowcase);

  return (
    <>
      <Header />
      
      <main className="flex-1 p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center mb-8">
            <Link 
              to="/all"
              className="mb-8 px-8 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
            >
              Vedi Tutto
            </Link>
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <h2 className="text-sm font-black text-gray-400 tracking-[0.3em] uppercase whitespace-nowrap">In Vetrina</h2>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>
          </div>

          {showcaseProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {showcaseProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={setSelectedProduct} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
              <p className="text-slate-500">Nessun prodotto in vetrina al momento.</p>
            </div>
          )}
        </div>
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
