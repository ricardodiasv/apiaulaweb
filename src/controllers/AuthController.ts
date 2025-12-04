//Importar a biblioteca Express
import express, {Request, Response} from "express";
import { AuthService } from "../services/AuthService";

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

//Exportar a instrução da rota
export default router