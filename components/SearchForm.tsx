import React from 'react';
import { SearchCriteria } from '../types';
import { EXPERIENCE_LEVELS } from '../constants';
import { Search, Briefcase, MapPin, Code, Hash, UserCheck, Filter, Building, Sparkles } from 'lucide-react';

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

  // Enhanced theme configuration
  const theme = isCandidateMode ? {
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    ringColor: 'focus:ring-violet-500/30',
    borderColor: 'focus:border-violet-500',
    buttonGradient: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:shadow-violet-500/25',
    label: 'text-violet-900',
    inputBg: 'bg-slate-50 focus:bg-white'
  } : {
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    ringColor: 'focus:ring-emerald-500/30',
    borderColor: 'focus:border-emerald-500',
    buttonGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-emerald-500/25',
    label: 'text-emerald-900',
    inputBg: 'bg-slate-50 focus:bg-white'
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 p-6 md:p-8 relative overflow-hidden">
      
      {/* Decorative gradient blob inside card */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${isCandidateMode ? 'bg-violet-100/50' : 'bg-emerald-100/50'} rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none`} />

      <div className="mb-8 flex items-center justify-between relative z-10">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
           <div className={`p-2 rounded-xl ${theme.iconBg}`}>
             {isCandidateMode ? <Filter size={20} className={theme.iconColor}/> : <Building size={20} className={theme.iconColor}/>}
           </div>
           {isCandidateMode ? "Filtrera Kandidater" : "Sökparametrar för Uppdrag"}
        </h3>
        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${isCandidateMode ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isCandidateMode ? "Rekrytering" : "Sälj"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        
        {/* Role / Title - Spans 7 cols */}
        <div className="md:col-span-7 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            {isCandidateMode ? "Specifik Roll" : "Uppdragstitel / Sökord"}
          </label>
          <div className="relative group">
            <Briefcase size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor} transition-colors group-hover:opacity-80`} />
            <input
              type="text"
              value={criteria.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder={isCandidateMode ? "t.ex. Fullstack-utvecklare" : "t.ex. Java-utvecklare, Projektledare"}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all outline-none font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 ${theme.inputBg} ${theme.ringColor} focus:ring-4`}
            />
          </div>
        </div>

        {/* Location - Spans 5 cols */}
        <div className="md:col-span-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            {isCandidateMode ? "Plats" : "Ort / Remote"}
          </label>
          <div className="relative group">
            <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor}`} />
            <input
              type="text"
              value={criteria.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="t.ex. Stockholm"
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all outline-none font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 ${theme.inputBg} ${theme.ringColor} focus:ring-4`}
            />
          </div>
        </div>

        {/* Tech Stack - Spans 12 cols */}
        <div className="md:col-span-12 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            {isCandidateMode ? "Teknisk Kompetens (Stack)" : "Kravprofil / Teknik"}
          </label>
          <div className="relative group">
            <Code size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor}`} />
            <input
              type="text"
              value={criteria.techStack}
              onChange={(e) => handleChange('techStack', e.target.value)}
              placeholder={isCandidateMode ? "t.ex. React, Node.js, AWS" : "t.ex. .NET, Azure, Kubernetes"}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all outline-none font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 ${theme.inputBg} ${theme.ringColor} focus:ring-4`}
            />
          </div>
        </div>

        {/* Experience Level - Spans 4 cols */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            {isCandidateMode ? "Nivå" : "Senioritet"}
          </label>
          <div className="relative">
             <UserCheck size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor} pointer-events-none`} />
             <select
              value={criteria.experienceLevel}
              onChange={(e) => handleChange('experienceLevel', e.target.value as any)}
              className={`w-full pl-12 pr-10 py-4 rounded-2xl border-0 transition-all outline-none font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 appearance-none cursor-pointer ${theme.inputBg} ${theme.ringColor} focus:ring-4`}
            >
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Keywords - Spans 8 cols */}
        <div className="md:col-span-8 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
            {isCandidateMode ? "Personliga Egenskaper" : "Övriga Nyckelord"}
          </label>
          <div className="relative group">
             <Hash size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor}`} />
             <input
              type="text"
              value={criteria.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder={isCandidateMode ? "t.ex. Agil, Självgående, Fintech" : "t.ex. Offentlig sektor, Ramavtal"}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all outline-none font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 ${theme.inputBg} ${theme.ringColor} focus:ring-4`}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end relative z-10">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className={`group flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 ${isLoading ? 'bg-slate-300 cursor-not-allowed' : `${theme.buttonGradient} shadow-lg`}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Bearbetar...</span>
            </>
          ) : (
            <>
              <Search size={20} className="group-hover:scale-110 transition-transform"/>
              <span>{isCandidateMode ? "Hitta Kandidater" : "Hitta Uppdrag"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;