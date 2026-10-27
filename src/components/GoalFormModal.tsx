import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Type, AlertCircle } from 'lucide-react';
import { StudyGoal, GoalFormData, GoalStatus } from '../types/studyGoal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const isEditing = !!goalToEdit;

  // Obter data de amanhã como padrão se for novo
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    deadline: getDefaultDeadline(),
    status: 'nao_iniciado',
  });

  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        title: goalToEdit.title,
        description: goalToEdit.description,
        deadline: goalToEdit.deadline,
        status: goalToEdit.status,
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: getDefaultDeadline(),
        status: 'nao_iniciado',
      });
      setErrors({});
    }
  }, [goalToEdit, isOpen]);

  // Tecla Esc para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Escolha uma data limite para acompanhar o seu prazo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-stone-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isEditing
                ? 'Atualize os dados e o andamento da sua meta'
                : 'Defina o que você quer aprender e quando pretende concluir'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-stone-700 mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="goal-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex.: Aprender funções em JavaScript"
                className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-colors ${
                  errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-stone-200 focus:border-indigo-600'
                }`}
                autoFocus
              />
            </div>
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-stone-700 mb-1.5">
              Descrição ou Anotações <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <AlignLeft className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <textarea
                id="goal-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhe o que estudar, materiais, links ou passos para concluir..."
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Linha dupla: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Prazo Estimado <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  id="goal-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-white border rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-colors ${
                    errors.deadline ? 'border-rose-400 focus:border-rose-500' : 'border-stone-200 focus:border-indigo-600'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.deadline}</span>
                </p>
              )}
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Status Atual
              </label>
              <select
                id="goal-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as GoalStatus })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors cursor-pointer"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Dica amigável para o estudante */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60 text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Dica StudyFlow:</span> Metas menores e prazos realistas ajudam a manter a motivação sem sobrecarregar sua rotina.
          </div>

          {/* Ações do Rodapé do Formulário */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
