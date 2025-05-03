import React from 'react';
import { Lock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight">CipherCraft</h1>
        </div>
        <div className="text-sm text-slate-300">
          <span>Multi-Layer Encryption</span>
        </div>
      </div>
    </header>
  );
};

export default Header;