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
// Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
// Importar a conexão com banco de dados
const data_source_1 = require("../data-source");
// Importar a entidade
const Users_1 = require("../entity/Users");
// Importar o serviço de paginação
const PaginationService_1 = require("../services/PaginationService");
// Importar a biblioteca para validar os dados para cadastrar e editar
const yup = __importStar(require("yup"));
// Importar o Not para utilizar como restrição para ignorar o próprio id na consulta
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// Criar a aplicação Express
const router = express_1.default.Router();
// Criar a rota para listar os usuários
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/users?page=1&limit=10
router.get("/users", authMiddleware_1.verifyToken, async (req, res) => {
    try {
        // Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;
        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;
        // Usar o serviço de paginação
        const result = await PaginationService_1.PaginationService.paginate(userRepository, page, limit, { id: "DESC" });
        // Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result);
        return;
    }
    catch (error) {
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao listar os usuários!",
        });
        return;
    }
});
// Rota para visualizar um usuário específico
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/users/:id
router.get("/users/:id", authMiddleware_1.verifyToken, async (req, res) => {
    try {
        // Obter o ID do usuário a partir dos parâmetros da requisição
        const { id } = req.params;
        // Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Buscar o usuário no banco de dados pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        //Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        // Retornar o usuário encontrado
        res.status(200).json(user);
        return;
    }
    catch (error) {
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
router.post("/users", authMiddleware_1.verifyToken, async (req, res) => {
    try {
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
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Recuperar o registro do banco de dados com o valor da coluna email
        const existingUser = await userRepository.findOne({
            where: { email: data.email }
        });
        // Verificar se já existe um usuário com o mesmo e-mail
        if (existingUser) {
            res.status(400).json({
                message: "Já existe um usuário cadastro com esse e-mail",
            });
            return;
        }
        // Criptografar a senha antes de salvar
        //data.password = await bcrypt.hash(data.password, 10)
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
router.put("/users-password/:id", authMiddleware_1.verifyToken, async (req, res) => {
    try {
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
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Buscar o usuário no banco de dados pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        // Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        // Criptografar a senha antes de salvar
        //data.password = await bcrypt.hash(data.password, 10);
        // Atualizar os dados do usuário
        userRepository.merge(user, data);
        // Salvar as alterações no banco de dados
        const updateUser = await userRepository.save(user);
        // Retornar resposta de sucesso
        res.status(200).json({
            message: "Senha do usuário atualizado com sucesso!",
            user: updateUser
        });
    }
    catch (error) {
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
router.put("/users/:id", authMiddleware_1.verifyToken, async (req, res) => {
    try {
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
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Buscar o usuário no banco de dados pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        // Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        // Verificar se já existe outro usuário com o mesmo e-mail, mas que não seja o registro atual
        const existingUser = await userRepository.findOne({
            where: {
                email: data.email,
                id: (0, typeorm_1.Not)(parseInt(id)),
            },
        });
        if (existingUser) {
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
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
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
router.delete("/users/:id", authMiddleware_1.verifyToken, async (req, res) => {
    try {
        // Obter o ID do usuário a partir dos parâmetros da requisição
        const { id } = req.params;
        // Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        // Buscar o usuário no banco de dados pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        // Verificar se o usuário foi encontrado
        if (!user) {
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
    }
    catch (error) {
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao apagar o usuário!",
        });
    }
});
// Exportar a instrução que está dentro da constante router
exports.default = router;
