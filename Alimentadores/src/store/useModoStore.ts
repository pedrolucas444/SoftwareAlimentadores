import { useState } from 'react';

interface ModoStore {
  setpointManualAtivo: boolean;
  setSetpointManualAtivo: (ativo: boolean) => void;
}

const useModoStore = (): ModoStore => {
  const [setpointManualAtivo, setSetpointManualAtivo] = useState(false);

  return {
    setpointManualAtivo,
    setSetpointManualAtivo,
  };
};

export default useModoStore;
