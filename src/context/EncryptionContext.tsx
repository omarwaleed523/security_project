import React, { createContext, useContext, useState, useEffect } from 'react';
import { encryptAES, decryptAES } from '../algorithms/aes';
import { encryptAutokey, decryptAutokey } from '../algorithms/autokey';
import { encryptVigenere, decryptVigenere } from '../algorithms/vigenere';
import { formatToHex, formatFromHex } from '../utils/formatters';

// Define types
export type AlgorithmType = 'aes' | 'autokey' | 'vigenere';

export interface AlgorithmConfig {
  id: string;
  type: AlgorithmType;
  enabled: boolean;
  params: {
    key: string;
    [key: string]: any;
  };
}

interface EncryptionState {
  input: string;
  algorithmSequence: AlgorithmConfig[];
  intermediateResults: { id: string; result: string }[];
  finalResult: string;
  isEncrypting: boolean;
  error: string | null;
}

interface EncryptionContextType {
  state: EncryptionState;
  setInput: (input: string) => void;
  toggleAlgorithm: (id: string, enabled: boolean) => void;
  updateAlgorithmParam: (id: string, paramName: string, value: any) => void;
  reorderAlgorithms: (sourceIndex: number, destinationIndex: number) => void;
  toggleEncryptionMode: () => void;
  resetState: () => void;
}

const defaultAlgorithmSequence: AlgorithmConfig[] = [
  {
    id: 'aes1',
    type: 'aes',
    enabled: true,
    params: {
      key: 'mysecretkey12345',
      format: 'text'
    }
  },
  {
    id: 'autokey1',
    type: 'autokey',
    enabled: false,
    params: {
      key: 'SECRET'
    }
  },
  {
    id: 'vigenere1',
    type: 'vigenere',
    enabled: false,
    params: {
      key: 'CIPHER'
    }
  }
];

const initialState: EncryptionState = {
  input: '',
  algorithmSequence: defaultAlgorithmSequence,
  intermediateResults: [],
  finalResult: '',
  isEncrypting: true,
  error: null
};

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EncryptionState>(initialState);

  const setInput = (input: string) => {
    setState(prevState => ({ ...prevState, input }));
  };

  const toggleAlgorithm = (id: string, enabled: boolean) => {
    setState(prevState => ({
      ...prevState,
      algorithmSequence: prevState.algorithmSequence.map(algo => 
        algo.id === id ? { ...algo, enabled } : algo
      )
    }));
  };

  const updateAlgorithmParam = (id: string, paramName: string, value: any) => {
    setState(prevState => ({
      ...prevState,
      algorithmSequence: prevState.algorithmSequence.map(algo => 
        algo.id === id ? { 
          ...algo, 
          params: { ...algo.params, [paramName]: value } 
        } : algo
      )
    }));
  };

  const reorderAlgorithms = (sourceIndex: number, destinationIndex: number) => {
    setState(prevState => {
      const newSequence = [...prevState.algorithmSequence];
      const [removed] = newSequence.splice(sourceIndex, 1);
      newSequence.splice(destinationIndex, 0, removed);
      return { ...prevState, algorithmSequence: newSequence };
    });
  };

  const toggleEncryptionMode = () => {
    setState(prevState => ({ 
      ...prevState, 
      isEncrypting: !prevState.isEncrypting,
      input: prevState.finalResult,
      finalResult: prevState.input,
      intermediateResults: []
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  useEffect(() => {
    if (!state.input) {
      setState(prevState => ({ 
        ...prevState, 
        intermediateResults: [],
        finalResult: '',
        error: null
      }));
      return;
    }

    try {
      const enabledAlgorithms = state.algorithmSequence.filter(algo => algo.enabled);
      
      if (enabledAlgorithms.length === 0) {
        setState(prevState => ({ 
          ...prevState, 
          intermediateResults: [],
          finalResult: prevState.input,
          error: null
        }));
        return;
      }
      
      let currentText = state.input;
      const intermediateResults: { id: string; result: string }[] = [];
      
      if (state.isEncrypting) {
        // Encryption flow
        for (const algo of enabledAlgorithms) {
          let result = '';
          
          switch (algo.type) {
            case 'aes':
              result = encryptAES(currentText, algo.params.key, algo.params.format);
              break;
            case 'autokey':
              result = encryptAutokey(currentText, algo.params.key);
              break;
            case 'vigenere':
              result = encryptVigenere(currentText, algo.params.key);
              break;
          }
          
          intermediateResults.push({ id: algo.id, result });
          currentText = result;
        }
      } else {
        // Decryption flow (reverse order)
        for (const algo of [...enabledAlgorithms].reverse()) {
          let result = '';
          
          switch (algo.type) {
            case 'aes':
              result = decryptAES(currentText, algo.params.key, algo.params.format);
              break;
            case 'autokey':
              result = decryptAutokey(currentText, algo.params.key);
              break;
            case 'vigenere':
              result = decryptVigenere(currentText, algo.params.key);
              break;
          }
          
          intermediateResults.push({ id: algo.id, result });
          currentText = result;
        }
      }
      
      setState(prevState => ({ 
        ...prevState, 
        intermediateResults,
        finalResult: currentText,
        error: null
      }));
    } catch (error) {
      setState(prevState => ({ 
        ...prevState, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  }, [state.input, state.algorithmSequence, state.isEncrypting]);

  return (
    <EncryptionContext.Provider value={{ 
      state, 
      setInput, 
      toggleAlgorithm, 
      updateAlgorithmParam,
      reorderAlgorithms,
      toggleEncryptionMode,
      resetState
    }}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};