import React from 'react';
import { SearchCriteria } from '../types';
import { EXPERIENCE_LEVELS } from '../constants';
import { Search, Briefcase, MapPin, Code, Hash, UserCheck, Filter, Building } from 'lucide-react';

interface SearchFormProps {
  mode: 'candidates' | 'assignments';
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ mode, criteria, setCriteria, onSearch, isLoading }) => {
  
  const handleChange = (field: keyof SearchCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const isCandidateMode = mode === 'candidates';

  // Theme configuration based on mode
  const theme = isCandidateMode ? {
    iconColor: 'text-indigo-600',
    ringColor: 'focus:ring-indigo-500',
    borderColor: 'focus:border-indigo-500',
    buttonGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
    shadow: 'shadow-indigo-500/30'
  } : {
    iconColor: 'text-emerald-600',
    ringColor: 'focus:ring-emerald-500',
    borderColor: 'focus:border-emerald-500',
    buttonGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
    shadow: 'shadow-emerald-500/30'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 transition-all">
      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           {isCandidateMode ? <Filter size={20} className="text-indigo-500"/> : <Building size={20} className="text-emerald-500"/>}
           {isCandidateMode ? "Filtrera Kandidater" : "Sökparametrar för Uppdrag"}
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
          {isCandidateMode ? "Rekryteringsvy" : "Säljvy"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Role / Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Briefcase size={16} className={theme.iconColor} /> 
            {isCandidateMode ? "Specifik Roll" : "Uppdragstitel / Sökord"}
          </label>
          <input
            type="text"
            value={criteria.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder={isCandidateMode ? "t.ex. Fullstack-utvecklare" : "t.ex. Java-utvecklare, Projektledare"}
            className={`w-full px-4 py-3 rounded-lg border border-slate-300 transition-colors bg-slate-50 ${theme.ringColor} ${theme.borderColor} focus:ring-2`}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={16} className={theme.iconColor} /> 
            {isCandidateMode ? "Kandidatens Plats" : "Uppdragets Plats"}
          </label>
          <input
            type="text"
            value={criteria.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="t.ex. Stockholm, Remote"
            className={`w-full px-4 py-3 rounded-lg border border-slate-300 transition-colors bg-slate-50 ${theme.ringColor} ${theme.borderColor} focus:ring-2`}
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Code size={16} className={theme.iconColor} /> 
            {isCandidateMode ? "Teknisk Kompetens (Stack)" : "Kravprofil / Teknik"}
          </label>
          <input
            type="text"
            value={criteria.techStack}
            onChange={(e) => handleChange('techStack', e.target.value)}
            placeholder={isCandidateMode ? "t.ex. React, Node.js, AWS" : "t.ex. .NET, Azure, Kubernetes"}
            className={`w-full px-4 py-3 rounded-lg border border-slate-300 transition-colors bg-slate-50 ${theme.ringColor} ${theme.borderColor} focus:ring-2`}
          />
        </div>

        {/* Experience Level - Only strictly relevant for Candidates or filtering senior assignments */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <UserCheck size={16} className={theme.iconColor} /> 
            {isCandidateMode ? "Erfarenhetsnivå" : "Nivåkrav (Senioritet)"}
          </label>
          <select
            value={criteria.experienceLevel}
            onChange={(e) => handleChange('experienceLevel', e.target.value as any)}
            className={`w-full px-4 py-3 rounded-lg border border-slate-300 transition-colors bg-slate-50 appearance-none ${theme.ringColor} ${theme.borderColor} focus:ring-2`}
          >
            {EXPERIENCE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Hash size={16} className={theme.iconColor} /> 
            {isCandidateMode ? "Personliga Egenskaper" : "Övriga Nyckelord"}
          </label>
          <input
            type="text"
            value={criteria.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder={isCandidateMode ? "t.ex. Agil, Självgående, Fintech" : "t.ex. Offentlig sektor, Ramavtal"}
            className={`w-full px-4 py-3 rounded-lg border border-slate-300 transition-colors bg-slate-50 ${theme.ringColor} ${theme.borderColor} focus:ring-2`}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all transform active:scale-95 shadow-lg ${theme.shadow} ${isLoading ? 'bg-slate-400 cursor-not-allowed shadow-none' : theme.buttonGradient}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isCandidateMode ? "Headhuntar..." : "Scannar marknaden..."}
            </>
          ) : (
            <>
              <Search size={20} />
              {isCandidateMode ? "Hitta Kandidater" : "Hitta Uppdrag"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;