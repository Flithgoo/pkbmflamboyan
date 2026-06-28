import { create } from "zustand";

type MaterialStore = {
  selectedMaterial: any;

  setSelectedMaterial: (material: any) => void;

  clearSelectedMaterial: () => void;
};

export const useMaterialStore = create<MaterialStore>((set) => ({
  selectedMaterial: null,

  setSelectedMaterial: (material) =>
    set({
      selectedMaterial: material,
    }),

  clearSelectedMaterial: () =>
    set({
      selectedMaterial: null,
    }),
}));
