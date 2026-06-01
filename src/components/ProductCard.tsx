import React from 'react';
import { Product } from '../lib/store';
import { Scale, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full"
    >
      <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300 relative overflow-hidden group">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon className="w-12 h-12 opacity-50" />
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-slate-800 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-xs text-slate-400 mb-2 mt-1 truncate">
        {product.features && product.features.length > 0 ? `${product.features[0].value}${product.features[0].unit ? ` ${product.features[0].unit}` : ''}` : 'Dettagli prodotto'}
      </p>
      
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-black text-orange-500 text-lg">
          € {Number(product.price).toFixed(2)}
        </span>
        <button className="p-1 text-slate-400 hover:text-orange-500 transition-colors relative z-10" onClick={(e) => { e.stopPropagation(); onClick(product) }}>
          <Scale className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
