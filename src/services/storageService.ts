import { StudyGoal, GoalFormData } from '../types/studyGoal';

const STORAGE_KEY = 'studyflow_goals_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
export const INITIAL_SAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'sample-1',
    title: 'Compreender estruturas de repetição (Loops)',
    description: 'Estudar os conceitos de for e while, praticando com pelo menos 5 exercícios no papel antes de codificar.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Ler o capítulo 1 do livro de Fundamentos',
    description: 'Fazer um mapa mental simples com os principais conceitos de algoritmos e variáveis.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Montar o ambiente de desenvolvimento',
    description: 'Instalar o VS Code, extensões recomendadas para iniciantes e testar um primeiro arquivo HTML/JS.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class StorageService {
  /**
   * Carrega os objetivos salvos no localStorage.
   * Se for a primeira visita, inicializa com exemplos práticos.
   */
  public getGoals(): StudyGoal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Primeira visita: inicializa com exemplos acolhedores
        this.saveGoals(INITIAL_SAMPLE_GOALS);
        return INITIAL_SAMPLE_GOALS;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a lista de objetivos no localStorage.
   */
  public saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  }

  /**
   * Cadastra um novo objetivo e persiste no armazenamento local.
   */
  public createGoal(data: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  }

  /**
   * Atualiza os dados de um objetivo existente.
   */
  public updateGoal(id: string, data: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updatedGoal: StudyGoal = {
      ...existing,
      ...data,
      title: data.title !== undefined ? data.title.trim() : existing.title,
      description: data.description !== undefined ? data.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  }

  /**
   * Exclui um objetivo pelo identificador.
   */
  public deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.saveGoals(filtered);
    return true;
  }

  /**
   * Restaura os exemplos iniciais para testes ou demonstração.
   */
  public resetToSamples(): StudyGoal[] {
    this.saveGoals(INITIAL_SAMPLE_GOALS);
    return INITIAL_SAMPLE_GOALS;
  }

  /**
   * Limpa todos os dados salvos.
   */
  public clearAll(): void {
    this.saveGoals([]);
  }
}

export const storageService = new StorageService();
