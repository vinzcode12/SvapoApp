import { Link } from 'react-router-dom';
import { Scale, Package } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 h-16 px-4 sm:px-8 flex items-center justify-between z-10 sticky top-0">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight uppercase italic text-slate-900">
            Svapo Web <span className="text-orange-500">Store</span>
          </span>
        </Link>
        
        <div className="flex gap-3 items-center">
          <Link 
            to="/compare" 
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 border border-orange-500 text-orange-500 font-bold rounded-full hover:bg-orange-50 transition-colors text-sm uppercase"
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Confronta</span>
          </Link>
          
          <Link 
            to="/admin" 
            className="flex items-center justify-center px-3 py-2 sm:px-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors text-sm uppercase"
          >
            <span className="inline sm:hidden">Adm</span>
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
