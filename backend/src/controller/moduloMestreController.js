import moduloMestre from "../service/moduloMestre.js";

class ModuloMestreController {
  static async getTodos(request, response) {
    try {
      const data = await moduloMestre.lerTodosCampos();
      response.json({
        sucess: true,
        data,
      });
    } catch (err) {
      response.status(500).json({
        sucess: false,
        error: err.message,
      });
    }
  }

  static async getAlimentador(request, response) {
    try {
      const id = Number(request.params.id);
      const data = await moduloMestre.lerAlimentador(id);
      response.json({
        sucess: true,
        data,
      });
    } catch (err) {
      response.status(500).json({
        sucess: false,
        error: err.message,
      });
    }
  }

  static async getErros(request, response) {
    try {
      const data = await moduloMestre.lerErros();
      response.json({
        sucess: true,
        data,
      });
    } catch (err) {
      response.status(500).json({
        sucess: false,
        error: err.message,
      });
    }
  }

  static async getTemperaturaUmidade(request, response) {
    try {
      const data = await moduloMestre.lerTemperaturaUmidade();
      response.json({
        sucess: true,
        data,
      });
    } catch (err) {
      response.status(500).json({
        sucess: false,
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
      response.status(500).json({
        sucess: false,
        error: err.message,
      });
    }
  }

  static async setConfig(request, response) {
    try {
      const dados = request.body;
      for (const [campo, valor] of Object.entries(dados)) {
        await moduloMestre.escreverDispositivo(campo, valor);
      }
      response.json({
        sucess: true,
        message: "Configuração enviada com sucesso",
      });
    } catch (err) {
      response.status(500).json({
        sucess: false,
        error: err.message,
      });
    }
  }
}
export default ModuloMestreController;
