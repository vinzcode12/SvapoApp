import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { Product, ProductFeature, resizeAndCompressImage } from '../lib/store';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { ShieldCheck, Plus, Trash2, Edit2, Check, Image as ImageIcon, Users, Package, X, LogOut } from 'lucide-react';

export default function Admin() {
  const { products, customers, addProduct, updateProduct, deleteProduct } = useAppContext();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'products' | 'customers'>('products');
  
  // Product Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    inShowcase: false,
    image: '',
    features: [{ id: Date.now().toString(), name: '', value: '', unit: '' }]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // In a real app we'd check if user is admin, here for simplicity we verify if logged in
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Errore di autenticazione');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleFeatureChange = (id: string, field: 'name' | 'value' | 'unit', val: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map(f => f.id === id ? { ...f, [field]: val } : f)
    }));
  };

  const addFeatureRow = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { id: Date.now().toString(), name: '', value: '', unit: '' }]
    }));
  };

  const removeFeatureRow = (id: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f.id !== id)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeAndCompressImage(file);
      setFormData(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      console.error("Errore caricamento immagine:", err);
      setFormError("Errore durante il caricamento dell'immagine. Prova con un'immagine più piccola.");
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormError('');
    setFormData({
      name: '',
      description: '',
      price: 0,
      inShowcase: false,
      image: '',
      features: [{ id: Date.now().toString(), name: '', value: '', unit: '' }]
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormError('');
    setFormSuccess('');
    setFormData({ ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name || formData.price === undefined || formData.price <= 0) {
      setFormError("Nome e Prezzo (maggiore di 0) sono obbligatori.");
      return;
    }
    
    // Check if at least one feature has both name and value
    const validFeatures = formData.features?.filter(f => f.name.trim() && f.value.trim()) || [];
    if (validFeatures.length === 0) {
       setFormError("Inserisci almeno una caratteristica valida (Nome e Valore).");
       return;
    }

    const newProduct: Product = {
      id: isEditing || Date.now().toString(),
      name: formData.name,
      description: formData.description || '',
      price: Number(formData.price),
      inShowcase: !!formData.inShowcase,
      image: formData.image || '',
      features: validFeatures
    };

    if (isEditing) {
      updateProduct(newProduct);
      setFormSuccess("Prodotto aggiornato con successo!");
    } else {
      addProduct(newProduct);
      setFormSuccess("Prodotto aggiunto con successo!");
    }
    resetForm();
    setTimeout(() => setFormSuccess(''), 3000);
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mb-20 text-center border border-gray-100">
           <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldCheck className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Amministratore</h2>
           <p className="text-gray-500 mb-8">Accedi con il tuo account amministratore.</p>
           
           <div className="space-y-4">
             {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
             <button 
               onClick={handleLogin}
               className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
             >
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               Accedi con Google
             </button>
             <button 
               type="button"
               onClick={() => window.location.href = '/'}
               className="w-full py-3 text-gray-500 hover:text-gray-900 font-medium transition-colors"
             >
               Torna al sito
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-900 text-white pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
               <h1 className="text-3xl font-bold">Dashboard Admin</h1>
               <p className="text-gray-400 mt-2">Gestisci i prodotti e visualizza i contatti dei clienti.</p>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
             >
               <LogOut className="w-4 h-4" />
               Esci
             </button>
           </div>
           
           <div className="flex gap-4 mt-8">
             <button 
               onClick={() => setActiveTab('products')}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
             >
               <Package className="w-5 h-5" />
               Prodotti
             </button>
             <button 
               onClick={() => setActiveTab('customers')}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'customers' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
             >
               <Users className="w-5 h-5" />
               Clienti
             </button>
           </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-24">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                 <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                   {isEditing ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                   {isEditing && (
                     <button onClick={resetForm} className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">Annulla</button>
                   )}
                 </h2>

                 {formError && (
                   <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                     {formError}
                   </div>
                 )}
                 {formSuccess && (
                   <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm">
                     {formSuccess}
                   </div>
                 )}
                 
                 <form onSubmit={saveProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Prodotto *</label>
                      <input 
                        type="text" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                      <textarea 
                        rows={3}
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo (€) *</label>
                      <input 
                        type="number" step="0.01" min="0" required
                        value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="pt-2">
                       <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                         <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${formData.inShowcase ? 'bg-orange-500' : 'bg-white border border-gray-300'}`}>
                           {formData.inShowcase && <Check className="w-4 h-4 text-white" />}
                         </div>
                         <input 
                           type="checkbox" className="hidden"
                           checked={formData.inShowcase}
                           onChange={e => setFormData({...formData, inShowcase: e.target.checked})}
                         />
                         <span className="font-medium text-gray-900">Aggiungi in Vetrina</span>
                       </label>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Immagine</label>
                      <div className="space-y-3">
                         <input 
                           type="url" placeholder="URL immagine (opzionale)"
                           value={formData.image?.startsWith('data:') ? '' : formData.image}
                           onChange={e => setFormData({...formData, image: e.target.value})}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                         />
                         <div className="relative">
                            <input 
                              type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload}
                              className="hidden" id="file-upload"
                            />
                            <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-colors text-sm font-medium">
                              <ImageIcon className="w-4 h-4" />
                              Carica dal dispositivo
                            </label>
                         </div>
                         {formData.image && (
                           <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                             <Check className="w-3 h-3" /> Immagine inserita
                           </div>
                         )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Caratteristiche *</label>
                        <button type="button" onClick={addFeatureRow} className="text-xs text-orange-600 font-medium hover:underline flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Aggiungi riga
                        </button>
                      </div>
                      <div className="space-y-2">
                         {formData.features?.map(feature => (
                           <div key={feature.id} className="flex gap-2">
                             <input 
                               type="text" placeholder="Es. Batteria"
                               value={feature.name} onChange={e => handleFeatureChange(feature.id, 'name', e.target.value)}
                               className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                             />
                             <input 
                               type="text" placeholder="Valore (es. 1000)"
                               value={feature.value} onChange={e => handleFeatureChange(feature.id, 'value', e.target.value)}
                               className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                             />
                             <select 
                               value={feature.unit || ''} onChange={e => handleFeatureChange(feature.id, 'unit', e.target.value)}
                               className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                             >
                               <option value="">- unità -</option>
                               <option value="mAh">mAh</option>
                               <option value="ml">ml</option>
                             </select>
                             <button type="button" onClick={() => removeFeatureRow(feature.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                               <X className="w-4 h-4" />
                             </button>
                           </div>
                         ))}
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-3 mt-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                    >
                      {isEditing ? 'Salva Modifiche' : 'Salva Prodotto'}
                    </button>
                 </form>
               </div>
            </div>
            
            {/* List Column */}
            <div className="lg:col-span-2">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                 <h2 className="text-xl font-bold mb-6">Elenco Prodotti ({products.length})</h2>
                 
                 {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Nessun prodotto presente. Aggiungine uno dal modulo.
                    </div>
                 ) : (
                   <div className="space-y-4">
                     {products.map(p => (
                       <div key={p.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors bg-gray-50/50">
                         <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            {p.image ? (
                              <img src={p.image} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                         </div>
                         <div className="flex-grow">
                           <h4 className="font-bold text-gray-900">{p.name}</h4>
                           <p className="text-orange-500 font-semibold text-sm mt-0.5">€ {p.price.toFixed(2)}</p>
                           {p.inShowcase && <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium bg-green-100 text-green-700 rounded">In Vetrina</span>}
                         </div>
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={() => startEdit(p)}
                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                             title="Modifica"
                           >
                             <Edit2 className="w-5 h-5" />
                           </button>
                           <button 
                             onClick={() => deleteProduct(p.id)}
                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                             title="Elimina"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
               <h2 className="text-xl font-bold">Dati Clienti (Offerte)</h2>
               <p className="text-gray-500 text-sm mt-1">Lista dei clienti iscritti per ricevere le offerte su WhatsApp.</p>
             </div>
             
             {customers.length === 0 ? (
               <div className="p-12 text-center text-gray-500">
                 Nessun cliente registrato finora.
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-600">
                   <thead className="bg-gray-50 text-gray-900 text-xs uppercase tracking-wider">
                     <tr>
                       <th className="px-6 py-4 font-semibold">Data</th>
                       <th className="px-6 py-4 font-semibold">Nome</th>
                       <th className="px-6 py-4 font-semibold">Cognome</th>
                       <th className="px-6 py-4 font-semibold">WhatsApp</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {customers.map(c => (
                       <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap">{new Date(c.date).toLocaleDateString('it-IT')}</td>
                         <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                         <td className="px-6 py-4 font-medium text-gray-900">{c.surname}</td>
                         <td className="px-6 py-4">{c.phone}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        )}
      </main>
    </>
  );
}
