import React from 'react';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  CircleDot, 
  Clock, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { StudyGoal, GoalStatus, STATUS_CONFIG } from '../types/studyGoal';
import { getDeadlineStatus } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const deadlineInfo = getDeadlineStatus(goal.deadline, isCompleted);
  const statusConfig = STATUS_CONFIG[goal.status];

  // Alterna rapidamente o status para o próximo estágio natural
  const handleNextStatus = () => {
    if (goal.status === 'nao_iniciado') {
      onStatusChange(goal.id, 'em_andamento');
    } else if (goal.status === 'em_andamento') {
      onStatusChange(goal.id, 'concluido');
    } else {
      onStatusChange(goal.id, 'nao_iniciado');
    }
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'em_andamento':
        return <Clock className="w-4 h-4 text-sky-600 shrink-0" />;
      case 'nao_iniciado':
      default:
        return <CircleDot className="w-4 h-4 text-amber-600 shrink-0" />;
    }
  };

  return (
    <article
      className={`bg-white rounded-xl border transition-all duration-150 p-5 flex flex-col justify-between shadow-xs ${
        isCompleted
          ? 'border-stone-200 bg-stone-50/40 opacity-95'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Top Header do Card: Status + Ações Rápidas */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Status com rótulo descritivo e ícone */}
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {getStatusIcon()}
            <span className={statusConfig.textColor}>{statusConfig.label}</span>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold text-stone-900 leading-snug mb-2 ${
            isCompleted ? 'line-through text-stone-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description && (
          <p
            className={`text-sm text-stone-600 leading-relaxed whitespace-pre-line mb-4 ${
              isCompleted ? 'text-stone-400' : ''
            }`}
          >
            {goal.description}
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botão de Transição de Status */}
      <div className="pt-4 mt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        {/* Informação de Prazo */}
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            deadlineInfo.isOverdue
              ? 'text-rose-600 font-semibold'
              : deadlineInfo.isUrgent
              ? 'text-amber-700'
              : 'text-stone-500'
          }`}
        >
          {deadlineInfo.isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          ) : (
            <Calendar className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{deadlineInfo.label}</span>
        </div>

        {/* Botão de mudança rápida de status */}
        <button
          type="button"
          onClick={handleNextStatus}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
            goal.status === 'nao_iniciado'
              ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
              : goal.status === 'em_andamento'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
          }`}
          title="Avançar estágio do objetivo"
        >
          {goal.status === 'nao_iniciado' && (
            <>
              <span>Iniciar estudo</span>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          {goal.status === 'em_andamento' && (
            <>
              <span>Marcar concluído</span>
              <CheckCircle2 className="w-3 h-3" />
            </>
          )}
          {goal.status === 'concluido' && (
            <>
              <span>Reabrir objetivo</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
