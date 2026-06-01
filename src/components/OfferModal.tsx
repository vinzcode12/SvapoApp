import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function OfferModal() {
  const { addCustomer, hasSeenOffer, setHasSeenOffer } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', surname: '', phone: '' });

  useEffect(() => {
    // Show after a small delay on first load
    if (!hasSeenOffer) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOffer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.phone) return;

    addCustomer({
      id: Date.now().toString(),
      name: formData.name,
      surname: formData.surname,
      phone: formData.phone,
      date: new Date().toISOString()
    });

    setHasSeenOffer(true);
    setIsOpen(false);
  };

  const handleClose = () => {
    setHasSeenOffer(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-[400px] max-w-full rounded-[32px] p-8 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
            <MessageCircle className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Offerte Esclusive!</h2>
        <p className="text-center text-slate-500 mb-8 text-sm px-4">
          Registrati ora per ricevere le migliori promozioni direttamente su <span className="text-green-600 font-bold">WhatsApp</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            placeholder="Nome"
          />
          <input 
            type="text" 
            required
            value={formData.surname}
            onChange={e => setFormData({...formData, surname: e.target.value})}
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            placeholder="Cognome"
          />
          <input 
            type="tel" 
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
            placeholder="Telefono"
          />
          <button 
            type="submit"
            className="w-full py-4 mt-2 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all uppercase tracking-widest text-sm"
          >
            Ricevi Offerte
          </button>
        </form>

        <button 
          onClick={handleClose}
          type="button"
          className="w-full text-center text-slate-400 text-xs font-bold uppercase mt-6 hover:text-slate-600 transition-colors"
        >
          Magari più tardi
        </button>
      </div>
    </div>
  );
}
