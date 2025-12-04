"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../data-source");
const Users_1 = require("../entity/Users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importar variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregando as variaveis do .env
dotenv_1.default.config();
class AuthService {
    userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
    /*
    @param email
    @param password
    @return
    @throws
    */
    async login(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Usuário ou senha inválidos!");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Usuário ou senha inválidos!");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return { id: user.id, name: user.name, email: user.email, token };
    }
}
exports.AuthService = AuthService;
