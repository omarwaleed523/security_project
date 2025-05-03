import React from 'react';
import { EncryptionProvider } from './context/EncryptionContext';
import EncryptionDashboard from './components/EncryptionDashboard';
import Header from './components/Header';

function App() {
  return (
    <EncryptionProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <EncryptionDashboard />
        </main>
      </div>
    </EncryptionProvider>
  );
}

export default App;