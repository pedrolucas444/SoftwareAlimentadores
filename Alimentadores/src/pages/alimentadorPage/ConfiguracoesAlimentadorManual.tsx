import { Card, CardContent } from "../../components/ui/card";

export default function ConfiguracoesAlimentadorManual() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-15">
      <Card>
        <CardContent className="p-3">
          <h2 className="font-bold text-center text-lg">CONFIGURAÇÕES MANUAL</h2>
          <div className="pt-4 flex justify-center">
            <div className="text-sm text-center space-y-2 pb-4">
              <label className="block font-medium text-lg">
                Id do alimentador
              </label>
              <select className="text-black px-3 py-2 rounded border-2 border-gray-700">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-lg space-y-3">
            <div className="space-y-1 text-center">
              <label className="block font-medium">MODO ATUAL</label>
              <div className="inline-block border-b border-gray-200 px-15 pb-0.5 space-y-1 text-center">
                Manual
              </div>
            </div>
            <div className="space-y-1 text-center">
              <label className="block font-medium">STATUS</label>
              <div className="inline-block border-b border-gray-200 px-15 pb-0.5 space-y-1 text-center">
                Ativo
              </div>
            </div>
            <div className="space-y-1 text-center col-span-2 mx-auto">
              <label className="block font-medium">DOSE MANUAL (g)</label>
              <div className="inline-block border-b border-gray-200 px-15 pb-0.5 space-y-1 text-center">
                500
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
