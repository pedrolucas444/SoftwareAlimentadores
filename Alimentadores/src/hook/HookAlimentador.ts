import { useState } from 'react';

export interface AlimentadorData {
  ciclos?: number;
  modo?: number;
  horaLiga?: number;
  horaDesliga?: number;
  setPoint?: number; // gramas
  dosePorCiclo?: number;
  temperatura?: number;
  quantidade?: number;
  quantidadeRestante?: number;
  setPointManual?: number; // gramas
  especie?: string;
  idade?: number;
  quantidadePeixes?: number;
  tipoRacao?: string ;
}

export const useAlimentadorData = () => {
  const [Alimentador, setAlimentador] = useState<AlimentadorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados do alimentador (mock data por enquanto)
  const fetchAlimentadorData = async (id: number) => {
    try {
      setLoading(true);
      // TODO: Substituir por chamada real à API
      // const response = await fetch(`/api/alimentador/${id}`);
      // const data = await response.json();
      
      // Mock data por enquanto
      const mockData: AlimentadorData = {
        horaLiga: 8,
        horaDesliga: 18,
        dosePorCiclo: 2,
        temperatura: 30,
        quantidade: 2040,
        quantidadeRestante: 960,
        modo: 1,
        ciclos: 0,
      };
      
      setAlimentador(mockData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do alimentador');
      console.error('Erro ao buscar dados do alimentador:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    Alimentador,
    loading,
    error,
    fetchAlimentadorData,
  };
};
