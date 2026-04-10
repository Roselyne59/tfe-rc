import { create } from 'zustand';

type ModalStore = {
  shouldOpenModal: boolean;
  setShouldOpenModal: (value: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  shouldOpenModal: false,
  setShouldOpenModal: (value) => set({ shouldOpenModal: value }),
}));
