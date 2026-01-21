import React from 'react';
import { Candidate } from '../types';
import { MapPin, Briefcase, Plus, Check, Quote, Trophy, Cpu, Target, Terminal } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isSelected?: boolean;
  onToggleSelect?: (candidate: Candidate) => void;
  hideSelection?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, isSelected, onToggleSelect, hideSelection }) => {
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Dynamic scoring styles
  const isHighMatch = candidate.matchScore >= 85;
  const scoreColor = isHighMatch ? 'text-violet-700' : candidate.matchScore >= 70 ? 'text-indigo-600' : 'text-slate-600';
  const scoreBg = isHighMatch ? 'bg-violet-100' : candidate.matchScore >= 70 ? 'bg-indigo-50' : 'bg-slate-100';
  const scoreRing = isHighMatch ? 'ring-violet-200' : 'ring-indigo-100';

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] p-1 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-violet-500 shadow-xl shadow-violet-500/20' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]'
      }`}
    >
      {/* Selection Overlay Background (Subtle) */}
      <div className={`absolute inset-0 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative p-6 h-full flex flex-col z-10">
        
        {/* Header Section */}
        <div className="flex items-start gap-5 mb-5">
          
          {/* Avatar / Rank */}
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm transition-transform group-hover:scale-105 ${isSelected ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500'}`}>
              {getInitials(candidate.name)}
            </div>
            {rank && (
              <div className="absolute -top-3 -left-2 px-2 py-1 rounded-lg bg-slate-900 text-white flex items-center gap-1 text-[10px] font-bold border-2 border-white shadow-md">
                <Trophy size={10} className="text-yellow-400" />
                <span>#{rank}</span>
              </div>
            )}
          </div>
          
          {/* Main Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800 truncate pr-2 group-hover:text-violet-700 transition-colors">
                  {candidate.name}
                </h3>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600 truncate">
                <Briefcase size={14} className="text-violet-400" />
                {candidate.currentTitle}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 truncate">
                <MapPin size={14} className="text-violet-300" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        {/* AI Insight / Quote */}
        <div className="mb-6 relative bg-white/60 rounded-xl p-3 border border-violet-100/50 backdrop-blur-sm group-hover:border-violet-200 transition-colors">
           <Quote size={24} className="absolute -top-2 -left-2 text-violet-200 fill-violet-50 transform -scale-x-100" />
           <p className="text-sm text-slate-600 leading-relaxed italic pl-2 relative z-10 line-clamp-3">
             {candidate.summary}
           </p>
        </div>

        {/* Footer: Skills & Action */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4">
           
           {/* Tech Stack */}
           <div className="space-y-2">
               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Terminal size={12} /> Tech Stack
               </div>
               <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-md text-xs font-mono font-medium text-slate-600 flex items-center gap-1 group-hover:border-violet-200 group-hover:text-violet-700 transition-colors">
                    <Cpu size={10} className="text-slate-400 group-hover:text-violet-400" />
                    {skill}
                </span>
                ))}
                {candidate.skills.length > 4 && (
                <span className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-50 rounded-md">
                    +{candidate.skills.length - 4}
                </span>
                )}
               </div>
           </div>

           {/* Bottom Row: Score & Select */}
           <div className="flex items-center justify-between pt-2">
                {/* Match Score */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${scoreBg} ${scoreColor} ${scoreRing} ring-1`}>
                    <Target size={14} />
                    <span className="text-xs font-extrabold">{candidate.matchScore}% Match</span>
                </div>

                {/* Selection Button */}
                {!hideSelection && onToggleSelect && (
                  <button 
                    onClick={() => onToggleSelect(candidate)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                        : 'bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-700'
                    }`}
                  >
                    {isSelected ? (
                        <>
                        <Check size={14} strokeWidth={3} />
                        <span>Vald</span>
                        </>
                    ) : (
                        <>
                        <Plus size={14} />
                        <span>Välj</span>
                        </>
                    )}
                  </button>
                )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateCard;