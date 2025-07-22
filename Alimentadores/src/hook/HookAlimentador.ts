import { useState, useEffect } from 'react';

export interface AlimentadorData {
  id: number;
  horaLiga: number;
  horaDesliga: number;
  dosePorCiclo: number;
  duracaoCiclo: number;
  temperatura: number;
  quantidade: number;
  quantidadeRestante: number;
  modo: number;
  ciclos: number;
  erros?: any[];
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
        id,
        horaLiga: 8,
        horaDesliga: 18,
        dosePorCiclo: 2,
        duracaoCiclo: 15,
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
