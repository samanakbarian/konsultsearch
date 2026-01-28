import React, { useState } from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Check, Plus, CalendarClock, Globe2, Zap, ChevronDown, ChevronUp, FileText, AlertCircle, ExternalLink, Link2 } from 'lucide-react';

interface Props {
  assignment: Assignment;
  isSelected?: boolean;
  onToggleSelect?: (assignment: Assignment) => void;
  hideSelection?: boolean;
}

const AssignmentCard: React.FC<Props> = ({ assignment, isSelected, onToggleSelect, hideSelection }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isDateUnknown = !assignment.datePosted || assignment.datePosted === 'Okänt';
  const isActive = assignment.isActive !== false;
  
  // Logic to determine "freshness" visual
  const isFresh = !isDateUnknown && (assignment.datePosted?.includes('tim') || assignment.datePosted?.includes('idag'));

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] transition-all duration-300 overflow-hidden flex flex-col ${
        isSelected 
          ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1'
      } ${!isActive ? 'opacity-75 grayscale-[0.8]' : ''}`}
    >
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${isSelected ? 'bg-emerald-100' : ''}`} />

      <div className="relative p-6 z-10 flex-grow">
        
        {/* Header: Company & Title */}
        <div className="flex items-start gap-5 mb-4">
           {/* Company Logo / Placeholder */}
           <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
              <Building2 size={24} />
           </div>

           <div className="flex-1 min-w-0 pt-1">
             <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors" title={assignment.title}>
                  {assignment.title}
                </h3>
                {isFresh && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide border border-emerald-200">
                        <Zap size={8} fill="currentColor"/> Ny
                    </span>
                )}
             </div>

             <div className="flex flex-col gap-1 mt-1.5">
               <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 truncate">
                 {assignment.client}
               </span>
               <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                    <MapPin size={12} className="text-emerald-400" />
                    {assignment.location}
                  </span>
                  {assignment.source && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800/80 bg-emerald-50/50">
                        <Link2 size={10} /> {assignment.source}
                    </span>
                  )}
               </div>
             </div>
           </div>
        </div>

        {/* Short Description (Visible when collapsed) */}
        {!isExpanded && (
            <div className="mb-2 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 to-transparent rounded-full"></div>
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed pl-4">
                {assignment.description}
            </p>
            </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
            <div className="space-y-4 animate-fade-in mt-2">
                
                {/* Full Description */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 mb-2">
                        <FileText size={12} /> Uppdragsbeskrivning
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {assignment.description}
                    </p>
                </div>

                {/* Deadlines & Meta */}
                <div className="flex gap-4">
                    {assignment.deadline && (
                        <div className="flex-1 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                            <div>
                                <span className="block text-[10px] font-bold uppercase text-amber-700">Deadline</span>
                                <span className="text-sm font-medium text-amber-900">{assignment.deadline}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-3">
                         <CalendarClock size={16} className="text-slate-400 mt-0.5" />
                         <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-400">Publicerad</span>
                            <span className="text-sm font-medium text-slate-600">{assignment.datePosted || 'Nyligen'}</span>
                        </div>
                    </div>
                </div>
                
                {/* Source Link */}
                {assignment.url && (
                    <div className="pt-2">
                        <a 
                            href={assignment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-900/20"
                        >
                            <ExternalLink size={14} />
                            Gå till annons hos {assignment.source || 'källa'}
                        </a>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Footer: Meta & Actions */}
      <div className="mt-auto pt-3 pb-3 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
           
           <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-50"
            >
              {isExpanded ? (
                <>Dölj detaljer <ChevronUp size={14} /></>
              ) : (
                <>Läs hela uppdraget <ChevronDown size={14} /></>
              )}
           </button>

           <div className="flex items-center gap-2">
                {!hideSelection && onToggleSelect && (
                  <button 
                    onClick={() => onToggleSelect(assignment)}
                    className={`flex items-center gap-2 pr-4 pl-3 py-2 rounded-full transition-all border ${
                      isSelected 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30'
                    }`}
                  >
                    {isSelected ? (
                        <>
                        <Check size={14} strokeWidth={3} />
                        <span className="text-xs font-bold">Vald</span>
                        </>
                    ) : (
                        <>
                        <Plus size={14} />
                        <span className="text-xs font-bold">Välj</span>
                        </>
                    )}
                  </button>
                )}
           </div>
      </div>
    </div>
  );
};

export default AssignmentCard;