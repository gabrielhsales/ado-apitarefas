"use strict";

const User = use("App/Models/User");

const { validateAll } = use("Validator");

class UserController {
  /**
   * Show the form for creating a new resource.
   */
  async create({ request, response }) {
    try {
      let errorMsgCustom = {
        "username.required": "Esse campo é obrigátorio",
        "username.unique": "Esse username já existe",
        "username.min": "Esse campo de conter no minimo 5 caracteres",
        "email.required": "Esse campo é obrigátorio",
        "email.unique": "Esse email já existe",
        "password.required": "Esse campo é obrigátorio",
        "password.min": "Esse campo de conter no minimo 6 caracteres",
      };

      let validation = await validateAll(
        request.all(),
        {
          username: "required|min:5|unique:users",
          email: "required|email|unique:users",
          password: "required|min:6",
        },
        errorMsgCustom
      );

      if (validation.fails()) {
        return response.status(401).send({
          message: validation.messages(),
        });
      }

      let data = request.only(["username", "email", "password"]);
      //console.log(data);

      let user = await User.create(data);

      return user;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  async login({ request, view, response, auth }) {
    try {
      let { email, password } = request.all();

      //função do adonis que valida o usuario e retorna um token
      let validaToken = auth.attempt(email, password);

      return validaToken;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = UserController;
