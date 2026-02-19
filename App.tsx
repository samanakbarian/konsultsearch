import React, { useState } from 'react';
import { SearchCriteria, Assignment, Candidate } from './types';
import { findCandidates, searchAssignments } from './services/geminiService';
import SearchForm from './components/SearchForm';
import CandidateCard from './components/CandidateCard';
import AssignmentCard from './components/AssignmentCard';
import MatchView from './components/MatchView';
import { SAMPLE_PROMPTS } from './constants';
import { 
  BrainCircuit, ShieldAlert, Users, Briefcase, 
  ShoppingCart, Sparkles, LayoutDashboard, 
  Settings, LogOut, ChevronRight, X
} from 'lucide-react';

type View = 'consultants' | 'assignments' | 'matchmaking';

const App: React.FC = () => {
  const [view, setView] = useState<View>('consultants');
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Data States
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Basket State
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<Assignment[]>([]);

  // UI State: Detail Drawer
  const [activeItem, setActiveItem] = useState<{ type: 'candidate' | 'assignment', data: any } | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = useState(false);

  // Criteria
  const [consultantCriteria, setConsultantCriteria] = useState<SearchCriteria>({
    techStack: '', experienceLevel: 'Senior', role: '', location: '', keywords: ''
  });

  const [assignmentCriteria, setAssignmentCriteria] = useState<SearchCriteria>({
    techStack: '', experienceLevel: 'Senior', role: '', location: '', keywords: ''
  });

  // --- Actions ---

  const handleSearchConsultants = async () => {
    if (!consultantCriteria.role || !consultantCriteria.techStack) {
      alert("Ange roll och kompetens för att hitta konsulter."); return;
    }
    setIsLoading(true); setErrorMsg(""); setCandidates([]); 
    try {
      const data = await findCandidates(consultantCriteria);
      setCandidates(data.candidates);
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : "Fel vid sökning."); } 
    finally { setIsLoading(false); }
  };

  const handleSearchAssignments = async () => {
    if (!assignmentCriteria.role) {
      alert("Ange åtminstone en roll/titel för att hitta uppdrag."); return;
    }
    setIsLoading(true); setErrorMsg(""); setAssignments([]); 
    try {
      const data = await searchAssignments(assignmentCriteria);
      setAssignments(data);
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : "Fel vid uppdragssökning."); } 
    finally { setIsLoading(false); }
  };

  const toggleCandidate = (c: Candidate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedCandidates.find(x => x.id === c.id)) {
      setSelectedCandidates(prev => prev.filter(x => x.id !== c.id));
    } else {
      setSelectedCandidates(prev => [...prev, c]);
    }
  };

  const toggleAssignment = (a: Assignment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedAssignments.find(x => x.id === a.id)) {
      setSelectedAssignments(prev => prev.filter(x => x.id !== a.id));
    } else {
      setSelectedAssignments(prev => [...prev, a]);
    }
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_PROMPTS[index];
    const newCriteria = {
      role: sample.role, techStack: sample.stack, experienceLevel: sample.exp as any, location: sample.location, keywords: sample.keywords
    };
    if (view === 'consultants') setConsultantCriteria(newCriteria);
    else setAssignmentCriteria(newCriteria);
  };

  const openDrawer = (type: 'candidate' | 'assignment', data: any) => {
    setActiveItem({ type, data });
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-20">
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={20} strokeWidth={2.5} />
            </div>
            <span className="ml-3 font-bold text-lg tracking-tight text-slate-800 hidden lg:block">
              Talent<span className="text-indigo-600">Analytics</span>
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 mt-4">
            <NavItem 
              active={view === 'consultants'} 
              onClick={() => setView('consultants')} 
              icon={<Users size={20}/>} 
              label="Sök Kandidater" 
              count={selectedCandidates.length}
            />
            <NavItem 
              active={view === 'assignments'} 
              onClick={() => setView('assignments')} 
              icon={<Briefcase size={20}/>} 
              label="Hitta Uppdrag" 
              count={selectedAssignments.length}
              colorClass="group-hover:text-teal-600"
              activeColorClass="text-teal-700 bg-teal-50"
            />
            <div className="pt-4 pb-2">
               <div className="h-px bg-slate-100 mx-2"></div>
            </div>
            <NavItem 
              active={view === 'matchmaking'} 
              onClick={() => setView('matchmaking')} 
              icon={<ShoppingCart size={20}/>} 
              label="Matchning" 
              count={selectedCandidates.length + selectedAssignments.length}
              isSpecial
            />
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100">
           <button className="flex items-center gap-3 w-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Settings size={20} />
              <span className="text-sm font-medium hidden lg:block">Inställningar</span>
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header / Filter Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 {view === 'consultants' && <> <Users size={20} className="text-indigo-500"/> Kandidatsök </>}
                 {view === 'assignments' && <> <Briefcase size={20} className="text-teal-500"/> Uppdragsdatabas </>}
                 {view === 'matchmaking' && <> <LayoutDashboard size={20} className="text-violet-500"/> Matchningsanalys </>}
              </h2>
           </div>
           
           {/* Quick Actions */}
           <div className="flex items-center gap-3">
             {view !== 'matchmaking' && (
                <div className="hidden md:flex gap-2">
                  {SAMPLE_PROMPTS.map((_, i) => (
                    <button 
                      key={i} onClick={() => loadSample(i)} 
                      className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:border-indigo-300 text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={12}/> Demo {i+1}
                    </button>
                  ))}
                </div>
             )}
             <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="User" />
             </div>
           </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-7xl mx-auto space-y-8">
              
              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="animate-fade-in-down p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex gap-3 items-center shadow-sm">
                  <ShieldAlert size={20}/>
                  <span className="font-medium">{errorMsg}</span>
                  <button onClick={() => setErrorMsg("")} className="ml-auto"><X size={16}/></button>
                </div>
              )}

              {/* --- VIEW: CONSULTANTS --- */}
              {view === 'consultants' && (
                <>
                  <SearchForm 
                    mode="candidates"
                    criteria={consultantCriteria} 
                    setCriteria={setConsultantCriteria} 
                    onSearch={handleSearchConsultants}
                    isLoading={isLoading}
                  />

                  {candidates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-20">
                      {candidates.map((c, i) => (
                          <div key={c.id} onClick={() => openDrawer('candidate', c)} className="cursor-pointer">
                            <CandidateCard 
                              candidate={c} 
                              rank={i+1}
                              isSelected={!!selectedCandidates.find(x => x.id === c.id)}
                              onToggleSelect={(cand) => toggleCandidate(cand)}
                              compactMode={true}
                            />
                          </div>
                      ))}
                    </div>
                  ) : (
                     !isLoading && <EmptyState icon={<Users size={48} className="text-indigo-200"/>} title="Inga kandidater än" sub="Använd filtret ovan för att starta." />
                  )}
                </>
              )}

              {/* --- VIEW: ASSIGNMENTS --- */}
              {view === 'assignments' && (
                <>
                  <SearchForm 
                    mode="assignments"
                    criteria={assignmentCriteria} 
                    setCriteria={setAssignmentCriteria} 
                    onSearch={handleSearchAssignments}
                    isLoading={isLoading}
                  />

                  {assignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-20">
                      {assignments.map((a) => (
                        <div key={a.id} onClick={() => openDrawer('assignment', a)} className="cursor-pointer">
                           <AssignmentCard 
                            assignment={a}
                            isSelected={!!selectedAssignments.find(x => x.id === a.id)}
                            onToggleSelect={(assign) => toggleAssignment(assign)}
                            compactMode={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    !isLoading && <EmptyState icon={<Briefcase size={48} className="text-teal-200"/>} title="Inga uppdrag laddade" sub="Sök på roller för att hitta gig." />
                  )}
                </>
              )}

              {/* --- VIEW: MATCHMAKING --- */}
              {view === 'matchmaking' && (
                <MatchView 
                  selectedCandidates={selectedCandidates}
                  selectedAssignments={selectedAssignments}
                  onRemoveCandidate={(id) => setSelectedCandidates(prev => prev.filter(x => x.id !== id))}
                  onRemoveAssignment={(id) => setSelectedAssignments(prev => prev.filter(x => x.id !== id))}
                />
              )}
           </div>
        </div>

      </main>

      {/* --- SLIDE-OVER DRAWER (DETAILS) --- */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setActiveItem(null)} />
           
           {/* Panel */}
           <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                 {activeItem.type === 'candidate' ? (
                    <CandidateDetailView candidate={activeItem.data} />
                 ) : (
                    <AssignmentDetailView assignment={activeItem.data} />
                 )}
              </div>
              
              {/* Drawer Footer Action */}
              <div className="mt-auto border-t border-slate-100 p-6 bg-slate-50 sticky bottom-0">
                 <button 
                    onClick={() => {
                       if (activeItem.type === 'candidate') toggleCandidate(activeItem.data);
                       else toggleAssignment(activeItem.data);
                       setActiveItem(null);
                    }}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${activeItem.type === 'candidate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                 >
                    {activeItem.type === 'candidate' 
                      ? (selectedCandidates.find(x => x.id === activeItem.data.id) ? 'Ta bort från urval' : 'Lägg till kandidat i urval')
                      : (selectedAssignments.find(x => x.id === activeItem.data.id) ? 'Ta bort från urval' : 'Lägg till uppdrag i urval')
                    }
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

// --- SUB COMPONENTS ---

const NavItem = ({ active, onClick, icon, label, count, colorClass, activeColorClass, isSpecial }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? (activeColorClass || 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm') 
        : `text-slate-500 hover:bg-slate-50 ${colorClass || 'hover:text-slate-900'}`
    } ${isSpecial && active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : ''}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="hidden lg:block text-sm">{label}</span>
    </div>
    {count > 0 && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/50 text-current' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    )}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-current rounded-r-full" />}
  </button>
);

const EmptyState = ({ icon, title, sub }: any) => (
  <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
     <div className="mb-4">{icon}</div>
     <h3 className="text-lg font-bold text-slate-700">{title}</h3>
     <p className="text-slate-400 max-w-xs">{sub}</p>
  </div>
);

// Reuse the detail logic from the cards, but in a cleaner full-view component
const CandidateDetailView = ({ candidate }: { candidate: Candidate }) => (
  <div className="space-y-6">
     <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-600">
           {candidate.name.substring(0,2).toUpperCase()}
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-900">{candidate.name}</h2>
           <p className="text-lg text-slate-500 font-medium">{candidate.currentTitle}</p>
           <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">Match: {candidate.matchScore}%</span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">{candidate.location}</span>
           </div>
        </div>
     </div>
     
     <div className="prose prose-slate prose-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Sammanfattning</h4>
        <p className="text-slate-700">{candidate.summary}</p>
     </div>

     {candidate.justification && (
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
          <h4 className="text-xs font-bold uppercase text-indigo-400 mb-2">AI Analys</h4>
          <p className="text-slate-700">{candidate.justification}</p>
        </div>
     )}

     <div>
        <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Kompetensprofil</h4>
        <div className="flex flex-wrap gap-2">
           {candidate.skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                 {s}
              </span>
           ))}
        </div>
     </div>
  </div>
);

const AssignmentDetailView = ({ assignment }: { assignment: Assignment }) => (
  <div className="space-y-6">
     <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
           <Briefcase size={32} />
        </div>
        <div>
           <h2 className="text-xl font-bold text-slate-900 leading-tight">{assignment.title}</h2>
           <p className="text-slate-500 font-medium mt-1">{assignment.client}</p>
        </div>
     </div>

     <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div className="text-[10px] font-bold uppercase text-slate-400">Plats</div>
           <div className="font-medium text-slate-700">{assignment.location}</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div className="text-[10px] font-bold uppercase text-slate-400">Start / Deadline</div>
           <div className="font-medium text-slate-700">{assignment.deadline || 'Snarast'}</div>
        </div>
     </div>

     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-xs font-bold uppercase text-teal-500 mb-3">Uppdragsbeskrivning</h4>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{assignment.description}</p>
     </div>
     
     {assignment.url && (
        <a href={assignment.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
           Ansök externt <ChevronRight size={16}/>
        </a>
     )}
  </div>
);

export default App;