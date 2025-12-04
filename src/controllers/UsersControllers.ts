// Importar a biblioteca Express
import express, { Request, Response } from "express";
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { User } from "../entity/Users";
// Importar o serviço de paginação
import { PaginationService } from "../services/PaginationService";
// Importar a biblioteca para validar os dados para cadastrar e editar
import * as yup from 'yup';
// Importar o Not para utilizar como restrição para ignorar o próprio id na consulta
import { Not } from "typeorm";
// Importar a biblioteca para criptografar a senha
import bcrypt from "bcryptjs"

import {verifyToken} from "../middlewares/authMiddleware"

// Criar a aplicação Express
const router = express.Router();

// Criar a rota para listar os usuários
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/users?page=1&limit=10
router.get("/users",verifyToken, async (req: Request, res: Response) => {
  try{

    // Obter o repositório da entidade User
    const userRepository = AppDataSource.getRepository(User);

    // Receber o número da página e definir página 1 como padrão
    const page = Number(req.query.page) || 1;

    // Definir o limite de registros por página
    const limit = Number(req.query.limit) || 10;

    // Usar o serviço de paginação
    const result = await PaginationService.paginate(userRepository, page, limit, { id: "DESC" });

    // Retornar a resposta com os dados e informações da paginação
    res.status(200).json(result);
    return;
  } catch(error){
    // Retornar erro em caso de falha
    res.status(500).json({
      message: "Erro ao listar os usuários!",
    });
    return;
  } 
});
// Rota para visualizar um usuário específico
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/users/:id
router.get("/users/:id", verifyToken,async (req: Request, res: Response) => {
  try{

    // Obter o ID do usuário a partir dos parâmetros da requisição
    const { id } = req.params;

    // Obter o repositório da entidade User
    const userRepository = AppDataSource.getRepository(User)

    // Buscar o usuário no banco de dados pelo ID
    const user = await userRepository.findOneBy({ id: parseInt(id!) });

    //Verificar se o usuário foi encontrado
    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    // Retornar o usuário encontrado
    res.status(200).json(user);
    return;
  
  } catch(error){
    // Retornar erro em caso de falha
    res.status(500).json({
      message: "Erro ao visualizar o usuário!",
    });
  }
});

// Criar a rota para cadastrar usuário 
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/users
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name" : "Ricardo Gabriel",
    "email" : "ricardo@ricardo.com.br",
    "password" : "123456",
    "situation" : 1
}
*/

router.post("/users", verifyToken, async (req: Request, res: Response) => {
  
  try{
    // Receber os dados enviados no corpo da requisição
    var data = req.body;

    // Validar os dados utilizando o yup
    const schema = yup.object().shape({
      name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
      email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
      password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres"),
      situation: yup.number().required("O campo situação é obrigatório"),
    });

    // Verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });

    // Criar uma instância do repositório de User
    const userRepository = AppDataSource.getRepository(User);

    // Recuperar o registro do banco de dados com o valor da coluna email
    const existingUser = await userRepository.findOne({
      where: { email: data.email }
    });

    // Verificar se já existe um usuário com o mesmo e-mail
    if(existingUser){
      res.status(400).json({
        message: "Já existe um usuário cadastro com esse e-mail",
      });
      return;
    }
    // Criptografar a senha antes de salvar
    data.password = await bcrypt.hash(data.password, 10)

    // Criar um novo registro
    const newUser = userRepository.create(data);

    // Salvar o registro no banco de dados
    await userRepository.save(newUser);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Usuário cadastro com sucesso!",
      situation: newUser,
    });
  }
  catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          message: "Falha na validação dos dados",
          errors: error.errors, 
          fields: error.inner.map(e => ({ path: e.path, message: e.message }))
        });
      }
  
      console.error(error);
      return res.status(500).json({ message: "Erro interno ao cadastrar o usuário" });
    }
  
});

// Crar a rota para editar senha do usuário
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http:localhost:8080/users-password/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
  "password":"123456"
}
*/
router.put("/users-password/:id", verifyToken, async (req: Request, res: Response) => {

  try{
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      // Validar os dados utilizando o yup
      const schema = yup.object().shape({
        password: yup.string().required("O campo senha é obrigatório!").min(6, "A senha deve ter no mínimo 6 caractéres")
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      // Buscar o usuário no banco de dados pelo ID
      const user = await userRepository.findOneBy({ id: parseInt(id!) })

      // Verificar se o usuário foi encontrado
      if(!user){
        res.status(404).json({
          message: "Usuário não encontrado!",
        });
        return;
      }
      
      // Criptografar a senha antes de salvar
      data.password = await bcrypt.hash(data.password, 10);

      // Atualizar os dados do usuário
      userRepository.merge(user, data);

      // Salvar as alterações no banco de dados
      const updateUser = await userRepository.save(user);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Senha do usuário atualizado com sucesso!",
        user: updateUser
      });

    }catch(error){
      if(error instanceof yup.ValidationError){
        // Retornar erros de validação
        res.status(400).json({
          message: error.errors
        });
        return;
      }

      // Retornar erro em caso de falha
      res.status(500).json({
        message: "Erro ao editar a senha do usuário!",
      });
    }
    });

// Criar a rota para editar um usuário
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/users/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/* 
{
    "name": "gabriel",
    "email" : "gabriel@ricardo.com.br",
    "situation":1
}
*/
router.put("/users/:id", verifyToken, async (req: Request, res: Response) => {

  try{
    // Obter o ID da situação a partir dos parâmetros da requisição
    const { id } = req.params;

    // Receber os dados enviados no corpo da requisição
    const data = req.body;

    // Validar os dados utilizando o yup
    const schema = yup.object().shape({
      name: yup.string().required("O campo nome é obrigatorio!").min(3, "O campo nome deve ter no mínimo 3 caraceres"),
      email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
      situation: yup.number().required("O campo situação é obrigatório!"),
    });

    // Verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });

    // Obter o repositório da entidade User
    const userRepository = AppDataSource.getRepository(User);

    // Buscar o usuário no banco de dados pelo ID
    const user = await userRepository.findOneBy({ id: parseInt(id!) });

    // Verificar se o usuário foi encontrado
    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    // Verificar se já existe outro usuário com o mesmo e-mail, mas que não seja o registro atual
    const existingUser = await userRepository.findOne({
      where: {
        email: data.email,
        id: Not(parseInt(id!)),
      },
    });

    if(existingUser){
      res.status(400).json({
        message: "Já existe um usuário cadastrado com esse nome!",
      });
      return;
    }

    // Atualizar os dados do usuário
    userRepository.merge(user, data);

    // Salvar as alterações no banco de dados
    const updateUser = await userRepository.save(user);

    // Retornar resposta de sucesso
    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      user: updateUser
    });
  
  }catch(error){
    if(error instanceof yup.ValidationError){
      // Retornar erros de validação
      res.status(400).json({
        message: error.errors
      });
      return;
    }

    // Retornar erro em caso de falha
    res.status(500).json({
      message: "Erro ao editar usuário!",
    });
  }
});

// Criar a rota para apagar um usuário
// Endereço para acessar a API através da aplicação externa com o verbo DELETE: http://localhost:8080/users/:id
router.delete("/users/:id", verifyToken, async (req: Request, res: Response) => {
  try{
    // Obter o ID do usuário a partir dos parâmetros da requisição
    const { id } = req.params;

    // Obter o repositório da entidade User
    const userRepository = AppDataSource.getRepository(User);

    // Buscar o usuário no banco de dados pelo ID
    const user = await userRepository.findOneBy({ id: parseInt(id!)});

    // Verificar se o usuário foi encontrado
    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    // Remover o usuário do banco de dados
    await userRepository.remove(user);

    // Retornar resposta de sucesso
    res.status(200).json({
      message: "Usuário apagado com sucesso!"
    });

  }catch (error){
    // Retornar erro em caso de falha
    res.status(500).json({
      message: "Erro ao apagar o usuário!",
    });
  }
});

// Exportar a instrução que está dentro da constante router
export default router;

