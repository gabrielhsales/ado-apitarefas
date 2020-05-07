"use strict";

const Tarefa = use("App/Models/Tarefa");

const Arquivo = use("App/Models/Arquivo");

const Helpers = use("Helpers");

class ArquivoController {
  /**
   * Show the form for creating a new resource.
   */
  async create({ params, request, response, auth }) {
    try {
      let tarefa = await Tarefa.findOrFail(params.id);

      let arquivos = request.file("file", {
        size: "1mb",
      });

      await arquivos.moveAll(Helpers.tmpPath("arquivos"), (file) => ({
        name: `${Date.now()}-${file.clientName}`,
      }));

      if (!arquivos.moveAll()) {
        return response.status(401).send({
          message: "Erro ao fazer upload",
        });
      }

      //1° forma de enviar nome do arquivo no bd
      //  await  Promise.all(
      //       arquivos
      //       .movedList()
      //       .map(item => Arquivo.create({ tarefa_id : tarefa.id , caminho: item.fileName}))
      //   )

      //2° usando o relaciomento pois o arquivo pertence a uma tarefa+

      await Promise.all(
        arquivos.movedList().map((item) =>
          tarefa.arquivos().create({ caminho: item.fileName })
        )
      );

      return response.status(201).send({
        message: "ok",
      });



    } catch (error) {
      return response.status(500).send({
        message: error.message,
      });
    }
  }
}

module.exports = ArquivoController;
