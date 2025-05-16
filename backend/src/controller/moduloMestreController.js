import moduloMestre from "../service/moduloMestre.js";

class ModuloMestreController {
  static async getTodos(req, res) {
    try {
      const dados = await moduloMestre.lerTodosCampos();
      res.json({
        sucess: "Sucesso!",
        data: dados,
      });
    } catch (err) {
      res.status(500).json({
        sucess: "Falha!",
        error: err.message,
      });
    }
  }
}
export default ModuloMestreController;
