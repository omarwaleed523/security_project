import React from 'react';
import { useEncryption } from '../context/EncryptionContext';
import InputSection from './InputSection';
import AlgorithmSection from './AlgorithmSection';
import ResultsSection from './ResultsSection';

const EncryptionDashboard: React.FC = () => {
  const { state, toggleEncryptionMode } = useEncryption();
  
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">
          {state.isEncrypting ? 'Encryption Mode' : 'Decryption Mode'}
        </h2>
        <button
          onClick={toggleEncryptionMode}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          Switch to {state.isEncrypting ? 'Decryption' : 'Encryption'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InputSection />
        </div>
        <div className="lg:col-span-2">
          <AlgorithmSection />
        </div>
      </div>
      
      <ResultsSection />
    </div>
  );
};

export default EncryptionDashboard;