"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
//Importar o arquivo com as credenciais do banco de dados
const data_source_1 = require("../data-source");
// Criar a Aplicação Express
const router = express_1.default.Router();
//Inicializar a conexão com BD
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Conexão do banco de dados realizado com sucesso!");
}).catch((error) => {
    console.log("Erro na conexão com o banco de dados!", error);
});
//Criar a rota GET principal
router.get("/", (req, res) => {
    res.send("Bem-vindo Pessoal! Tela de login da rota");
});
//Exportar a instrução da rota
exports.default = router;
