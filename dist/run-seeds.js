"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const CreateSituationsSeeds_1 = __importDefault(require("./seeds/CreateSituationsSeeds"));
const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");
    await data_source_1.AppDataSource.initialize();
    console.log("Banco de dados conectado!");
    try {
        //Cria a instancia da classes de seed
        const situationsSeeds = new CreateSituationsSeeds_1.default();
        //Executa as Seeds
        await situationsSeeds.run(data_source_1.AppDataSource);
    }
    catch (error) {
        console.log("Erro ao executar o seed:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};
runSeeds();
