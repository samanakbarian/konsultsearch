import React, { useState } from 'react';
import { Candidate } from '../types';
import { MapPin, Briefcase, Plus, Check, Quote, Trophy, Cpu, Target, Terminal, TrendingUp, ChevronDown, ChevronUp, Lightbulb, Sparkles, Layers } from 'lucide-react';

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
  const scoreRing = isHighMatch ? 'ring-violet-200' : 'ring-indigo-100';

  return (
    <div 
      className={`relative group bg-white rounded-[2rem] transition-all duration-300 overflow-hidden flex flex-col ${
        isSelected 
          ? 'ring-2 ring-violet-500 shadow-xl shadow-violet-500/20' 
          : 'border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)] hover:-translate-y-1'
      }`}
    >
      {/* Selection Overlay Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Content Area */}
      <div className="relative p-6 z-10 flex-grow">
        
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
                 {/* Match Score Badge - Always visible */}
                 <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${scoreBg} ${scoreColor} ${scoreRing} ring-1`}>
                    <Target size={12} />
                    <span className="text-xs font-extrabold">{candidate.matchScore}%</span>
                </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600 truncate">
                <Briefcase size={14} className="text-violet-400" />
                {candidate.currentTitle}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 truncate">
                    <MapPin size={14} className="text-violet-300" />
                    {candidate.location}
                </span>
                {isHighMatch && (
                     <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                        <TrendingUp size={10} /> Top Talent
                     </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary (Always visible snippet) */}
        <div className="mb-4 relative bg-white/60 rounded-xl p-3 border border-violet-100/50 backdrop-blur-sm group-hover:border-violet-200 transition-colors">
           <Quote size={20} className="absolute -top-2 -left-2 text-violet-200 fill-violet-50 transform -scale-x-100" />
           <p className="text-sm text-slate-600 leading-relaxed italic pl-2 relative z-10 line-clamp-2">
             {candidate.summary}
           </p>
        </div>

        {/* Primary Skills (Always visible) */}
        <div className="flex flex-wrap gap-2 mb-4">
            {candidate.skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-md text-xs font-mono font-medium text-slate-600 flex items-center gap-1">
                <Cpu size={10} className="text-slate-400" />
                {skill}
            </span>
            ))}
             {!isExpanded && candidate.skills.length > 4 && (
                <span className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-50 rounded-md">
                    +{candidate.skills.length - 4}
                </span>
            )}
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-0 animate-fade-in relative z-10 space-y-5">
           
           {/* AI Justification */}
           {candidate.justification && (
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <h4 className="text-xs font-bold uppercase text-indigo-600 flex items-center gap-2 mb-2">
                  <Lightbulb size={12} className="fill-indigo-200 text-indigo-500" />
                  Matchningsanalys
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
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
                    <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 shadow-sm">
                        {skill}
                    </span>
                  ))}
              </div>
           </div>
        </div>
      )}

      {/* Footer / Toggle */}
      <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex items-center justify-between relative z-10 mt-auto">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-500 hover:text-violet-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-violet-50"
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isSelected 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' 
                : 'bg-white border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-700 hover:shadow-md'
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
  );
};

export default CandidateCard;