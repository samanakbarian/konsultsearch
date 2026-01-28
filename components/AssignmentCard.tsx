import React, { useState } from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Check, Plus, CalendarClock, Zap, ChevronDown, ChevronUp, FileText, AlertCircle, ExternalLink, Link2, Search, Briefcase } from 'lucide-react';

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
  
  const isFresh = !isDateUnknown && (assignment.datePosted?.includes('tim') || assignment.datePosted?.includes('idag'));

  const hasValidUrl = assignment.url && assignment.url.length > 8 && (assignment.url.startsWith('http') || assignment.url.startsWith('www'));
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${assignment.title} ${assignment.client} ${assignment.location || 'Sverige'} konsultuppdrag`)}`;
  const targetUrl = hasValidUrl ? assignment.url! : searchUrl;
  const isFallback = !hasValidUrl;

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] transition-all duration-500 ease-out flex flex-col overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20 translate-y-[-4px]' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 hover:border-emerald-200'
      } ${!isActive ? 'opacity-75 grayscale-[0.8]' : ''}`}
    >
      {/* --- Animated Background Decor --- */}
      
      {/* Corner Blob */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-125 group-hover:bg-emerald-100/80 ${isSelected ? 'bg-emerald-100' : ''}`} />
      
      {/* Floating Icon Decor */}
      <div className="absolute bottom-10 right-10 text-emerald-50 opacity-0 group-hover:opacity-20 transition-all duration-700 transform group-hover:rotate-[-10deg] group-hover:scale-125 pointer-events-none">
          <Briefcase size={100} />
      </div>

      <div className="relative p-6 z-10 flex-grow">
        
        {/* Header: Company & Title */}
        <div className="flex items-start gap-5 mb-4">
           {/* Company Logo / Placeholder */}
           <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-500 group-hover:shadow-emerald-200 group-hover:shadow-md relative overflow-hidden ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Building2 size={24} className="relative z-10 transform group-hover:scale-110 transition-transform duration-300"/>
           </div>

           <div className="flex-1 min-w-0 pt-1">
             <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors duration-300" title={assignment.title}>
                  {assignment.title}
                </h3>
                {isFresh && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide border border-emerald-200 shadow-sm animate-pulse-slow">
                        <Zap size={10} fill="currentColor"/> Ny
                    </span>
                )}
             </div>

             <div className="flex flex-col gap-1 mt-1.5">
               <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 truncate group-hover:text-slate-700 transition-colors">
                 {assignment.client}
               </span>
               <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 truncate group-hover:text-slate-500 transition-colors">
                    <MapPin size={12} className="text-emerald-400" />
                    {assignment.location}
                  </span>
                  {assignment.source && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                        <Link2 size={10} /> {assignment.source}
                    </span>
                  )}
               </div>
             </div>
           </div>
        </div>

        {/* Short Description (Visible when collapsed) */}
        <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="mb-2 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 to-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed pl-4 group-hover:text-slate-700 transition-colors">
                    {assignment.description}
                </p>
            </div>
        </div>

        {/* Expanded Details */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 pt-2">
                
                {/* Full Description */}
                <div className="bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2 mb-2">
                        <FileText size={12} className="text-emerald-500" /> Uppdragsbeskrivning
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {assignment.description}
                    </p>
                </div>

                {/* Deadlines & Meta */}
                <div className="flex gap-4">
                    {assignment.deadline && (
                        <div className="flex-1 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-3 group/deadline hover:bg-amber-100/50 transition-colors">
                            <AlertCircle size={16} className="text-amber-500 mt-0.5 group-hover/deadline:scale-110 transition-transform" />
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
                
                {/* Source Link (Smart Fallback) */}
                <div className="pt-2">
                    <a 
                        href={targetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] relative overflow-hidden ${
                            isFallback 
                            ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-900/10' 
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'
                        }`}
                    >
                        {/* Shine Effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/btn:animate-shine" />
                        
                        {isFallback ? <Search size={14} /> : <ExternalLink size={14} />}
                        <span className="relative z-10">
                            {isFallback 
                                ? `Sök manuellt: ${assignment.client}` 
                                : `Ansök hos ${assignment.source || 'källa'}`
                            }
                        </span>
                    </a>
                    {isFallback && (
                         <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                             <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                             Direktlänk saknas – omdirigerar till Google Sök.
                         </p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Footer: Meta & Actions */}
      <div className="mt-auto pt-3 pb-3 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm group-hover:bg-slate-50/80 transition-colors">
           
           <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-all px-3 py-2 rounded-xl hover:bg-emerald-50 active:scale-95"
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
                    className={`flex items-center gap-2 pr-5 pl-4 py-2.5 rounded-full transition-all duration-300 transform active:scale-90 ${
                      isSelected 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-inner' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                    }`}
                  >
                    {isSelected ? (
                        <>
                        <Check size={14} strokeWidth={3} />
                        <span className="text-xs font-bold">Vald</span>
                        </>
                    ) : (
                        <>
                        <Plus size={14} strokeWidth={2.5} />
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