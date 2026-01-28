import React, { useState } from 'react';
import { Candidate } from '../types';
import { MapPin, Briefcase, Plus, Check, Quote, Trophy, Cpu, Target, TrendingUp, ChevronDown, ChevronUp, Lightbulb, Layers, User } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isSelected?: boolean;
  onToggleSelect?: (candidate: Candidate) => void;
  hideSelection?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, isSelected, onToggleSelect, hideSelection }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isHighMatch = candidate.matchScore >= 85;
  const scoreColor = isHighMatch ? 'text-violet-700' : candidate.matchScore >= 70 ? 'text-indigo-600' : 'text-slate-600';
  const scoreBg = isHighMatch ? 'bg-violet-100' : candidate.matchScore >= 70 ? 'bg-indigo-50' : 'bg-slate-100';

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] transition-all duration-500 ease-out flex flex-col overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-violet-500 shadow-xl shadow-violet-500/20 translate-y-[-4px]' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)] hover:-translate-y-2 hover:border-violet-200'
      }`}
    >
      {/* --- Parallax & Decor Backgrounds --- */}
      
      {/* Selection Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/50 transition-opacity duration-500 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Floating Abstract Icon (Parallax Effect) */}
      <div className="absolute -top-10 -right-10 text-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110 pointer-events-none z-0">
         <User size={180} strokeWidth={1} />
      </div>

      {/* Subtle Grid Pattern on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Main Content Area */}
      <div className="relative p-6 z-10 flex-grow">
        
        {/* Header Section */}
        <div className="flex items-start gap-5 mb-5">
          {/* Avatar / Rank */}
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:shadow-violet-200 group-hover:shadow-md ${isSelected ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 group-hover:from-white group-hover:to-violet-50 group-hover:text-violet-600'}`}>
              {getInitials(candidate.name)}
            </div>
            {rank && (
              <div className="absolute -top-3 -left-2 px-2 py-1 rounded-lg bg-slate-900 text-white flex items-center gap-1 text-[10px] font-bold border-2 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Trophy size={10} className="text-yellow-400" />
                <span>#{rank}</span>
              </div>
            )}
          </div>
          
          {/* Main Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800 truncate pr-2 group-hover:text-violet-700 transition-colors duration-300">
                  {candidate.name}
                </h3>
                 
                 {/* Match Score Badge with Animated Ring */}
                 <div className="relative group/score">
                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/score:opacity-100 transition-opacity duration-700 ${isHighMatch ? 'animate-ping bg-violet-400/30' : ''}`} />
                    <div className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors duration-300 ${scoreBg} ${scoreColor} border-transparent group-hover:border-current/10`}>
                        <Target size={12} className={isHighMatch ? 'animate-pulse' : ''} />
                        <span className="text-xs font-extrabold tracking-tight">{candidate.matchScore}%</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-1.5">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-600 truncate group-hover:text-slate-800 transition-colors">
                <Briefcase size={14} className="text-violet-400 group-hover:text-violet-500 transition-colors" />
                {candidate.currentTitle}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 truncate group-hover:text-slate-500 transition-colors">
                    <MapPin size={14} className="text-violet-300 group-hover:text-violet-400 transition-colors" />
                    {candidate.location}
                </span>
                {isHighMatch && (
                     <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm">
                        <TrendingUp size={10} /> Top Talent
                     </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Snippet */}
        <div className="mb-5 relative group/quote">
           <div className="absolute inset-0 bg-violet-50 rounded-xl opacity-0 group-hover/quote:opacity-100 transition-opacity duration-300 scale-105" />
           <div className="relative bg-slate-50/80 rounded-xl p-3 border border-slate-100 group-hover/quote:border-violet-200/50 group-hover/quote:bg-white/80 transition-all duration-300 backdrop-blur-sm">
               <Quote size={16} className="absolute -top-2 -left-2 text-violet-200 fill-violet-100 transform -scale-x-100 group-hover/quote:text-violet-300 transition-colors" />
               <p className="text-sm text-slate-600 leading-relaxed italic pl-2 relative z-10 line-clamp-2 group-hover:text-slate-700">
                 {candidate.summary}
               </p>
           </div>
        </div>

        {/* Primary Skills */}
        <div className="flex flex-wrap gap-2 mb-2">
            {candidate.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-md text-xs font-mono font-medium text-slate-600 flex items-center gap-1.5 shadow-sm group-hover:border-violet-200 group-hover:text-violet-700 transition-all duration-300 hover:scale-105 cursor-default">
                <Cpu size={10} className="text-slate-400 group-hover:text-violet-400" />
                {skill}
            </span>
            ))}
             {!isExpanded && candidate.skills.length > 4 && (
                <span className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-50 rounded-md border border-transparent group-hover:border-slate-200 transition-colors">
                    +{candidate.skills.length - 4}
                </span>
            )}
        </div>
      </div>

      {/* Expanded Content Area */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-2 relative z-10 space-y-5">
           
           {/* AI Justification */}
           {candidate.justification && (
             <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none" />
                <h4 className="text-xs font-bold uppercase text-indigo-600 flex items-center gap-2 mb-2 relative z-10">
                  <Lightbulb size={12} className="fill-indigo-200 text-indigo-500" />
                  Matchningsanalys
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed relative z-10">
                  {candidate.justification}
                </p>
             </div>
           )}

           {/* Full Skill List */}
           <div>
              <h4 className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2 mb-2">
                  <Layers size={10} /> Komplett Kompetens
              </h4>
              <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 shadow-sm hover:shadow-md hover:border-violet-300 transition-all cursor-default">
                        {skill}
                    </span>
                  ))}
              </div>
           </div>
        </div>
      </div>

      {/* Footer / Toggle */}
      <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex items-center justify-between relative z-10 mt-auto backdrop-blur-sm group-hover:bg-slate-50/80 transition-colors">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-500 hover:text-violet-700 flex items-center gap-1 transition-all px-3 py-2 rounded-xl hover:bg-violet-100/50 active:scale-95"
        >
          {isExpanded ? (
            <>Mindre info <ChevronUp size={14} /></>
          ) : (
            <>Mer info & analys <ChevronDown size={14} /></>
          )}
        </button>

        {/* Selection Button */}
        {!hideSelection && onToggleSelect && (
            <button 
            onClick={() => onToggleSelect(candidate)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-90 ${
                isSelected 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 hover:bg-violet-700' 
                : 'bg-white border border-slate-200 text-slate-500 hover:border-violet-400 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5'
            }`}
            >
            {isSelected ? (
                <>
                <Check size={14} strokeWidth={3} />
                <span>Vald</span>
                </>
            ) : (
                <>
                <Plus size={14} strokeWidth={2.5} />
                <span>Välj</span>
                </>
            )}
            </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;