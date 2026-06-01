import { X, Scale } from 'lucide-react';
import { Product } from '../lib/store';
import { useNavigate } from 'react-router-dom';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const navigate = useNavigate();

  const handleCompare = () => {
    // Navigate to compare page and pass this product as the left item via generic state
    navigate('/compare', { state: { leftProduct: product } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full hover:bg-gray-100 transition-colors z-10 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gray-50 flex-shrink-0 relative">
             <div className="aspect-square w-full">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    Nessuna immagine
                  </div>
                )}
             </div>
             <div className="absolute bottom-4 left-4 right-4">
                <button 
                  onClick={handleCompare}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/90 backdrop-blur-md border border-gray-200 text-gray-900 font-semibold rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all shadow-lg"
                >
                  <Scale className="w-5 h-5" />
                  Confronta
                </button>
             </div>
          </div>
          
          <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-3xl font-extrabold text-orange-500 mb-6">
              € {Number(product.price).toFixed(2)}
            </p>
            
            {product.description && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Descrizione</h4>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}
            
            {product.features && product.features.length > 0 && (
              <div>
                 <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Specifiche Tecniche</h4>
                 <ul className="space-y-2">
                   {product.features.map(f => (
                     <li key={f.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                       <span className="text-gray-500">{f.name}</span>
                       <span className="font-medium text-gray-900 text-right">{f.value}{f.unit ? ` ${f.unit}` : ''}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
