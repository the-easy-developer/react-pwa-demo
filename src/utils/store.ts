import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SelectedTitleStoreType = {
  selectedTitle: string;
  setSelectedTitle: (a: string) => void;
};

export const useSelectedTitleStore = create<SelectedTitleStoreType>()(
  persist(
    (set) => ({
      selectedTitle: "",
      setSelectedTitle: (newTitle: string) =>
        set(() => ({
          selectedTitle: newTitle,
        })),
    }),
    {
      name: "selected-title-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
