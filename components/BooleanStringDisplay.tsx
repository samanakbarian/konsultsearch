import React from 'react';
import { Code, Copy, Check } from 'lucide-react';

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
    <div className="bg-slate-800 rounded-xl p-6 text-white mb-8 shadow-xl shadow-slate-400/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
          <Code size={16} /> Genererad Söksträng (Boolean)
        </h3>
        <button 
          onClick={copyToClipboard}
          className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14} />}
          {copied ? 'Kopierad' : 'Kopiera'}
        </button>
      </div>
      <div className="font-mono text-sm leading-relaxed text-indigo-300 break-words bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
        {booleanString}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Denna logik genererades av AI-agenten för att indexera relevanta profiler via Google Sök.
      </p>
    </div>
  );
};

export default BooleanStringDisplay;