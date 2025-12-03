"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importar a entidade
const Users_1 = require("../entity/Users");
const Situations_1 = require("../entity/Situations");
// Importar a biblioteca para criptografar a senha
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUsersSeeds {
    async run(dataSource) {
        console.log("Iniciandoi o seed para a tabela 'users'...");
        // Obter o repositório da entidade User e Situation
        const userRepository = dataSource.getRepository(Users_1.User);
        const situationRepository = dataSource.getRepository(Situations_1.Situation);
        // Verifica se já existem registros na tabela
        const existingCount = await userRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        // Buscar a situação no banco de dados
        const situation = await situationRepository.findOne({ where: { id: 1 } });
        // Verificar se encontrou a situação no banco de dados
        if (!situation) {
            console.error("Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'situations' está populada.");
            return;
        }
        // Criar os usuários com a referência correta à situação
        const users = [
            {
                id: 1,
                name: "Ricardo Gabriel",
                email: "ricardo@ricardo.com.br",
                password: await bcryptjs_1.default.hash("123456", 10),
                situation: situation,
            },
            {
                id: 2,
                name: "Pedro",
                email: "pedro@ricardo.com.br",
                password: await bcryptjs_1.default.hash("123456", 10),
                situation: situation,
            },
        ];
        // Salvar os registros no banco de dados
        await userRepository.save(users);
        console.log("Seed concluído com sucesso: usuarios cadastrados!");
    }
}
exports.default = CreateUsersSeeds;
