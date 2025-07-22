import { useState, useEffect } from "react";

const ContadorSaidas = () => {
  const [contadorSaidas, setContadorSaidas] = useState(0);

  useEffect(() => {
    // Carrega o contador e data do localStorage
    const contadorSalvo = localStorage.getItem('contadorSaidas');
    const ultimoDia = localStorage.getItem('ultimoDiaContador');
    const hoje = new Date().toDateString();

    if (ultimoDia !== hoje) {
      // Se for um novo dia, reseta o contador
      setContadorSaidas(0);
      localStorage.setItem('ultimoDiaContador', hoje);
      localStorage.setItem('contadorSaidas', '0');
    } else if (contadorSalvo) {
      // Se for o mesmo dia, carrega o contador salvo
      setContadorSaidas(Number(contadorSalvo));
    }

    let teclasPressionadas = false;

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && !teclasPressionadas) {
        e.preventDefault();
        teclasPressionadas = true;
        
        setContadorSaidas(prev => {
          const novoValor = prev + 1;
          localStorage.setItem('contadorSaidas', novoValor.toString());
          return novoValor;
        });
      }
    };

    const handleKeyUp = (e) => {
      if (!e.ctrlKey || !e.shiftKey || !e.altKey) {
        teclasPressionadas = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Configura verificação diária
    const verificarDia = () => {
      const agora = new Date();
      const tempoParaMeiaNoite = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate() + 1,
        0, 0, 0
      ).getTime() - agora.getTime();

      setTimeout(() => {
        setContadorSaidas(0);
        localStorage.setItem('ultimoDiaContador', new Date().toDateString());
        localStorage.setItem('contadorSaidas', '0');
      }, tempoParaMeiaNoite);
    };

    verificarDia();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="p-1 bg-blue-50 border border-blue-200 rounded-md mx-2">
      <h4 className="font-medium text-center text-blue-800">Saídas Diárias</h4>
      <div className="text-3xl font-bold text-center text-blue-600">
        {contadorSaidas}
      </div>
    </div>
  );
}
export default ContadorSaidas;