export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // formato ISO
  updatedAt: string; // formato ISO
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export type FilterStatus = 'todos' | GoalStatus;

export type SortOption = 'prazo_asc' | 'prazo_desc' | 'titulo_asc' | 'criacao_desc';

export interface StatusConfig {
  label: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  indicatorColor: string;
}

export const STATUS_CONFIG: Record<GoalStatus, StatusConfig> = {
  nao_iniciado: {
    label: 'Não iniciado',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    indicatorColor: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em andamento',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-200',
    indicatorColor: 'bg-sky-500',
  },
  concluido: {
    label: 'Concluído',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    indicatorColor: 'bg-emerald-500',
  },
};
