import React from 'react';
import { useEncryption } from '../context/EncryptionContext';

const InputSection: React.FC = () => {
  const { state, setInput } = useEncryption();
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-white mb-4">
        {state.isEncrypting ? 'Plaintext Input' : 'Ciphertext Input'}
      </h3>
      <div className="mb-4">
        <textarea
          value={state.input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={state.isEncrypting ? "Enter text to encrypt..." : "Enter text to decrypt..."}
          className="w-full h-64 px-4 py-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
        />
      </div>
      <div className="text-slate-400 text-sm">
        <p>
          {state.isEncrypting 
            ? "Enter your text above to encrypt using your selected algorithms."
            : "Enter your ciphertext above to decrypt using your selected algorithms."}
        </p>
        {state.error && (
          <div className="mt-3 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
            {state.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;