import { create } from "zustand";
import { getAllClasses } from "@/lib/api/classes";
import { getAllLocation } from "@/lib/api/location";

export type ClassItem = { id: number; name: string };
export type LocationItem = { id: number; name: string };

type ClassLocationState = {
  classes: ClassItem[];
  locations: LocationItem[];
  setClasses: (classes: ClassItem[]) => void;
  setLocations: (locations: LocationItem[]) => void;
  fetchClasses: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  fetchAll: () => Promise<void>;
  clear: () => void;
};

export const useClassLocationStore = create<ClassLocationState>((set) => ({
  classes: [],
  locations: [],

  setClasses: (classes) => set({ classes }),
  setLocations: (locations) => set({ locations }),

  fetchClasses: async () => {
    try {
      const { data } = await getAllClasses();
      set({ classes: data ?? [] });
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  },

  fetchLocations: async () => {
    try {
      const { data } = await getAllLocation();
      set({ locations: data ?? [] });
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  },

  fetchAll: async () => {
    try {
      const [classesRes, locationsRes] = await Promise.all([
        getAllClasses(),
        getAllLocation(),
      ]);
      set({ classes: classesRes.data ?? [], locations: locationsRes.data ?? [] });
    } catch (err) {
      console.error("Failed to fetch classes or locations", err);
    }
  },

  clear: () => set({ classes: [], locations: [] }),
}));
