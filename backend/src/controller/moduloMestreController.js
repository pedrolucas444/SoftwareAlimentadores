import moduloMestre from "../service/moduloMestre.js";

class ModuloMestreController {
  static async getTodos(request, response) {
    try {
      const dados = await moduloMestre.lerTodosCampos();
      response.json({
        sucess: "Sucesso!",
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        sucess: "Falha request",
        error: err.message,
      });
    }
  }

  static async getAlimentador(request, response) {
    try {
      const dados = await moduloMestre.lerAlimentador();
      response.json({
        sucess: "Sucesso!",
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        sucess: "Falha request",
        error: err.message,
      });
    }
  }

  static async getErros(request, response) {
    try {
      const dados = await moduloMestre.lerErros();
      response.json({
        sucess: "Sucesso!",
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        sucess: "Falha request",
        error: err.message,
      });
    }
  }

  static async getTemperaturaUmidade(request, response) {
    try {
      const dados = await moduloMestre.lerTemperaturaUmidade();
      response.json({
        sucess: "Sucesso!",
        data: dados,
      });
    } catch (err) {
      response.status(500).json({
        sucess: "Falha request",
        error: err.message,
      });
    }
  }

  static async setIP(request, response) {
    try {
      const { ip } = request.body;
      if (!ip) {
        return response.status(400).json({ error: "IP não informado" });
      }
      moduloMestre.setIpModuloMestre(ip);
      response.json({
        sucess: true,
        message: "IP atualizado com sucesso",
        ip,
      });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }

  static async setConfig(request, response) {
    try {
      const dados = request.body;
      for (const [campo, valor] of Object.entries(dados)) {
        await moduloMestre.escreverDispositivo("alimentador", campo, valor);
      }
      response.json({
        sucess: true,
        message: "Configuração enviada com sucesso",
        dados,
      });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }

  static async setID(request, response) {
    try {
      const dados = request.body;
      for (const [campo, valor] of Object.entries(dados)) {
        await moduloMestre.escreverDispositivo("alimentador", campo, valor);
      }
      const alimentador = await moduloMestre.lerAlimentador();
      delete alimentador.Alimentador;
      response.json(alimentador);
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
}
export default ModuloMestreController;
