import React from 'react';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onLoadSamples: () => void;
  hasGoals: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onLoadSamples, hasGoals }) => {
  return (
    <footer className="mt-16 border-t border-stone-200 py-8 bg-white/50 text-stone-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-stone-700">StudyFlow</span>
          <span>· Organização para estudantes iniciantes</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dados salvos automaticamente no seu navegador</span>
          </div>

          {hasGoals && (
            <button
              type="button"
              onClick={onLoadSamples}
              className="text-stone-500 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 underline underline-offset-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Restaurar exemplos iniciais</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
