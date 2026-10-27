import React from 'react';
import { BookOpen, Plus, Sparkles, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewGoalModal: () => void;
  onResetFilters?: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewGoalModal,
  onResetFilters,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-stone-300 p-10 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">Nenhum objetivo encontrado</h3>
        <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
          Não encontramos objetivos correspondentes aos filtros ou à busca selecionada.
        </p>
        {onResetFilters && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros e busca</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-stone-900">
        Pronto para organizar seus estudos?
      </h3>
      <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
        Você ainda não cadastrou nenhum objetivo de estudo. Definir pequenos passos diários torna o aprendizado muito mais simples e prazeroso!
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenNewGoalModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar primeiro objetivo</span>
        </button>

        {onRestoreSamples && (
          <button
            type="button"
            onClick={onRestoreSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Carregar exemplos sugeridos</span>
          </button>
        )}
      </div>
    </div>
  );
};
