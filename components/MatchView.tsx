import React, { useState } from 'react';
import { Candidate, Assignment, MatchResult } from '../types';
import { performMatchmaking } from '../services/geminiService';
import { 
  Sparkles, Trash2, ArrowRightLeft, PlayCircle, 
  CheckCircle2, Loader2, BrainCircuit, Building2, 
  ThumbsUp, AlertTriangle, MapPin, Clock, Info, X
} from 'lucide-react';

interface Props {
  selectedCandidates: Candidate[];
  selectedAssignments: Assignment[];
  onRemoveCandidate: (id: string) => void;
  onRemoveAssignment: (id: string) => void;
}

const ANALYSIS_STEPS = [
  "Extraherar kompetensdata...",
  "Korskör mot kravprofiler...",
  "Beräknar kulturell matchning...",
  "Genererar beslutsunderlag..."
];

const MatchView: React.FC<Props> = ({ selectedCandidates, selectedAssignments, onRemoveCandidate, onRemoveAssignment }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const handleMatch = async () => {
    if (selectedCandidates.length === 0 || selectedAssignments.length === 0) return;

    setIsMatching(true);
    setHasRun(false);
    setCurrentStep(0);

    // Simulator for visual steps to give weight to the analysis
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const results = await performMatchmaking(selectedCandidates, selectedAssignments);
      
      clearInterval(stepInterval);
      setCurrentStep(ANALYSIS_STEPS.length - 1);
      
      // Slight delay before showing results to ensure the last step is seen
      setTimeout(() => {
        setMatches(results);
        setIsMatching(false);
        setHasRun(true);
      }, 1000);

    } catch (e) {
      console.error(e);
      clearInterval(stepInterval);
      setIsMatching(false);
      alert("Kunde inte genomföra matchningen.");
    }
  };

  const getMatchForPair = (candId: string, assignId: string) => {
    return matches.find(m => m.candidateId === candId && m.assignmentId === assignId);
  };

  // --- EMPTY STATE ---
  if (selectedCandidates.length === 0 && selectedAssignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
           <Sparkles className="text-indigo-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Matchningsanalys</h3>
        <p className="text-slate-500 max-w-sm text-center">
          Gå till flikarna "Konsulter" eller "Uppdrag" och lägg till objekt (+) för att starta en AI-analys.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* --- HERO / CONTROL CENTER --- */}
      <div className={`relative overflow-visible transition-all duration-500 rounded-3xl shadow-2xl shadow-indigo-900/20 flex flex-col md:flex-row items-center justify-between gap-8 ${isMatching ? 'bg-slate-900 p-12 min-h-[400px]' : 'bg-gradient-to-br from-slate-900 to-indigo-900 p-10'}`}>
        
        {/* Background FX (only visible when not overflow hidden, masked by container if needed, but we need visible for tooltip) */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* CONTENT */}
        <div className="relative z-10 w-full">
          {!isMatching ? (
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-4 relative">
                    <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                      <BrainCircuit className="text-indigo-300" size={32} /> 
                    </div>
                    Matchningsmotor
                    
                    {/* Info Button & Tooltip */}
                    <div className="relative ml-1">
                        <button 
                          onClick={() => setShowInfo(!showInfo)}
                          className="p-1.5 rounded-full hover:bg-white/10 text-indigo-200 transition-colors"
                        >
                           <Info size={20} />
                        </button>
                        
                        {showInfo && (
                          <div className="absolute top-full left-0 mt-4 w-80 md:w-96 bg-white text-slate-800 p-5 rounded-2xl shadow-2xl z-50 text-left border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                              <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={14} className="text-indigo-500"/> AI-Logik
                                  </h4>
                                  <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={16}/>
                                  </button>
                              </div>
                              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                                 Vi skickar en strukturerad "Persona Prompt" till Gemini 1.5 Pro där den agerar som en <strong>Senior Account Manager</strong>.
                              </p>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                                <div className="flex gap-2 text-xs">
                                   <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">1</div>
                                   <p className="text-slate-600"><strong className="text-slate-800">Teknisk Analys:</strong> Matchar "Hard Skills" i konsultprofilen mot uppdragets krav.</p>
                                </div>
                                <div className="flex gap-2 text-xs">
                                   <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">2</div>
                                   <p className="text-slate-600"><strong className="text-slate-800">Nivåbedömning:</strong> Säkerställer att senioritet (t.ex. Lead/Junior) stämmer överens.</p>
                                </div>
                                <div className="flex gap-2 text-xs">
                                   <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">3</div>
                                   <p className="text-slate-600"><strong className="text-slate-800">Tröskelvärde:</strong> Endast matchningar med &gt;60% poäng presenteras.</p>
                                </div>
                              </div>
                              <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100"></div>
                          </div>
                        )}
                    </div>
                  </h2>
                  <p className="text-indigo-200 text-lg mt-4 font-medium max-w-xl">
                    Analysera <strong className="text-white">{selectedCandidates.length} konsulter</strong> mot <strong className="text-white">{selectedAssignments.length} uppdrag</strong> med hjälp av Gemini 1.5 Pro.
                  </p>
                </div>
                
                <button
                  onClick={handleMatch}
                  className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 group"
                >
                  <PlayCircle size={24} className="text-indigo-600 group-hover:text-indigo-800 transition-colors" /> 
                  Kör Analys
                </button>
            </div>
          ) : (
            /* PROGRESS HUD */
            <div className="w-full max-w-lg mx-auto animate-fade-in">
               <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative mb-4">
                     <BrainCircuit size={64} className="text-indigo-400 animate-pulse" />
                     <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 animate-pulse"></div>
                  </div>
                  <h3 className="text-white font-bold text-xl tracking-tight">AI Bearbetar Data</h3>
               </div>
               
               <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                  {ANALYSIS_STEPS.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                         <div className="shrink-0 relative">
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <CheckCircle2 size={14} className="text-white" strokeWidth={3} />
                              </div>
                            ) : isActive ? (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <Loader2 size={20} className="text-indigo-400 animate-spin" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-slate-700" />
                            )}
                         </div>
                         <span className={`text-sm font-medium ${isActive ? 'text-white scale-105 origin-left' : isCompleted ? 'text-indigo-200' : 'text-slate-500'} transition-transform duration-300`}>
                           {step}
                         </span>
                      </div>
                    );
                  })}
               </div>
               <p className="text-center text-xs text-slate-500 mt-6 font-mono opacity-60">
                 Running Gemini 1.5 Analysis...
               </p>
            </div>
          )}
        </div>
      </div>

      {/* --- SELECTION OVERVIEW (Before Run) --- */}
      {!isMatching && !hasRun && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between px-2">
              <span className="flex items-center gap-2"><ArrowRightLeft className="text-indigo-500"/> Valda Konsulter</span>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-lg font-bold">{selectedCandidates.length}</span>
            </h3>
            <div className="grid gap-3">
              {selectedCandidates.map(c => (
                <div key={c.id} className="group bg-slate-50 hover:bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-200 flex items-center justify-between transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shadow-sm">{c.name.substring(0,2).toUpperCase()}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-700">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.currentTitle}</div>
                      </div>
                   </div>
                   <button onClick={() => onRemoveCandidate(c.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedCandidates.length === 0 && <div className="text-center py-8 text-slate-400 text-sm italic">Inga konsulter valda</div>}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between px-2">
              <span className="flex items-center gap-2"><Building2 className="text-teal-500"/> Valda Uppdrag</span>
              <span className="bg-teal-100 text-teal-700 text-xs px-2.5 py-1 rounded-lg font-bold">{selectedAssignments.length}</span>
            </h3>
            <div className="grid gap-3">
              {selectedAssignments.map(a => (
                <div key={a.id} className="group bg-slate-50 hover:bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-200 flex items-center justify-between transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shadow-sm"><Building2 size={14}/></div>
                      <div className="max-w-[200px]">
                        <div className="text-sm font-bold text-slate-700 truncate">{a.title}</div>
                        <div className="text-xs text-slate-500 truncate">{a.client}</div>
                      </div>
                   </div>
                   <button onClick={() => onRemoveAssignment(a.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedAssignments.length === 0 && <div className="text-center py-8 text-slate-400 text-sm italic">Inga uppdrag valda</div>}
            </div>
          </div>
        </div>
      )}

      {/* --- RESULTS VIEW (After Run) --- */}
      {!isMatching && hasRun && (
        <div className="space-y-16 animate-slide-up-fade">
          {selectedAssignments.map(assignment => (
            <div key={assignment.id} className="relative">
              
              {/* Assignment Header Sticky */}
              <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-xl border border-indigo-100/50 rounded-2xl shadow-xl shadow-indigo-100/40 mb-8 flex flex-col transition-all">
                <div className="p-4 px-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-50 p-2.5 rounded-xl border border-teal-100 shrink-0">
                        <Building2 size={24} className="text-teal-600"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">{assignment.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                                {assignment.client}
                             </p>
                             <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                             <p className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin size={12}/> {assignment.location}
                             </p>
                             {assignment.deadline && (
                                <>
                                   <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                                   <p className="text-xs text-slate-500 flex items-center gap-1">
                                      <Clock size={12}/> {assignment.deadline}
                                   </p>
                                </>
                             )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <div className="px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100 text-xs font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
                        {matches.filter(m => m.assignmentId === assignment.id).length} Matchningar
                      </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 rounded-b-2xl">
                     <div className="text-sm text-slate-600 leading-relaxed">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Uppdragsbeskrivning</span>
                        <p className="line-clamp-2 hover:line-clamp-none transition-all cursor-help" title="Hovra för att läsa hela">
                           {assignment.description}
                        </p>
                     </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedCandidates.map(candidate => {
                  const match = getMatchForPair(candidate.id, assignment.id);
                  if (!match) return null;

                  return (
                    <div key={candidate.id} className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col xl:flex-row gap-8 transition-transform hover:scale-[1.005]">
                      
                      {/* Left: Score & Profile */}
                      <div className="xl:w-1/3 xl:border-r border-slate-100 xl:pr-8 flex flex-col justify-center">
                         <div className="flex items-center gap-5 mb-6">
                           <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-extrabold shadow-inner ${match.matchScore >= 80 ? 'bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50' : match.matchScore >= 60 ? 'bg-amber-50 text-amber-600 ring-8 ring-amber-50/50' : 'bg-red-50 text-red-500'}`}>
                             {match.matchScore}%
                           </div>
                           <div>
                             <div className="text-2xl font-bold text-slate-800">{candidate.name}</div>
                             <div className="text-sm font-medium text-slate-500">{candidate.currentTitle}</div>
                             <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{candidate.location}</span>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                           <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">AI Bedömning</h4>
                           <p className="text-sm text-slate-700 leading-relaxed italic">"{match.reason}"</p>
                         </div>
                      </div>

                      {/* Right: Detailed Analysis */}
                      <div className="xl:w-2/3 grid md:grid-cols-2 gap-6">
                         
                         {/* Strengths */}
                         <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 uppercase tracking-wide mb-4">
                              <ThumbsUp size={16} className="text-emerald-500"/> Styrkor
                            </h4>
                            <ul className="space-y-3">
                              {match.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                         </div>

                         {/* Gaps */}
                         <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 uppercase tracking-wide mb-4">
                              <AlertTriangle size={16} className="text-amber-500"/> Utvecklingsområden
                            </h4>
                            <ul className="space-y-3">
                              {match.gaps.map((g, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                  <div className="w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center mt-0.5 shrink-0 text-[10px] text-amber-700 font-bold">!</div>
                                  <span>{g}</span>
                                </li>
                              ))}
                              {match.gaps.length === 0 && (
                                <li className="text-sm text-slate-400 italic">Inga tydliga brister hittades.</li>
                              )}
                            </ul>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchView;