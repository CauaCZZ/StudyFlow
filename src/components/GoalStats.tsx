import React from 'react';
import { Target, Clock, CheckCircle2, CircleDot } from 'lucide-react';
import { StudyGoal } from '../types/studyGoal';

interface GoalStatsProps {
  goals: StudyGoal[];
}

export const GoalStats: React.FC<GoalStatsProps> = ({ goals }) => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  // Frase de encorajamento para o estudante iniciante
  const getMotivationalMessage = () => {
    if (total === 0) return 'Cadastre seu primeiro objetivo para iniciar sua jornada de aprendizado.';
    if (percentConcluido === 100) return 'Incrível! Você concluiu todos os seus objetivos cadastrados!';
    if (percentConcluido >= 50) return 'Ótimo ritmo! Você já concluiu mais da metade das suas metas.';
    if (emAndamento > 0) return 'Mantenha o foco: você tem metas ativas em andamento.';
    return 'Defina suas prioridades e comece dando um pequeno passo hoje.';
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Resumo da sua jornada</h2>
          <p className="text-xs text-stone-500 mt-0.5">{getMotivationalMessage()}</p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/60">
            <span className="text-xs font-medium text-stone-600">Progresso Geral:</span>
            <span className="text-sm font-bold font-mono text-stone-900 tabular-nums">
              {percentConcluido}%
            </span>
          </div>
        )}
      </div>

      {/* Barra de Progresso visual */}
      {total > 0 && (
        <div className="w-full bg-stone-100 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentConcluido}%` }}
          />
        </div>
      )}

      {/* Grid com contadores numéricos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {/* Total */}
        <div className="p-3.5 rounded-lg bg-stone-50/80 border border-stone-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Total Cadastrado</p>
            <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-0.5">
              {total}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-800">Não Iniciados</p>
            <p className="text-2xl font-bold font-mono text-amber-900 tabular-nums mt-0.5">
              {naoIniciados}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <CircleDot className="w-4 h-4" />
          </div>
        </div>

        {/* Em Andamento */}
        <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-sky-800">Em Andamento</p>
            <p className="text-2xl font-bold font-mono text-sky-900 tabular-nums mt-0.5">
              {emAndamento}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Concluídos */}
        <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-800">Concluídos</p>
            <p className="text-2xl font-bold font-mono text-emerald-900 tabular-nums mt-0.5">
              {concluidos}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};
