/**
 * Modal 状态管理 Hook
 */

import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  data: unknown;
  open: (data?: unknown) => void;
  close: () => void;
  toggle: () => void;
}

export function createModalStore(initialState = false) {
  return create<ModalState>((set) => ({
    isOpen: initialState,
    data: null,
    open: (data) => set({ isOpen: true, data }),
    close: () => set({ isOpen: false, data: null }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  }));
}

// 使用示例: const useAuthModal = createModalStore();
// const { isOpen, open, close } = useAuthModal();

export function useModal(store: ReturnType<typeof createModalStore>) {
  const isOpen = store((state) => state.isOpen);
  const data = store((state) => state.data);
  const open = store((state) => state.open);
  const close = store((state) => state.close);
  const toggle = store((state) => state.toggle);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
}
