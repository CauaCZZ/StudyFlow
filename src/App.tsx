import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { GoalStats } from './components/GoalStats';
import { GoalFilters } from './components/GoalFilters';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { storageService } from './services/storageService';
import { StudyGoal, GoalFormData, GoalStatus, FilterStatus, SortOption } from './types/studyGoal';
import { Check, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Estados dos modais
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);

  // Estados de filtros, busca e ordenação
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('prazo_asc');

  // Mensagem de feedback temporária (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  // Carregar dados na montagem inicial
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
    setIsLoaded(true);
  }, []);

  // Handlers para criação e edição
  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals(storageService.getGoals());
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      storageService.createGoal(formData);
      setGoals(storageService.getGoals());
      showToast('Novo objetivo cadastrado com sucesso!');
    }
  };

  // Handlers para exclusão com confirmação
  const handleDeleteRequest = (goal: StudyGoal) => {
    setGoalToDelete(goal);
  };

  const handleDeleteConfirm = (id: string) => {
    const success = storageService.deleteGoal(id);
    if (success) {
      setGoals(storageService.getGoals());
      showToast('Objetivo removido com sucesso.');
    }
    setGoalToDelete(null);
  };

  // Handler para mudança rápida de status
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals(storageService.getGoals());
      if (newStatus === 'concluido') {
        showToast('Parabéns por concluir mais um objetivo! 🎉');
      }
    }
  };

  // Restaurar exemplos
  const handleRestoreSamples = () => {
    const samples = storageService.resetToSamples();
    setGoals(samples);
    showToast('Exemplos práticos carregados!');
  };

  // Contadores para os filtros
  const filterCounts = useMemo(() => {
    return {
      todos: goals.length,
      nao_iniciado: goals.filter((g) => g.status === 'nao_iniciado').length,
      em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluido: goals.filter((g) => g.status === 'concluido').length,
    };
  }, [goals]);

  // Lista de objetivos filtrada e ordenada
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (statusFilter !== 'todos' && goal.status !== statusFilter) {
          return false;
        }

        // Filtro por busca textual
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchDesc = goal.description.toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'prazo_asc':
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline.localeCompare(b.deadline);
          case 'prazo_desc':
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return b.deadline.localeCompare(a.deadline);
          case 'titulo_asc':
            return a.title.localeCompare(b.title, 'pt-BR');
          case 'criacao_desc':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [goals, statusFilter, searchQuery, sortOption]);

  const hasActiveFilters = statusFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        onOpenNewGoalModal={handleOpenCreateModal}
        totalGoals={goals.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bloco de Boas-vindas para o Estudante */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Meus Objetivos de Estudo
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Planeje o que deseja aprender, defina prazos realistas e acompanhe seu crescimento dia após dia.
          </p>
        </div>

        {/* Resumo de Metas e Estatísticas */}
        <GoalStats goals={goals} />

        {/* Seção de Listagem, Filtros e Ações */}
        {goals.length > 0 && (
          <GoalFilters
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            counts={filterCounts}
          />
        )}

        {/* Listagem de Cartões de Objetivos */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleOpenEditModal}
                onDeleteRequest={handleDeleteRequest}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isFiltered={goals.length > 0 && hasActiveFilters}
            onOpenNewGoalModal={handleOpenCreateModal}
            onResetFilters={() => {
              setStatusFilter('todos');
              setSearchQuery('');
            }}
            onRestoreSamples={handleRestoreSamples}
          />
        )}
      </main>

      {/* Rodapé com garantia de salvamento local */}
      <Footer
        onLoadSamples={handleRestoreSamples}
        hasGoals={goals.length > 0}
      />

      {/* Modal de Cadastro e Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        goalToEdit={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={!!goalToDelete}
        goal={goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
