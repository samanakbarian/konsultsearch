import React, { useState } from 'react';
import { Candidate, Assignment, MatchResult } from '../types';
import CandidateCard from './CandidateCard';
import AssignmentCard from './AssignmentCard';
import { performMatchmaking } from '../services/geminiService';
import { Sparkles, Trash2, ArrowRightLeft, ThumbsUp, AlertTriangle } from 'lucide-react';

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
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <Sparkles className="mx-auto text-slate-300 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-slate-700">Varukorgen är tom</h3>
        <p className="text-slate-500">Gå till flikarna "Konsulter" eller "Uppdrag" och välj objekt för att starta en matchning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ArrowRightLeft className="text-indigo-400" /> Matchningsmotor
          </h2>
          <p className="text-indigo-200 text-sm mt-1">
            Analysera {selectedCandidates.length} konsulter mot {selectedAssignments.length} uppdrag.
          </p>
        </div>
        <button
          onClick={handleMatch}
          disabled={isMatching || selectedCandidates.length === 0 || selectedAssignments.length === 0}
          className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isMatching ? (
            <><div className="animate-spin h-5 w-5 border-2 border-indigo-900 border-t-transparent rounded-full"/> Analyserar...</>
          ) : (
            <><Sparkles size={18} /> Kör Matchning</>
          )}
        </button>
      </div>

      {!hasRun ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Selected Candidates List */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
              Valda Konsulter ({selectedCandidates.length})
            </h3>
            <div className="space-y-4">
              {selectedCandidates.map(c => (
                <div key={c.id} className="relative group">
                   <CandidateCard candidate={c} hideSelection={true} />
                   <button 
                    onClick={() => onRemoveCandidate(c.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedCandidates.length === 0 && <p className="text-sm text-slate-400 italic">Inga konsulter valda.</p>}
            </div>
          </div>

          {/* Selected Assignments List */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
              Valda Uppdrag ({selectedAssignments.length})
            </h3>
            <div className="space-y-4">
              {selectedAssignments.map(a => (
                <div key={a.id} className="relative group">
                  <AssignmentCard assignment={a} hideSelection={true} />
                  <button 
                    onClick={() => onRemoveAssignment(a.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
              {selectedAssignments.length === 0 && <p className="text-sm text-slate-400 italic">Inga uppdrag valda.</p>}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-12">
          {selectedAssignments.map(assignment => (
            <div key={assignment.id} className="border-t-4 border-indigo-500 pt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="text-slate-400"/> Matchningar för: <span className="text-indigo-600">{assignment.title}</span>
              </h3>
              
              <div className="grid gap-6">
                {selectedCandidates.map(candidate => {
                  const match = getMatchForPair(candidate.id, assignment.id);
                  if (!match) return null;

                  return (
                    <div key={candidate.id} className="bg-slate-50 rounded-lg p-6 border border-slate-200 flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 border-r border-slate-200 pr-6">
                         <div className="font-bold text-lg text-slate-800">{candidate.name}</div>
                         <div className="text-sm text-slate-500 mb-2">{candidate.currentTitle}</div>
                         
                         <div className="flex items-center gap-2 mt-4">
                           <div className={`text-2xl font-bold ${match.matchScore > 80 ? 'text-emerald-600' : match.matchScore > 60 ? 'text-amber-600' : 'text-red-500'}`}>
                             {match.matchScore}%
                           </div>
                           <div className="text-xs uppercase font-bold text-slate-400">Match Score</div>
                         </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="mb-4">
                          <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Analys</h4>
                          <p className="text-slate-700 italic">"{match.reason}"</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                             <h4 className="text-xs font-bold uppercase text-emerald-600 mb-1 flex items-center gap-1"><ThumbsUp size={12}/> Styrkor</h4>
                             <ul className="text-sm text-slate-600 list-disc list-inside">
                               {match.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                          </div>
                          <div>
                             <h4 className="text-xs font-bold uppercase text-amber-600 mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Gaps/Risker</h4>
                             <ul className="text-sm text-slate-600 list-disc list-inside">
                               {match.gaps?.map((g, i) => <li key={i}>{g}</li>)}
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
          <div className="flex justify-center">
            <button 
              onClick={() => setHasRun(false)}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Tillbaka till översikt
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