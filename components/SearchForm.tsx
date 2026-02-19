import React, { useState } from 'react';
import { SearchCriteria } from '../types';
import { EXPERIENCE_LEVELS } from '../constants';
import { Search, Briefcase, MapPin, Code, Hash, UserCheck, ChevronDown, Filter, X } from 'lucide-react';

interface SearchFormProps {
  mode: 'candidates' | 'assignments';
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ mode, criteria, setCriteria, onSearch, isLoading }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleChange = (field: keyof SearchCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const isCandidate = mode === 'candidates';
  const themeColor = isCandidate ? 'indigo' : 'teal';
  const ThemeIcon = isCandidate ? Search : Briefcase;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 relative overflow-visible ${expanded ? 'p-6' : 'p-2'}`}>
       
       {/* COMPACT VIEW (Default) */}
       {!expanded ? (
          <div className="flex flex-col md:flex-row gap-2 items-center">
             <div className="flex-1 w-full flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                <ThemeIcon size={18} className={`text-${themeColor}-500 mr-3 shrink-0`}/>
                <input 
                  type="text" 
                  placeholder={isCandidate ? "Sök roll (t.ex. Java Utvecklare)..." : "Sök uppdrag..."}
                  className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
                  value={criteria.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                />
             </div>
             
             {/* Tech Stack Input (Visible on desktop) */}
             <div className="hidden md:flex flex-1 w-full items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 focus-within:border-indigo-300 transition-all">
                <Code size={18} className="text-slate-400 mr-3 shrink-0"/>
                <input 
                  type="text" 
                  placeholder="Tech Stack..."
                  className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700"
                  value={criteria.techStack}
                  onChange={(e) => handleChange('techStack', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                />
             </div>

             <button 
               onClick={() => setExpanded(true)} 
               className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
               title="Fler filter"
             >
                <Filter size={20} />
             </button>

             <button 
                onClick={onSearch}
                disabled={isLoading}
                className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap ${isLoading ? 'bg-slate-300' : isCandidate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
             >
                {isLoading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : 'Sök'}
             </button>
          </div>
       ) : (
          /* EXPANDED VIEW */
          <div className="animate-fade-in space-y-4">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Avancerad Sökning</h3>
                <button onClick={() => setExpanded(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputGroup icon={<ThemeIcon size={16}/>} label="Roll" value={criteria.role} onChange={(v) => handleChange('role', v)} />
                <InputGroup icon={<Code size={16}/>} label="Tech Stack" value={criteria.techStack} onChange={(v) => handleChange('techStack', v)} />
                <InputGroup icon={<MapPin size={16}/>} label="Plats" value={criteria.location} onChange={(v) => handleChange('location', v)} />
                
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Erfarenhet</label>
                   <div className="relative">
                      <select 
                         value={criteria.experienceLevel}
                         onChange={(e) => handleChange('experienceLevel', e.target.value as any)}
                         className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-100 outline-none"
                      >
                         {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                   </div>
                </div>
             </div>
             
             <div className="pt-2 flex justify-end gap-2">
                <button onClick={() => setExpanded(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg">Avbryt</button>
                <button 
                   onClick={() => { onSearch(); setExpanded(false); }}
                   className={`px-8 py-2 rounded-xl font-bold text-white text-sm shadow-lg ${isCandidate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                   Uppdatera resultat
                </button>
             </div>
          </div>
       )}
    </div>
  );
};

const InputGroup = ({ icon, label, value, onChange }: any) => (
  <div className="space-y-1.5">
     <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{label}</label>
     <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-300 outline-none transition-all"
        />
     </div>
  </div>
);

export default SearchForm;