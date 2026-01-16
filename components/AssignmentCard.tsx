import React from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Calendar, ExternalLink, ArrowRight, Clock, AlertCircle, Plus, Check } from 'lucide-react';

interface Props {
  assignment: Assignment;
  isSelected?: boolean;
  onToggleSelect?: (assignment: Assignment) => void;
  hideSelection?: boolean;
}

const AssignmentCard: React.FC<Props> = ({ assignment, isSelected, onToggleSelect, hideSelection }) => {
  const isDateUnknown = !assignment.datePosted || assignment.datePosted === 'Okänt';
  const isActive = assignment.isActive !== false;

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 group ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : !isActive ? 'border-red-200 bg-red-50/10' : 'border-slate-200'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
              {assignment.title}
              {!isActive && (
                 <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full border border-red-200 font-bold uppercase">
                   Inaktiv/Gammal
                 </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Building2 size={14} />
              <span className="font-medium">{assignment.client}</span>
              <span className="text-slate-300 mx-1">|</span>
              <MapPin size={14} />
              <span>{assignment.location}</span>
            </div>
          </div>
          
          {!hideSelection && onToggleSelect && (
            <button 
              onClick={() => onToggleSelect(assignment)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSelected 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {isSelected ? <Check size={14} /> : <Plus size={14} />}
              {isSelected ? 'Vald' : 'Välj'}
            </button>
          )}
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar size={14} className={isDateUnknown ? "text-amber-500" : "text-slate-400"} />
                {isDateUnknown ? (
                  <span className="text-amber-600 flex items-center gap-1">
                     <AlertCircle size={12} /> Datum saknas/osäkert
                  </span>
                ) : (
                  <span>Publicerad: {assignment.datePosted}</span>
                )}
             </div>
             {assignment.deadline && (
               <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  Deadline: {assignment.deadline}
               </div>
             )}
          </div>
          
          {assignment.url && (
            <a 
              href={assignment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Ansök <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;