import React from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Calendar, ExternalLink, ArrowRight, Clock, AlertCircle, Plus, Check, Briefcase } from 'lucide-react';

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
    <div className={`bg-white rounded-[1.5rem] p-1 border transition-all duration-300 hover:-translate-y-1 group ${isSelected ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20 border-transparent' : !isActive ? 'border-red-100 bg-red-50/20' : 'border-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                 {!isActive && (
                 <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full border border-red-200 font-bold uppercase tracking-wide">
                   Avslutad / Gammal
                 </span>
              )}
              {isActive && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Aktiv
                  </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-2 leading-tight">
              {assignment.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm mt-3 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                <Building2 size={14} className="text-emerald-500/70" /> {assignment.client}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                <MapPin size={14} className="text-emerald-500/70" /> {assignment.location}
              </span>
            </div>
          </div>
          
          {!hideSelection && onToggleSelect && (
            <button 
              onClick={() => onToggleSelect(assignment)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isSelected 
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {isSelected ? <Check size={14} /> : <Plus size={14} />}
              {isSelected ? 'Vald' : 'Välj'}
            </button>
          )}
        </div>

        <div className="flex-grow">
            <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {assignment.description}
            </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">
                <Calendar size={12} className={isDateUnknown ? "text-amber-500" : "text-slate-400"} />
                {isDateUnknown ? (
                  <span className="text-amber-500">Datum saknas</span>
                ) : (
                  <span>{assignment.datePosted}</span>
                )}
             </div>
             {assignment.deadline && (
               <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock size={12} />
                  Deadline: {assignment.deadline}
               </div>
             )}
          </div>
          
          {assignment.url && (
            <a 
              href={assignment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"
            >
              Ansök <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;