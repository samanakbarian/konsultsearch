import React from 'react';
import { Candidate } from '../types';
import { User, MapPin, Briefcase, CheckCircle, ExternalLink, Plus, Check, Star } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isSelected?: boolean;
  onToggleSelect?: (candidate: Candidate) => void;
  hideSelection?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, isSelected, onToggleSelect, hideSelection }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 75) return 'text-violet-600 bg-violet-50 border-violet-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  const getBarGradient = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
    if (score >= 75) return 'bg-gradient-to-r from-violet-400 to-indigo-500';
    return 'bg-gradient-to-r from-amber-400 to-orange-500';
  }

  return (
    <div className={`bg-white rounded-[1.5rem] p-1 border transition-all duration-300 hover:-translate-y-1 ${isSelected ? 'ring-2 ring-violet-500 shadow-xl shadow-violet-500/20 border-transparent' : 'border-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          
          {/* Header Info */}
          <div className="flex gap-4 flex-1">
            {rank && (
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-extrabold text-lg shadow-inner">
                #{rank}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group cursor-pointer">
                {candidate.name}
                {candidate.profileUrl && (
                  <a href={candidate.profileUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 group-hover:text-violet-500 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                )}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                  <Briefcase size={14} className="text-slate-400"/> {candidate.currentTitle}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                  <MapPin size={14} className="text-slate-400"/> {candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-end gap-2">
            {!hideSelection && onToggleSelect && (
              <button 
                onClick={() => onToggleSelect(candidate)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  isSelected 
                    ? 'bg-violet-600 text-white shadow-violet-500/30' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={16} /> Vald
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Välj
                  </>
                )}
              </button>
            )}
            
            {/* Score */}
            {candidate.matchScore > 0 && (
              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getScoreColor(candidate.matchScore)}`}>
                <Star size={12} fill="currentColor" className="opacity-50"/>
                <span>{candidate.matchScore}% Match</span>
              </div>
            )}
          </div>
        </div>

        {candidate.matchScore > 0 && (
          <div className="mt-5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${getBarGradient(candidate.matchScore)}`} 
              style={{ width: `${candidate.matchScore}%` }}
            ></div>
          </div>
        )}

        {/* Justification & Summary */}
        <div className="mt-6 grid gap-4 flex-grow">
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100/50">
             <User size={16} className="inline mr-2 text-violet-400 align-text-bottom"/>
             {candidate.summary}
          </p>
        </div>

        {/* Skills Tags */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm hover:border-violet-200 hover:text-violet-600 transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CandidateCard;