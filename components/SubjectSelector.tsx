import React from 'react';
import { Subject, SubjectConfig } from '../types';
import { SUBJECTS } from '../constants';

interface SubjectSelectorProps {
  currentSubject: Subject;
  onSelect: (subject: Subject) => void;
  disabled?: boolean;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ currentSubject, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 p-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
      {SUBJECTS.map((subject: SubjectConfig) => (
        <button
          key={subject.id}
          onClick={() => onSelect(subject.id)}
          disabled={disabled}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${currentSubject === subject.id 
              ? 'bg-primary-600 text-white shadow-md scale-105' 
              : `${subject.color} hover:shadow-sm opacity-80 hover:opacity-100`}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span>{subject.icon}</span>
          <span>{subject.name}</span>
        </button>
      ))}
    </div>
  );
};

export default SubjectSelector;
