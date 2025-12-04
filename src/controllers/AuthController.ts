//Importar a biblioteca Express
import express, {Request, Response} from "express";
import { AuthService } from "../services/AuthService";
// Importar a biblioteca para validar os dados para cadastrar e editar
import * as yup from 'yup';
// Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
// Importar a entidade
import { User } from "../entity/Users";

import crypto from "crypto";


// Criar a Aplicação Express
const router = express.Router();

// Criar a rota para realizar o login
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/* 
{
    "email" : "ricardo@ricardo.com.br",
    "password" : "123456"
}
*/


//Criar a rota post principal
router.post("/", async (req:Request, res:Response)=>{
    try{
      const {email, password} = req.body;

      if(!email || !password){
        res.status(400).json({
          message: "Email e senha são obrigatórios!",
        });
        return;
      }

      const authService = new AuthService();

      const userData = await authService.login(email, password)

      // Retornar erro em caso de falha
    res.status(200).json({
      message: "Login Realizado com Sucesso!",
      user: userData
    });
    
    return;

    }catch(error: any){
    // Retornar erro em caso de falha
    res.status(401).json({
      message: error.message || "Erro ao realizar o login!",
    });
    return;

    }



});

/*
{
    "urlRecoverPassword" : "http://localhost",
    "email":"ricardo@ricardo.com.br"
}
*/

router.post("/recover-password", async(req:Request, res:Response) =>{
  try{
      // Receber os dados enviados no corpo da requisição
      var data = req.body;

      // Validar os dados utilizando o yup
        const schema = yup.object().shape({
          urlRecoverPassword: yup.string().required("A URL é obrigatória!"),
          email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
          
        });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      // Recuperar o registro do banco de dados com o valor da coluna email
      const user = await userRepository.findOneBy({ email: data.email });

      // Verificar se já existe um usuário com o mesmo e-mail
    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado",
      });
      return;
    }

    user.recoverPassword = crypto.randomBytes(32).toString("hex");

    await userRepository.save(user);

    // Retornar resposta de sucesso
    res.status(200).json({
      message: "Gerado o link para recuperar a senha!",
      urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
      key: user.recoverPassword,
    });

  }catch(error: any){
    // Retornar erro em caso de falha
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



//Exportar a instrução da rota
export default router