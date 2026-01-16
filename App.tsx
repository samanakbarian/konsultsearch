import React, { useState } from 'react';
import { SearchCriteria, AppState, Assignment, Candidate } from './types';
import { findCandidates, searchAssignments } from './services/geminiService';
import SearchForm from './components/SearchForm';
import CandidateCard from './components/CandidateCard';
import AssignmentCard from './components/AssignmentCard';
import BooleanStringDisplay from './components/BooleanStringDisplay';
import MatchView from './components/MatchView';
import { SAMPLE_PROMPTS } from './constants';
import { BrainCircuit, ShieldAlert, Users, Briefcase, PlusCircle, ShoppingCart } from 'lucide-react';

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

  // Separate criteria states to avoid overwriting inputs when switching tabs
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
    setCandidates([]); // Clear previous results to show fresh search
    
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
    setAssignments([]); // Clear previous results

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
    <div className="min-h-screen pb-20 bg-slate-50">
      
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => setView('consultants')}>
            <BrainCircuit size={32} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">TalentAnalytics</h1>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('consultants')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${view === 'consultants' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={16}/> 
              <span className="hidden sm:inline">Konsulter</span>
              {selectedCandidates.length > 0 && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${view === 'consultants' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                  {selectedCandidates.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('assignments')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${view === 'assignments' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Briefcase size={16}/> 
              <span className="hidden sm:inline">Uppdrag</span>
              {selectedAssignments.length > 0 && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${view === 'assignments' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  {selectedAssignments.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('matchmaking')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${view === 'matchmaking' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShoppingCart size={16}/> 
              <span className="hidden sm:inline">Matchning</span>
              {basketCount > 0 && <span className="bg-white/20 px-1.5 rounded-full text-xs">{basketCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* VIEW: CONSULTANTS */}
        <div style={{ display: view === 'consultants' ? 'block' : 'none' }} className="animate-fade-in-up">
            <div className="mb-8 flex justify-between items-end">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900">Hitta Konsulter</h2>
                  <p className="text-slate-500">Sök efter kandidater och lägg till de bästa i matchningskorgen.</p>
               </div>
               <div className="hidden md:block">
                 {SAMPLE_PROMPTS.map((_, i) => (
                   <button key={i} onClick={() => loadSample(i)} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full mr-2 hover:border-indigo-300 text-slate-500">Exempel {i+1}</button>
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

            {errorMsg && view === 'consultants' && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex gap-2 items-center"><ShieldAlert/>{errorMsg}</div>}

            {candidates.length > 0 && (
               <div className="mt-8">
                  <BooleanStringDisplay booleanString={booleanString} />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
              <div className="mt-12 text-center text-slate-400">
                <Users size={48} className="mx-auto mb-2 opacity-20"/>
                <p>Gör en sökning för att se kandidater här.</p>
              </div>
            )}
        </div>

        {/* VIEW: ASSIGNMENTS */}
        <div style={{ display: view === 'assignments' ? 'block' : 'none' }} className="animate-fade-in-up">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-900">Hitta Uppdrag</h2>
               <p className="text-slate-500">Scanna marknaden (Verama, Ework, etc) efter aktiva uppdrag.</p>
            </div>

            <SearchForm 
              mode="assignments"
              criteria={assignmentCriteria} 
              setCriteria={setAssignmentCriteria} 
              onSearch={handleSearchAssignments}
              isLoading={isLoading}
            />

            {errorMsg && view === 'assignments' && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex gap-2 items-center"><ShieldAlert/>{errorMsg}</div>}

            {assignments.length > 0 && (
               <div className="mt-8 space-y-6">
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
                     <button onClick={handleLoadMoreAssignments} disabled={isLoading} className="px-6 py-2 bg-white border border-slate-300 rounded-full hover:bg-slate-50 font-medium text-slate-600 flex items-center gap-2 mx-auto">
                        {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-slate-500 rounded-full"/> : <PlusCircle size={16}/>}
                        Hämta fler
                     </button>
                  </div>
               </div>
            )}

             {!isLoading && assignments.length === 0 && !errorMsg && (
              <div className="mt-12 text-center text-slate-400">
                <Briefcase size={48} className="mx-auto mb-2 opacity-20"/>
                <p>Gör en sökning för att se uppdrag här.</p>
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