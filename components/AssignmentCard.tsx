import React from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Check, Plus, ArrowRight } from 'lucide-react';

interface Props {
  assignment: Assignment;
  isSelected?: boolean;
  onToggleSelect?: (assignment: Assignment, e: React.MouseEvent) => void;
  compactMode?: boolean;
  hideSelection?: boolean;
}

const AssignmentCard: React.FC<Props> = ({ assignment, isSelected, onToggleSelect, hideSelection }) => {
  const isActive = assignment.isActive !== false;

  return (
    <div className={`group relative bg-white rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 border flex flex-col h-full ${isSelected ? 'border-teal-500 ring-1 ring-teal-500 shadow-teal-100' : 'border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/5'} ${!isActive ? 'opacity-60' : ''}`}>
       
       <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-teal-600 bg-teal-50 border border-teal-100/50`}>
             <Building2 size={20} />
          </div>
          {!hideSelection && onToggleSelect && (
             <button 
               onClick={(e) => onToggleSelect(assignment, e)}
               className={`p-2 rounded-full transition-all ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-teal-100 hover:text-teal-600'}`}
             >
                {isSelected ? <Check size={14} strokeWidth={3}/> : <Plus size={14} strokeWidth={3}/>}
             </button>
          )}
       </div>

       <div className="mb-4 flex-grow">
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-teal-700 transition-colors" title={assignment.title}>
             {assignment.title}
          </h3>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wide truncate">{assignment.client}</p>
       </div>

       <div className="space-y-3 pt-3 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <MapPin size={14} className="text-slate-400"/> {assignment.location}
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                {assignment.source || 'Direkt'}
             </span>
             <span className="text-xs font-bold text-teal-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Detaljer <ArrowRight size={12}/>
             </span>
          </div>
       </div>
    </div>
  );
};

export default AssignmentCard;