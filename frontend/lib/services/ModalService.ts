/**
 * ModalService
 * 模态框服务 - 管理应用模态框
 */

import { create } from 'zustand';
import { ComponentType } from 'react';

export interface Modal {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface ModalStore {
  modals: Modal[];
  addModal: (modal: Omit<Modal, 'id'>) => string;
  removeModal: (id: string) => void;
  clearModals: () => void;
  topModal: Modal | null;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],
  
  addModal: (modal) => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    const newModal = { ...modal, id };
    
    set((state) => ({
      modals: [...state.modals, newModal],
    }));

    return id;
  },

  removeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }));
  },

  clearModals: () => {
    set({ modals: [] });
  },

  get topModal() {
    const modals = get().modals;
    return modals.length > 0 ? modals[modals.length - 1] : null;
  },
}));

// 便捷方法
export const modal = {
  open: (
    component: ComponentType<any>,
    props?: Record<string, any>,
    options?: {
      closeOnOutsideClick?: boolean;
      closeOnEscape?: boolean;
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    }
  ) => {
    return useModalStore.getState().addModal({
      component,
      props,
      ...options,
    });
  },

  close: (id: string) => {
    useModalStore.getState().removeModal(id);
  },

  closeAll: () => {
    useModalStore.getState().clearModals();
  },
};
