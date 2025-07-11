import moduloMestre from "../service/moduloMestre.js";

class moduloMestreController {
  static async setAlimentador(request, response) {
    try {
      const campos = request.body;
      for (const [config, valor] of Object.entries(campos)) {
        if (typeof valor === "number" && !isNaN(valor)) {
          await moduloMestre.adicionarFila(campos.id, config, valor);
        }
      }

      response.json({
        success: true,
        message: "Enviado com Sucesso!",
        data: { campos },
      });
    } catch {
      response.status(500).json({
        success: false,
        error: "Erro ao enviar para alimentador",
      });
    }
  }

  static async setIP(request, response) {
    try {
      const { ip } = request.body;
      await moduloMestre.setIpModuloMestre(ip);
      response.json({
        success: true,
        message: "Enviado com Sucesso!",
      });
    } catch {
      response.status(500).json({
        success: false,
        error: "Erro ao enviar o IP",
      });
    }
  }
}

export default moduloMestreController;
