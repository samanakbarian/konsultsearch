import React from 'react';
import { Code, Copy, Check, Terminal } from 'lucide-react';

interface Props {
  booleanString: string;
}

const BooleanStringDisplay: React.FC<Props> = ({ booleanString }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(booleanString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e1e2e] rounded-2xl p-1 shadow-2xl shadow-indigo-500/20 mb-10 overflow-hidden border border-white/10">
      <div className="bg-[#181825] px-6 py-3 flex justify-between items-center rounded-t-xl border-b border-white/5">
        <div className="flex items-center gap-3">
             <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
             </div>
             <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 ml-2 uppercase tracking-wider">
               <Terminal size={12} /> Boolean Logic
             </h3>
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
        >
          {copied ? <Check size={12} className="text-emerald-400"/> : <Copy size={12} />}
          {copied ? 'Kopierad' : 'Kopiera'}
        </button>
      </div>
      <div className="p-6">
        <div className="font-mono text-sm leading-relaxed text-indigo-200 break-words selection:bg-indigo-500/30">
          <span className="text-pink-400">site:</span>linkedin.com/in <span className="text-emerald-400">AND</span> {booleanString}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-slate-500 font-medium">
               AI-genererad söksträng optimerad för Google X-Ray Search
            </p>
        </div>
      </div>
    </div>
  );
};

export default BooleanStringDisplay;