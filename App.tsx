import React, { useState } from 'react';
import { SearchCriteria, AppState, Assignment, Candidate } from './types';
import { findCandidates, searchAssignments } from './services/geminiService';
import SearchForm from './components/SearchForm';
import CandidateCard from './components/CandidateCard';
import AssignmentCard from './components/AssignmentCard';
import BooleanStringDisplay from './components/BooleanStringDisplay';
import MatchView from './components/MatchView';
import { SAMPLE_PROMPTS } from './constants';
import { BrainCircuit, ShieldAlert, Users, Briefcase, PlusCircle, ShoppingCart, Sparkles } from 'lucide-react';

type View = 'consultants' | 'assignments' | 'matchmaking';

const App: React.FC = () => {
  const [view, setView] = useState<View>('consultants');
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Data States
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [booleanString, setBooleanString] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Basket State
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);

  // Separate criteria states
  const [consultantCriteria, setConsultantCriteria] = useState<SearchCriteria>({
    techStack: '',
    experienceLevel: 'Senior',
    role: '',
    location: '',
    keywords: ''
  });

  const [assignmentCriteria, setAssignmentCriteria] = useState<SearchCriteria>({
    techStack: '',
    experienceLevel: 'Senior',
    role: '',
    location: '',
    keywords: ''
  });

  // --- Actions ---

  const handleSearchConsultants = async () => {
    if (!consultantCriteria.role || !consultantCriteria.techStack) {
      alert("Ange roll och kompetens för att hitta konsulter.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setCandidates([]); 
    
    try {
      const data = await findCandidates(consultantCriteria);
      setCandidates(data.candidates);
      setBooleanString(data.generatedBooleanString);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Fel vid sökning.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAssignments = async () => {
    if (!assignmentCriteria.role) {
      alert("Ange åtminstone en roll/titel för att hitta uppdrag.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    setAssignments([]); 

    try {
      const data = await searchAssignments(assignmentCriteria);
      setAssignments(data);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Fel vid uppdragssökning.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreAssignments = async () => {
    setIsLoading(true);
    try {
      const more = await searchAssignments(assignmentCriteria, assignments);
      setAssignments(prev => [...prev, ...more]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Basket Logic ---

  const toggleCandidate = (c: Candidate) => {
    if (selectedCandidates.find(x => x.id === c.id)) {
      setSelectedCandidates(prev => prev.filter(x => x.id !== c.id));
    } else {
      setSelectedCandidates(prev => [...prev, c]);
    }
  };

  const toggleAssignment = (a: Assignment) => {
    if (selectedAssignments.find(x => x.id === a.id)) {
      setSelectedAssignments(prev => prev.filter(x => x.id !== a.id));
    } else {
      setSelectedAssignments(prev => [...prev, a]);
    }
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_PROMPTS[index];
    const newCriteria = {
      role: sample.role,
      techStack: sample.stack,
      experienceLevel: sample.exp as any,
      location: sample.location,
      keywords: sample.keywords
    };
    
    if (view === 'consultants') {
      setConsultantCriteria(newCriteria);
    } else {
      setAssignmentCriteria(newCriteria);
    }
  };

  const basketCount = selectedCandidates.length + selectedAssignments.length;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-100/50 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -z-10" />

      {/* Navbar - Glassmorphism */}
      <header className="sticky top-4 z-50 px-4 mb-8">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/50 rounded-2xl px-6 h-20 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3 text-violet-700 cursor-pointer group" onClick={() => setView('consultants')}>
            <div className="bg-violet-100 p-2 rounded-xl group-hover:bg-violet-200 transition-colors">
              <BrainCircuit size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 hidden md:block">Talent<span className="text-violet-600">Analytics</span></h1>
          </div>
          
          <nav className="flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
            <button 
              onClick={() => setView('consultants')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
                view === 'consultants' 
                  ? 'bg-white text-violet-700 shadow-md shadow-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <Users size={18}/> 
              <span className="hidden sm:inline">Konsulter</span>
              {selectedCandidates.length > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${view === 'consultants' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>
                  {selectedCandidates.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('assignments')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
                view === 'assignments' 
                  ? 'bg-white text-emerald-600 shadow-md shadow-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <Briefcase size={18}/> 
              <span className="hidden sm:inline">Uppdrag</span>
              {selectedAssignments.length > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${view === 'assignments' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  {selectedAssignments.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('matchmaking')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ml-1 ${
                view === 'matchmaking' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <ShoppingCart size={18}/> 
              <span className="hidden sm:inline">Matchning</span>
              {basketCount > 0 && <span className="bg-white text-violet-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">{basketCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        
        {/* VIEW: CONSULTANTS */}
        <div style={{ display: view === 'consultants' ? 'block' : 'none' }} className="animate-fade-in-up">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
               <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Hitta Konsulter</h2>
                  <p className="text-slate-500 text-lg">AI-driven sourcing som hittar dolda talanger.</p>
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                 {SAMPLE_PROMPTS.map((_, i) => (
                   <button 
                    key={i} 
                    onClick={() => loadSample(i)} 
                    className="whitespace-nowrap text-xs font-medium bg-white/50 border border-violet-100 px-4 py-2 rounded-full hover:bg-violet-50 hover:border-violet-200 text-violet-600 transition-colors flex items-center gap-1 shadow-sm"
                   >
                    <Sparkles size={12}/> Exempel {i+1}
                   </button>
                 ))}
               </div>
            </div>

            <SearchForm 
              mode="candidates"
              criteria={consultantCriteria} 
              setCriteria={setConsultantCriteria} 
              onSearch={handleSearchConsultants}
              isLoading={isLoading}
            />

            {errorMsg && view === 'consultants' && (
              <div className="mt-6 p-4 bg-red-50/80 backdrop-blur border border-red-100 text-red-700 rounded-2xl flex gap-3 items-center shadow-sm animate-pulse">
                <ShieldAlert className="flex-shrink-0"/>
                {errorMsg}
              </div>
            )}

            {candidates.length > 0 && (
               <div className="mt-10">
                  <BooleanStringDisplay booleanString={booleanString} />
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                     {candidates.map((c, i) => (
                        <CandidateCard 
                          key={c.id} 
                          candidate={c} 
                          rank={i+1} 
                          isSelected={!!selectedCandidates.find(x => x.id === c.id)}
                          onToggleSelect={toggleCandidate}
                        />
                     ))}
                  </div>
               </div>
            )}
            
            {!isLoading && candidates.length === 0 && !errorMsg && (
              <div className="mt-20 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-violet-50 mb-6 shadow-inner">
                   <Users size={48} className="text-violet-200" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Redo för headhunting</h3>
                <p className="text-slate-500 max-w-md mx-auto">Ange sökparametrar ovan för att låta AI:n scanna LinkedIn och öppna webben efter relevanta profiler.</p>
              </div>
            )}
        </div>

        {/* VIEW: ASSIGNMENTS */}
        <div style={{ display: view === 'assignments' ? 'block' : 'none' }} className="animate-fade-in-up">
            <div className="mb-8">
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Hitta Uppdrag</h2>
               <p className="text-slate-500 text-lg">Realtidsscanning av konsultmarknaden.</p>
            </div>

            <SearchForm 
              mode="assignments"
              criteria={assignmentCriteria} 
              setCriteria={setAssignmentCriteria} 
              onSearch={handleSearchAssignments}
              isLoading={isLoading}
            />

            {errorMsg && view === 'assignments' && (
              <div className="mt-6 p-4 bg-red-50/80 backdrop-blur border border-red-100 text-red-700 rounded-2xl flex gap-3 items-center shadow-sm">
                <ShieldAlert className="flex-shrink-0"/>
                {errorMsg}
              </div>
            )}

            {assignments.length > 0 && (
               <div className="mt-10 space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                     {assignments.map((a) => (
                        <AssignmentCard 
                          key={a.id} 
                          assignment={a}
                          isSelected={!!selectedAssignments.find(x => x.id === a.id)}
                          onToggleSelect={toggleAssignment}
                        />
                     ))}
                  </div>
                  <div className="text-center pt-4">
                     <button 
                        onClick={handleLoadMoreAssignments} 
                        disabled={isLoading} 
                        className="px-8 py-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:shadow-md transition-all font-semibold text-slate-600 flex items-center gap-2 mx-auto shadow-sm"
                     >
                        {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-slate-500 rounded-full"/> : <PlusCircle size={18}/>}
                        Hämta fler uppdrag
                     </button>
                  </div>
               </div>
            )}

             {!isLoading && assignments.length === 0 && !errorMsg && (
              <div className="mt-20 text-center">
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 mb-6 shadow-inner">
                   <Briefcase size={48} className="text-emerald-200" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Uppdragsdatabas</h3>
                <p className="text-slate-500 max-w-md mx-auto">Sök efter aktiva uppdrag från de största mäklarna och direktkunder.</p>
              </div>
            )}
        </div>

        {/* VIEW: MATCHMAKING */}
        {view === 'matchmaking' && (
          <MatchView 
            selectedCandidates={selectedCandidates}
            selectedAssignments={selectedAssignments}
            onRemoveCandidate={(id) => setSelectedCandidates(prev => prev.filter(x => x.id !== id))}
            onRemoveAssignment={(id) => setSelectedAssignments(prev => prev.filter(x => x.id !== id))}
          />
        )}

      </main>
    </div>
  );
};

export default App;