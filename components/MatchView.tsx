import React, { useState } from 'react';
import { Candidate, Assignment, MatchResult } from '../types';
import CandidateCard from './CandidateCard';
import AssignmentCard from './AssignmentCard';
import { performMatchmaking } from '../services/geminiService';
import { Sparkles, Trash2, ArrowRightLeft, ThumbsUp, AlertTriangle, PlayCircle } from 'lucide-react';

interface Props {
  selectedCandidates: Candidate[];
  selectedAssignments: Assignment[];
  onRemoveCandidate: (id: string) => void;
  onRemoveAssignment: (id: string) => void;
}

const MatchView: React.FC<Props> = ({ selectedCandidates, selectedAssignments, onRemoveCandidate, onRemoveAssignment }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      const results = await performMatchmaking(selectedCandidates, selectedAssignments);
      setMatches(results);
      setHasRun(true);
    } catch (e) {
      console.error(e);
      alert("Kunde inte genomföra matchningen.");
    } finally {
      setIsMatching(false);
    }
  };

  const getMatchForPair = (candId: string, assignId: string) => {
    return matches.find(m => m.candidateId === candId && m.assignmentId === assignId);
  };

  if (selectedCandidates.length === 0 && selectedAssignments.length === 0) {
    return (
      <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <Sparkles className="text-slate-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Varukorgen är tom</h3>
        <p className="text-slate-500 max-w-sm mx-auto">Gå till flikarna "Konsulter" eller "Uppdrag" och välj objekt för att starta en AI-matchning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up pb-20">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-indigo-900/30 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
               <ArrowRightLeft className="text-violet-300" /> 
            </div>
            AI Matchmaking
          </h2>
          <p className="text-indigo-200 text-lg mt-2 font-medium">
            Analysera <strong className="text-white">{selectedCandidates.length} konsulter</strong> mot <strong className="text-white">{selectedAssignments.length} uppdrag</strong>.
          </p>
        </div>
        <button
          onClick={handleMatch}
          disabled={isMatching || selectedCandidates.length === 0 || selectedAssignments.length === 0}
          className="relative z-10 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 group"
        >
          {isMatching ? (
            <><div className="animate-spin h-5 w-5 border-2 border-indigo-900 border-t-transparent rounded-full"/> Analyserar...</>
          ) : (
            <><PlayCircle size={20} className="text-violet-600 group-hover:text-violet-800 transition-colors" /> Kör Analys</>
          )}
        </button>
      </div>

      {!hasRun ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Selected Candidates List */}
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between px-2">
              <span>Valda Konsulter</span>
              <span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-lg">{selectedCandidates.length} st</span>
            </h3>
            <div className="space-y-4">
              {selectedCandidates.map(c => (
                <div key={c.id} className="relative group">
                   <CandidateCard candidate={c} hideSelection={true} />
                   <button 
                    onClick={() => onRemoveCandidate(c.id)}
                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedCandidates.length === 0 && <p className="text-sm text-slate-400 italic text-center py-10">Inga konsulter valda.</p>}
            </div>
          </div>

          {/* Selected Assignments List */}
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between px-2">
              <span>Valda Uppdrag</span>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-lg">{selectedAssignments.length} st</span>
            </h3>
            <div className="space-y-4">
              {selectedAssignments.map(a => (
                <div key={a.id} className="relative group">
                  <AssignmentCard assignment={a} hideSelection={true} />
                  <button 
                    onClick={() => onRemoveAssignment(a.id)}
                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedAssignments.length === 0 && <p className="text-sm text-slate-400 italic text-center py-10">Inga uppdrag valda.</p>}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-16">
          {selectedAssignments.map(assignment => (
            <div key={assignment.id} className="relative">
              {/* Assignment Header */}
              <div className="sticky top-24 z-30 bg-white/90 backdrop-blur-lg border border-indigo-100 py-4 px-6 rounded-2xl shadow-lg shadow-indigo-100/50 mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-lg"><Building2 size={20} className="text-indigo-500"/></div>
                  Matchningar för: <span className="text-indigo-600 border-b-2 border-indigo-100">{assignment.title}</span>
                </h3>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Rapport</div>
              </div>
              
              <div className="grid gap-6">
                {selectedCandidates.map(candidate => {
                  const match = getMatchForPair(candidate.id, assignment.id);
                  if (!match) return null;

                  return (
                    <div key={candidate.id} className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col lg:flex-row gap-8 transition-transform hover:scale-[1.01]">
                      
                      {/* Left: Score & Person */}
                      <div className="lg:w-1/3 lg:border-r border-slate-100 lg:pr-8 flex flex-col justify-center">
                         <div className="flex items-center gap-4 mb-6">
                           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-inner ${match.matchScore > 80 ? 'bg-emerald-50 text-emerald-600' : match.matchScore > 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                             {match.matchScore}%
                           </div>
                           <div>
                             <div className="text-2xl font-bold text-slate-800">{candidate.name}</div>
                             <div className="text-sm font-medium text-slate-400">{candidate.currentTitle}</div>
                           </div>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${match.matchScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${match.matchScore}%`}}></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase text-slate-400 tracking-wider">
                                <span>Låg</span>
                                <span>Medium</span>
                                <span>Hög</span>
                            </div>
                         </div>
                      </div>
                      
                      {/* Right: Analysis */}
                      <div className="lg:w-2/3">
                        <div className="mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="text-xs font-bold uppercase text-indigo-400 mb-2 flex items-center gap-2"><Sparkles size={14}/> AI Analys</h4>
                          <p className="text-slate-700 leading-relaxed italic">"{match.reason}"</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <h4 className="text-xs font-bold uppercase text-emerald-600 mb-3 flex items-center gap-2 bg-emerald-50 w-fit px-3 py-1 rounded-full"><ThumbsUp size={12}/> Styrkor</h4>
                             <ul className="space-y-2">
                               {match.strengths?.map((s, i) => (
                                 <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                   {s}
                                 </li>
                               ))}
                             </ul>
                          </div>
                          <div>
                             <h4 className="text-xs font-bold uppercase text-amber-600 mb-3 flex items-center gap-2 bg-amber-50 w-fit px-3 py-1 rounded-full"><AlertTriangle size={12}/> Gaps/Risker</h4>
                             <ul className="space-y-2">
                               {match.gaps?.map((g, i) => (
                                 <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                   {g}
                                 </li>
                               ))}
                             </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-center pt-10">
            <button 
              onClick={() => setHasRun(false)}
              className="px-8 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-slate-600 font-bold hover:bg-slate-50 hover:shadow-md transition-all"
            >
              Starta ny matchning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

export default MatchView;