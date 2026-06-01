import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { Product } from '../lib/store';
import { useLocation } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

export default function Compare() {
  const { products } = useAppContext();
  const location = useLocation();
  
  const [leftProduct, setLeftProduct] = useState<Product | null>(null);
  const [rightProduct, setRightProduct] = useState<Product | null>(null);
  const [selectorSide, setSelectorSide] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    // If navigated with a pre-selected product for the left side
    if (location.state?.leftProduct) {
      setLeftProduct(location.state.leftProduct);
    }
  }, [location]);

  const handleSelectProduct = (product: Product) => {
    if (selectorSide === 'left') setLeftProduct(product);
    if (selectorSide === 'right') setRightProduct(product);
    setSelectorSide(null);
  };

  const getComparisonColor = (f: import('../lib/store').ProductFeature, otherProduct: Product | null): string => {
    if (!otherProduct || !otherProduct.features) return 'text-gray-900';

    const parseVal = (valStr: string, unitStr?: string) => {
      if (!valStr) return null;
      const cleanVal = valStr.trim();

      const parseNumber = (s: string) => {
        const lastDot = s.lastIndexOf('.');
        const lastComma = s.lastIndexOf(',');
        let finalStr = s;
        if (lastComma > lastDot) {
           finalStr = s.replace(/\./g, '').replace(',', '.');
        } else if (lastDot > lastComma && lastComma !== -1) {
           finalStr = s.replace(/,/g, '');
        } else if (lastDot !== -1 && lastComma === -1) {
           const parts = s.split('.');
           const isThousand = parts.slice(1).every(p => p.length === 3);
           if (isThousand) {
              finalStr = s.replace(/\./g, '');
           }
        } else if (lastComma !== -1 && lastDot === -1) {
           finalStr = s.replace(',', '.');
        }
        return parseFloat(finalStr);
      };

      const matchFallback = cleanVal.match(/^([+-]?[\d.,]+)\s*(.*)$/);
      if (!matchFallback) return null;
      
      const n = parseNumber(matchFallback[1]);
      if (isNaN(n)) return null;
      
      const parsedUnit = matchFallback[2].toLowerCase().trim();
      const explicitUnit = (unitStr || '').toLowerCase().trim();
      
      const finalUnit = explicitUnit || parsedUnit;
      
      return { num: n, unit: finalUnit };
    };

    const myPValue = parseVal(f.value, f.unit);
    if (!myPValue || !myPValue.unit) return 'text-gray-900';

    const otherFeature = otherProduct.features.find(of => {
      const pVal = parseVal(of.value, of.unit);
      return pVal && pVal.unit === myPValue.unit;
    });

    if (!otherFeature) return 'text-gray-900';

    const otherPValue = parseVal(otherFeature.value, otherFeature.unit);

    if (myPValue && otherPValue && myPValue.unit === otherPValue.unit) {
       if (myPValue.num > otherPValue.num) return 'text-green-600 font-bold';
       if (myPValue.num < otherPValue.num) return 'text-red-500 font-bold';
    }

    return 'text-gray-900';
  };

  const renderPane = (side: 'left' | 'right', product: Product | null) => {
    const otherProduct = side === 'left' ? rightProduct : leftProduct;

    if (!product) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl min-h-[400px]">
          <button 
            onClick={() => setSelectorSide(side)}
            className="flex flex-col items-center gap-4 text-gray-500 hover:text-orange-500 transition-colors group p-4"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-medium text-lg">Aggiungi prodotto</span>
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <button 
          onClick={() => side === 'left' ? setLeftProduct(null) : setRightProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="aspect-[4/3] w-full bg-gray-50 relative">
          {product.image ? (
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-300">Nessuna immagine</div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-2xl font-extrabold text-orange-500 mb-6">€ {Number(product.price).toFixed(2)}</p>
          
          {product.features && product.features.length > 0 ? (
            <div className="mt-6 flex-grow">
               <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Specifiche</h4>
               <ul className="space-y-3">
                 {product.features.map(f => (
                   <li key={f.id} className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">{f.name}</span>
                     <span className={`text-right ml-4 ${getComparisonColor(f, otherProduct)}`}>
                       {f.value}{f.unit ? ` ${f.unit}` : ''}
                     </span>
                   </li>
                 ))}
               </ul>
            </div>
          ) : (
             <div className="mt-6 text-sm text-gray-400 italic">Nessuna specifica tecnica inserita.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Confronta Prodotti</h1>
          <p className="mt-2 text-gray-600">Scegli due prodotti per confrontarne le caratteristiche.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-12 relative">
          {renderPane('left', leftProduct)}
          
          {/* Central Divider / VS Badge */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-50 items-center justify-center shadow-sm z-10">
            <span className="text-gray-400 font-bold text-lg">VS</span>
          </div>
          
          {renderPane('right', rightProduct)}
        </div>
      </main>

      {/* Product Selector Modal */}
      {selectorSide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Seleziona un prodotto</h2>
              <button 
                onClick={() => setSelectorSide(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-grow grid grid-cols-2 md:grid-cols-3 gap-4">
               {products.length > 0 ? (
                 products.map(p => (
                   <div 
                     key={p.id}
                     onClick={() => handleSelectProduct(p)}
                     className="flex flex-col border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-orange-500 hover:shadow-md transition-all group"
                   >
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                      </div>
                      <div className="p-3 text-center">
                        <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                        <p className="text-orange-500 text-sm font-bold mt-1">€{Number(p.price).toFixed(2)}</p>
                      </div>
                   </div>
                 ))
               ) : (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    Nessun prodotto disponibile.
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
