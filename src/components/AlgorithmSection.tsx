import React from 'react';
import { useEncryption } from '../context/EncryptionContext';
import AlgorithmCard from './AlgorithmCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const AlgorithmSection: React.FC = () => {
  const { state, reorderAlgorithms } = useEncryption();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = state.algorithmSequence.findIndex(item => item.id === active.id);
      const newIndex = state.algorithmSequence.findIndex(item => item.id === over.id);
      reorderAlgorithms(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-white mb-4">Encryption Algorithms</h3>
      <p className="text-slate-400 mb-6">
        Select and configure the encryption algorithms to use. Drag to reorder the algorithms.
      </p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.algorithmSequence.map(algo => algo.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {state.algorithmSequence.map((algo, index) => (
              <AlgorithmCard
                key={algo.id}
                algorithm={algo}
                index={index}
                isEncrypting={state.isEncrypting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default AlgorithmSection;