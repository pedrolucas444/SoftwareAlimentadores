import { create } from "zustand";

interface ModoStore {
  setpointManualAtivo: boolean;
  setSetpointManualAtivo: (ativo: boolean) => void;
}

const useModoStore = create<ModoStore>((set) => ({
  setpointManualAtivo: false,
  setSetpointManualAtivo: (ativo: boolean) => set({ setpointManualAtivo: ativo }),
}));

export default useModoStore;