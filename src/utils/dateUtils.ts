/**
 * Formata uma data no formato YYYY-MM-DD para o formato brasileiro legível DD/MM/AAAA
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem data definida';
  
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Retorna uma descrição humana do prazo e seu status relativo (ex: 'Hoje', 'Amanhã', 'Atrasado', etc.)
 */
export function getDeadlineStatus(deadlineString: string, isCompleted: boolean): {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
} {
  if (isCompleted) {
    return {
      label: `Prazo: ${formatDateBR(deadlineString)}`,
      isOverdue: false,
      isUrgent: false,
    };
  }

  if (!deadlineString) {
    return {
      label: 'Sem prazo estipulado',
      isOverdue: false,
      isUrgent: false,
    };
  }

  const [year, month, day] = deadlineString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return {
      label: daysOverdue === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${daysOverdue} dias`,
      isOverdue: true,
      isUrgent: true,
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Vence hoje',
      isOverdue: false,
      isUrgent: true,
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Vence amanhã',
      isOverdue: false,
      isUrgent: true,
    };
  }

  if (diffDays <= 3) {
    return {
      label: `Vence em ${diffDays} dias`,
      isOverdue: false,
      isUrgent: true,
    };
  }

  return {
    label: `Prazo: ${formatDateBR(deadlineString)}`,
    isOverdue: false,
    isUrgent: false,
  };
}
