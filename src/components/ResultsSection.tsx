import React, { useState } from 'react';
import { useEncryption } from '../context/EncryptionContext';
import { copyToClipboard } from '../utils/clipboard';
import { formatForDisplay } from '../utils/formatters';
import { Copy, Check, Code } from 'lucide-react';

const ResultsSection: React.FC = () => {
  const { state } = useEncryption();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showIntermediate, setShowIntermediate] = useState(false);
  
  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };
  
  if (!state.input) {
    return null; // Don't show results section if there's no input
  }
  
  const enabledAlgorithms = state.algorithmSequence.filter(algo => algo.enabled);
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">
          {state.isEncrypting ? 'Encryption' : 'Decryption'} Results
        </h3>
        
        {enabledAlgorithms.length > 0 && (
          <button
            onClick={() => setShowIntermediate(!showIntermediate)}
            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors flex items-center space-x-1"
          >
            <Code className="h-4 w-4" />
            <span>{showIntermediate ? 'Hide' : 'Show'} Intermediate Results</span>
          </button>
        )}
      </div>
      
      {enabledAlgorithms.length === 0 ? (
        <div className="p-4 bg-slate-700 rounded-md text-slate-300">
          No encryption algorithms are enabled. Enable at least one algorithm to see results.
        </div>
      ) : (
        <>
          {showIntermediate && state.intermediateResults.length > 0 && (
            <div className="mb-6 space-y-4">
              <h4 className="text-md font-medium text-slate-300">Intermediate Results:</h4>
              {state.intermediateResults.map((result, index) => {
                const algorithm = state.algorithmSequence.find(a => a.id === result.id);
                if (!algorithm) return null;
                
                const algorithmName = algorithm.type.charAt(0).toUpperCase() + algorithm.type.slice(1);
                
                return (
                  <div key={result.id} className="p-4 bg-slate-700 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-slate-300 font-medium">
                        {state.isEncrypting 
                          ? `Layer ${index + 1}: ${algorithmName}` 
                          : `Layer ${state.intermediateResults.length - index}: ${algorithmName}`}
                      </div>
                      <button
                        onClick={() => handleCopy(result.result, result.id)}
                        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === result.id ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-800 p-3 rounded text-sm font-mono text-slate-300 overflow-x-auto">
                      {formatForDisplay(result.result)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div>
            <h4 className="text-md font-medium text-slate-300 mb-3">Final Result:</h4>
            <div className="p-4 bg-slate-700 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white font-medium">
                  {state.isEncrypting ? 'Encrypted Text' : 'Decrypted Text'}
                </div>
                <button
                  onClick={() => handleCopy(state.finalResult, 'final')}
                  className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId === 'final' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="bg-slate-800 p-3 rounded text-sm font-mono text-cyan-300 overflow-x-auto">
                {formatForDisplay(state.finalResult)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsSection;