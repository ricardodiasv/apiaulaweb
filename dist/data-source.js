"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
// Importar variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregando as variaveis do .env
dotenv_1.default.config();
const dialect = process.env.DB_DIALECT ?? "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [
        // aceita rodar tanto em src (.ts) quanto em dist (.js)
        path_1.default.join(__dirname, "migration", "*.{js,ts}").replace(/\\/g, "/"),
    ],
});
