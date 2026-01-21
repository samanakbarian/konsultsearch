import React from 'react';
import { Assignment } from '../types';
import { Building2, MapPin, Check, Plus, Timer, Globe2, Sparkles } from 'lucide-react';

interface Props {
  assignment: Assignment;
  isSelected?: boolean;
  onToggleSelect?: (assignment: Assignment) => void;
  hideSelection?: boolean;
}

const AssignmentCard: React.FC<Props> = ({ assignment, isSelected, onToggleSelect, hideSelection }) => {
  const isDateUnknown = !assignment.datePosted || assignment.datePosted === 'Okänt';
  const isActive = assignment.isActive !== false;
  
  // Logic to determine "freshness" visual
  const isFresh = !isDateUnknown && (assignment.datePosted?.includes('tim') || assignment.datePosted?.includes('idag'));

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] p-1 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]'
      } ${!isActive ? 'opacity-75 grayscale-[0.8]' : ''}`}
    >
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${isSelected ? 'bg-emerald-100' : ''}`} />

      <div className="relative p-6 h-full flex flex-col z-10">
        
        {/* Header: Company & Title */}
        <div className="flex items-start gap-5 mb-4">
           {/* Company Logo / Placeholder */}
           <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
              <Building2 size={24} />
           </div>

           <div className="flex-1 min-w-0 pt-1">
             <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors" title={assignment.title}>
                  {assignment.title}
                </h3>
                {isFresh && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                        <Sparkles size={8} fill="currentColor"/> Ny
                    </span>
                )}
             </div>

             <div className="flex flex-col gap-1 mt-1.5">
               <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500 truncate">
                 {assignment.client}
               </span>
               <span className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                 <MapPin size={12} />
                 {assignment.location}
               </span>
             </div>
           </div>
        </div>

        {/* Description */}
        <div className="mb-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 to-transparent rounded-full"></div>
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed pl-4">
            {assignment.description}
          </p>
        </div>

        {/* Footer: Meta & Actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
           
           {/* Left: Source & Date */}
           <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Globe2 size={12} className="text-emerald-500" />
                <span>Webb</span>
             </div>
             <div className={`flex items-center gap-1.5 text-[10px] font-medium ${isDateUnknown ? 'text-amber-500' : 'text-slate-400'}`}>
                <Timer size={10} />
                {assignment.datePosted || 'Nyligen'}
             </div>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-2">
                {!hideSelection && onToggleSelect && (
                  <button 
                    onClick={() => onToggleSelect(assignment)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                      isSelected 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`}
                    title={isSelected ? "Ta bort" : "Lägg till"}
                  >
                    {isSelected ? <Check size={16} strokeWidth={3} /> : <Plus size={18} />}
                  </button>
                )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AssignmentCard;