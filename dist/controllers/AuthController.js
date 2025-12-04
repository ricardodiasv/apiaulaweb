"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
const AuthService_1 = require("../services/AuthService");
// Importar a biblioteca para validar os dados para cadastrar e editar
const yup = __importStar(require("yup"));
// Importar a conexão com banco de dados
const data_source_1 = require("../data-source");
// Importar a entidade
const Users_1 = require("../entity/Users");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Criar a Aplicação Express
const router = express_1.default.Router();
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
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email e senha são obrigatórios!",
            });
            return;
        }
        const authService = new AuthService_1.AuthService();
        const userData = await authService.login(email, password);
        // Retornar erro em caso de falha
        res.status(200).json({
            message: "Login Realizado com Sucesso!",
            user: userData
        });
        return;
    }
    catch (error) {
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
router.post("/recover-password", async (req, res) => {
    try {
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
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email });
        // Verificar se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado",
            });
            return;
        }
        user.recoverPassword = crypto_1.default.randomBytes(32).toString("hex");
        await userRepository.save(user);
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        var message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar Senha",
            text: `Prezando(a) ${user.name} \n\n
      Informamos que a sua solicitação de alteração de senha foi recebida com sucesso. \n\n
      Clique ou copie o link para criar uma nova senha em nosso sistema:
      ${data.urlRecoverPassword}?email=${data.email}key=${user.recoverPassword}\n\n
      Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\n
      Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
      Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexadas ou solicita
      o preenchimento de senhas e informações cadastrais. \n\n`,
            html: `Prezado(a) ${user.name} <br><br>
      Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
      Clique no link para criar uma nova senha em nosso sistema:
      <a href='${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}'>${data.urlRecoverPassword}?email=${data.email}$key=${user.recoverPassword}</a><br><br> 
      Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
      Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>`, // HTML body
        };
        transporter.sendMail(message_content, function (err) {
            if (err) {
                console.log("Erro ao enviar email:", err);
                res.status(200).json({
                    message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`,
                });
                return;
            }
            else {
                // Retornar resposta de sucesso
                res.status(200).json({
                    message: "Email enviado! Verifique sua caixa de entrada!",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                });
                return;
            }
        });
    }
    catch (error) {
        // Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
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
/*
rota POST: http://localhost:8080/validate-recover-password

{
    "recoverPassword": "chave-recuperar-senha",
    "email" : "ricardo@ricardo.com.br"
}
*/
router.post("/validate-recover-password", async (req, res) => {
    try {
        // Receber os dados enviados no corpo da requisição
        var data = req.body;
        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
        });
        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });
        // Criar uma instância do repositório de User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });
        // Verificar se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                message: "A chave recuperar senha é inválida",
            });
            return;
        }
        res.status(200).json({
            message: "A chave recuperar senha é válida",
        });
        return;
    }
    catch (error) {
        // Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "A chave recuperar senha é inválida",
        });
    }
});
/*
  rota POST: http://localhost:8080/update-password

  {
      "recoverPassword" : "chave-recuperar-senha",
      "email" : "ricardo@ricardo.com.br",
      "password" : "123456"
  }


*/
router.put("/update-password", async (req, res) => {
    try {
        // Receber os dados enviados no corpo da requisição
        var data = req.body;
        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
            password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no mínimo 6 caracteres"),
        });
        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });
        // Criar uma instância do repositório de User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });
        // Verificar se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                message: "A chave recuperar senha é inválida",
            });
            return;
        }
        data.recoverPassword = null;
        userRepository.merge(user, data);
        await userRepository.save(user);
        res.status(200).json({
            message: "Senha atualizada com sucesso!",
        });
        return;
    }
    catch (error) {
        // Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "A chave recuperar senha é inválida",
        });
    }
});
//Exportar a instrução da rota
exports.default = router;
