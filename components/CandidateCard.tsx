import React from 'react';
import { Candidate } from '../types';
import { User, MapPin, Briefcase, CheckCircle, ExternalLink, Plus, Check } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isSelected?: boolean;
  onToggleSelect?: (candidate: Candidate) => void;
  hideSelection?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, isSelected, onToggleSelect, hideSelection }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    return 'bg-amber-500';
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-100'}`}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          
          {/* Header Info */}
          <div className="flex gap-4 flex-1">
            {rank && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                #{rank}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {candidate.name}
                {candidate.profileUrl && (
                  <a href={candidate.profileUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                )}
              </h3>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Briefcase size={14} /> {candidate.currentTitle}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-end gap-2">
            {!hideSelection && onToggleSelect && (
              <button 
                onClick={() => onToggleSelect(candidate)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-white border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
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
            
            {/* Score (Only show if calculated during search, not necessarily in basket view) */}
            {candidate.matchScore > 0 && (
              <div className={`px-3 py-1 rounded-md text-sm font-bold border flex items-center gap-1 ${getScoreColor(candidate.matchScore)}`}>
                <span>{candidate.matchScore}% Match</span>
              </div>
            )}
          </div>
        </div>

        {candidate.matchScore > 0 && (
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${getBarColor(candidate.matchScore)}`} 
              style={{ width: `${candidate.matchScore}%` }}
            ></div>
          </div>
        )}

        {/* Justification & Summary */}
        <div className="mt-6 grid gap-4">
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
             <User size={14} className="inline mr-2 text-indigo-500"/>
             {candidate.summary}
          </p>
        </div>

        {/* Skills Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {candidate.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
              {skill}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CandidateCard;