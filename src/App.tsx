/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Compare from './pages/Compare';
import AllProducts from './pages/AllProducts';
import Admin from './pages/Admin';
import OfferModal from './components/OfferModal';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white pb-20 sm:pb-0 flex flex-col">
          <OfferModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/all" element={<AllProducts />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
