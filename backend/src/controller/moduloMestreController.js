import moduloMestre from "../service/moduloMestre.js";

class moduloMestreController {
  static async getTodos(request, response) {
    try {
      const data = await moduloMestre.lerTodosCampos();
      response.json({
        success: true,
        data,
      });
    } catch (err) {
      response.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async getAlimentador(request, response) {
    try {
      const id = Number(request.params.id);
      if (isNaN(id)) {
        return response.status(400).json({
          success: false,
          error: "ID inválido",
        });
      }

      const dados = await moduloMestre.lerAlimentador(id);
      response.json({
        success: true,
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        success: false,
        error: "Erro ao acessar os dados",
      });
    }
  }

  static async getAlimentadorEscrita(request, response) {
    try {
      const id = Number(request.params.id);
      if (isNaN(id)) {
        return response
          .status(400)
          .json({ success: false, error: "ID inválido" });
      }
      const dados = await moduloMestre.getAlimentadorEscrita(id);
      response.json({
        success: true,
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async setAlimentador(request, response) {
    try {
      const id = Number(request.params.id);
      const campos = request.body;

      for (const [config, valor] of Object.entries(campos)) {
        if (typeof valor === "number" && !isNaN(valor)) {
          await moduloMestre.adicionarNaFila(id, config, valor);
        } else {
          console.log(
            `[WARN] Ignorando escrita de ${config}: tipo=${typeof valor}, valor=${valor}`
          );
        }
      }

      response.json({
        success: true,
        message: "Enviado com Sucesso!",
        data: { id, ...campos },
      });
    } catch (err) {
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
    } catch (err) {
      response.status(500).json({
        success: false,
        error: "Erro ao enviar o IP",
      });
    }
  }

  static async getHistorico(request, response) {
    try {
      const dados = moduloMestre.getHistoricoLeituras();
      response.json({
        success: true,
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        success: false,
        error: "Erro ao acessar o histórico",
      });
    }
  }

  static async getUltimoDeCadaID(request, response) {
    try {
      const dados = moduloMestre.getUltimoDeCadaID();
      response.json({
        success: true,
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        success: false,
        error: "Erro ao acessar o último de cada ID",
      });
    }
  }

  static async getUltimoSetPointManual(request, response) {
    response.status(501).json({
      success: false,
      error: "Função não implementada sem repository",
    });
  }

  static async setRegistraPosicao(request, response) {
    response.status(501).json({
      success: false,
      error: "Função não implementada sem repository",
    });
  }
}

export default moduloMestreController;
