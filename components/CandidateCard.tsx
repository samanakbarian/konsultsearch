import React from 'react';
import { Candidate } from '../types';
import { MapPin, Briefcase, Plus, Check, MoreHorizontal, User } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isSelected?: boolean;
  onToggleSelect?: (candidate: Candidate, e: React.MouseEvent) => void;
  compactMode?: boolean;
  hideSelection?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, isSelected, onToggleSelect, compactMode = false, hideSelection }) => {
  
  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const isHighMatch = candidate.matchScore >= 85;

  return (
    <div className={`group relative bg-white rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 border flex flex-col h-full ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5'}`}>
       
       {/* Header: Avatar, Name, Title, Score */}
       <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
             <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                {getInitials(candidate.name)}
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-700 transition-colors line-clamp-1">{candidate.name}</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[160px] flex items-center gap-1 mt-0.5">
                   <Briefcase size={10} /> {candidate.currentTitle}
                </p>
             </div>
          </div>
          
          <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${isHighMatch ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
             {candidate.matchScore}%
          </div>
       </div>

       {/* Expanded Info: Summary */}
       {!compactMode && candidate.summary && (
         <div className="mb-4 flex-grow">
           <p className="text-sm text-slate-600 line-clamp-6 leading-relaxed">
             {candidate.summary}
           </p>
         </div>
       )}

       {/* Meta & Skills */}
       <div className={`space-y-3 ${!compactMode ? 'mt-auto' : ''}`}>
          <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-50 pb-2">
             <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400"/> {candidate.location}
             </div>
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-hidden content-start">
             {(compactMode ? candidate.skills.slice(0, 3) : candidate.skills.slice(0, 5)).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600">
                   {skill}
                </span>
             ))}
             {candidate.skills.length > (compactMode ? 3 : 5) && (
               <span className="text-[10px] text-slate-400 pt-1 px-1">+{candidate.skills.length - (compactMode ? 3 : 5)}</span>
             )}
          </div>
       </div>

       {/* Footer Actions */}
       <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-50">
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group/btn cursor-pointer">
             Visa Profil <MoreHorizontal size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
          </span>

          {!hideSelection && onToggleSelect && (
             <button 
               onClick={(e) => onToggleSelect(candidate, e)}
               className={`p-2 rounded-full transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600'}`}
             >
                {isSelected ? <Check size={16} strokeWidth={3}/> : <Plus size={16} strokeWidth={3}/>}
             </button>
          )}
       </div>
    </div>
  );
};

export default CandidateCard;