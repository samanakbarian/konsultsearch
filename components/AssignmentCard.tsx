import React from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Check, Plus, ArrowRight, Calendar, Clock, ExternalLink } from 'lucide-react';

interface Props {
  assignment: Assignment;
  isSelected?: boolean;
  onToggleSelect?: (assignment: Assignment, e: React.MouseEvent) => void;
  compactMode?: boolean;
  hideSelection?: boolean;
}

const AssignmentCard: React.FC<Props> = ({ assignment, isSelected, onToggleSelect, compactMode = false, hideSelection }) => {
  const isActive = assignment.isActive !== false;

  // Smart Link Logic: If URL looks invalid or missing, create a Google Search link
  const getSafeLink = () => {
    if (assignment.url && assignment.url.startsWith('http')) {
      return assignment.url;
    }
    // Fallback: Google Search
    const query = `${assignment.title} ${assignment.client} ${assignment.location} konsultuppdrag`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const safeLink = getSafeLink();
  const isSearchFallback = !assignment.url || !assignment.url.startsWith('http');

  return (
    <div className={`group relative bg-white rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 border flex flex-col h-full ${isSelected ? 'border-teal-500 ring-1 ring-teal-500 shadow-teal-100' : 'border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/5'} ${!isActive ? 'opacity-60' : ''}`}>
       
       {/* Header */}
       <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3 items-start w-full">
            <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-teal-600 bg-teal-50 border border-teal-100/50`}>
                <Building2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-0.5">{assignment.client}</p>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors pr-2" title={assignment.title}>
                        {assignment.title}
                    </h3>
                  </div>
              </div>
            </div>
          </div>
          
          {!hideSelection && onToggleSelect && (
             <button 
               onClick={(e) => onToggleSelect(assignment, e)}
               className={`p-2 shrink-0 rounded-full transition-all ml-2 ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-teal-100 hover:text-teal-600'}`}
             >
                {isSelected ? <Check size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>}
             </button>
          )}
       </div>

       {/* Description Snippet - Increased line clamp for more info */}
       {!compactMode && assignment.description && (
         <div className="mb-4 flex-grow bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
           <p className="text-xs text-slate-600 line-clamp-6 leading-relaxed font-medium">
             {assignment.description}
           </p>
         </div>
       )}

       {/* Meta Info */}
       <div className={`space-y-3 pt-3 border-t border-slate-50 ${!compactMode ? 'mt-auto' : ''}`}>
          <div className="flex flex-col gap-1.5">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin size={14} className="text-slate-400 shrink-0"/> 
                <span className="truncate">{assignment.location}</span>
             </div>
             {!compactMode && (
               <>
                 {assignment.deadline && (
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={14} className="text-slate-400 shrink-0"/> Deadline: {assignment.deadline}
                   </div>
                 )}
               </>
             )}
          </div>
          
          <div className="flex justify-between items-center mt-2 pt-1">
             <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200">
                {assignment.source || 'Direkt'}
             </span>
             
             {/* External Link Action - Stop propagation to prevent drawer opening if clicked */}
             <a 
                href={safeLink} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 hover:underline decoration-2 underline-offset-2 transition-colors"
             >
                {isSearchFallback ? 'Sök annons' : 'Ansök'} <ExternalLink size={12}/>
             </a>
          </div>
       </div>
    </div>
  );
};

export default AssignmentCard;