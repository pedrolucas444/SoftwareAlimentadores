type Erro = {
  titulo: string;
  detalhe: string;
  full?: boolean;
};

type Props = {
  tituloTabela?: string;
  erros: Erro[];
};

export default function TabelaDeErros({
  tituloTabela = "Tabela de Erros",
  erros,
}: Props) {
  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl border-3 ">
        <h4 className="font-bold text-xl mb-10 text-center text-gray-800">
          {tituloTabela}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
          {erros.map((erro, index) => (
            <div
              key={index}
              className={`flex items-center ${
                erro.full ? "md:col-span-2" : ""
              }`}
            >
              <div className="border-b-2 border-b-gray-400 w-full text-left">
                <h6 className="text-lg font-semibold text-gray-900">
                  {erro.titulo}:
                </h6>
              </div>
              {/* Se for usar o ícone, deixa aqui ao lado */}
              {/* <Eye className="text-gray-600 w-5 h-5 ml-2" /> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
