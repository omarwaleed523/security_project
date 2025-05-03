import React, { useState } from 'react';
import { AlgorithmConfig, useEncryption } from '../context/EncryptionContext';
import { Lock, KeyRound, KeySquare, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AlgorithmCardProps {
  algorithm: AlgorithmConfig;
  index: number;
  isEncrypting: boolean;
}

const algorithmDetails = {
  aes: {
    name: 'AES',
    description: 'Advanced Encryption Standard - A symmetric block cipher with 128-bit blocks',
    icon: Lock,
    color: 'text-blue-400'
  },
  autokey: {
    name: 'Autokey',
    description: 'A polyalphabetic substitution cipher that uses the plaintext as part of the key',
    icon: KeyRound,
    color: 'text-green-400'
  },
  vigenere: {
    name: 'Vigenère',
    description: 'A method of encrypting text using a series of interwoven Caesar ciphers',
    icon: KeySquare,
    color: 'text-amber-400'
  }
};

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, index, isEncrypting }) => {
  const { toggleAlgorithm, updateAlgorithmParam } = useEncryption();
  const [expanded, setExpanded] = useState(algorithm.enabled);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: algorithm.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };
  
  const details = algorithmDetails[algorithm.type];
  const IconComponent = details.icon;
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg transition-all duration-300 ${
        algorithm.enabled 
          ? 'border-cyan-500 bg-slate-700' 
          : 'border-slate-600 bg-slate-800'
      } ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-cyan-400 text-slate-500"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className={`rounded-full p-2 ${algorithm.enabled ? details.color : 'text-slate-500'}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-white">{details.name}</h4>
            <p className="text-sm text-slate-400">{details.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {expanded ? 'Hide' : 'Configure'}
          </button>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={algorithm.enabled}
              onChange={(e) => toggleAlgorithm(algorithm.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-cyan-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>
      </div>
      
      {expanded && algorithm.enabled && (
        <div className="border-t border-slate-600 p-4 space-y-4">
          {algorithm.type === 'aes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Format</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`format-${algorithm.id}`}
                      checked={algorithm.params.format === 'text'}
                      onChange={() => updateAlgorithmParam(algorithm.id, 'format', 'text')}
                      className="form-radio text-cyan-600"
                    />
                    <span className="ml-2 text-slate-300">Text</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`format-${algorithm.id}`}
                      checked={algorithm.params.format === 'hex'}
                      onChange={() => updateAlgorithmParam(algorithm.id, 'format', 'hex')}
                      className="form-radio text-cyan-600"
                    />
                    <span className="ml-2 text-slate-300">Hexadecimal</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Encryption Key</label>
                <input
                  type="text"
                  value={algorithm.params.key}
                  onChange={(e) => updateAlgorithmParam(algorithm.id, 'key', e.target.value)}
                  placeholder={algorithm.params.format === 'hex' ? "Enter hex key (16 bytes / 32 hex chars)" : "Enter key (16 chars max)"}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {algorithm.params.format === 'hex' 
                    ? "Key should be in hexadecimal format (e.g., A1B2C3...)" 
                    : "Key will be padded or truncated to 16 bytes"}
                </p>
              </div>
            </>
          )}
          
          {(algorithm.type === 'autokey' || algorithm.type === 'vigenere') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Key</label>
              <input
                type="text"
                value={algorithm.params.key}
                onChange={(e) => updateAlgorithmParam(algorithm.id, 'key', e.target.value)}
                placeholder="Enter encryption key"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                {algorithm.type === 'autokey' 
                  ? "Only alphabetic characters will be used. Key is case-insensitive." 
                  : "Only alphabetic characters will be used. Key is case-insensitive."}
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-slate-400">
              {isEncrypting ? 'Layer' : 'Decrypt Layer'} {index + 1}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmCard;